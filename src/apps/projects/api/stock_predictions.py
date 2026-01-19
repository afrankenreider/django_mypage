"""Stock price prediction API endpoints using lightweight ML models.

This module provides endpoints for running machine learning predictions on stock data.
Models are designed to be lightweight and fast for educational purposes.

DISCLAIMER: These predictions are for educational and learning purposes only.
They should NOT be used as financial advice or for making investment decisions.
"""

import time
from typing import Any

import numpy as np
import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.request import Request

# Maximum constraints for resource protection
MAX_TRAINING_POINTS = 730  # Maximum historical data points for training
MAX_FORECAST_HORIZON = 30  # Maximum days to forecast
MAX_EXECUTION_TIME = 30  # Maximum seconds for model training
MIN_TRAINING_POINTS = 30  # Minimum data points required for training


def _prepare_features(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
    """Prepare features for ML models from OHLCV data.

    Creates technical indicators as features:
    - Lagged prices (1-5 days)
    - Simple moving averages (5, 10, 20 days)
    - Price momentum
    - Volume changes
    - Price range (high-low)
    """
    data = df.copy()

    # Create lagged features
    for lag in range(1, 6):
        data[f"lag_{lag}"] = data["close"].shift(lag)

    # Moving averages
    data["sma_5"] = data["close"].rolling(window=5).mean()
    data["sma_10"] = data["close"].rolling(window=10).mean()
    data["sma_20"] = data["close"].rolling(window=20).mean()

    # Momentum (rate of change)
    data["momentum_5"] = data["close"].pct_change(periods=5)
    data["momentum_10"] = data["close"].pct_change(periods=10)

    # Volume change
    data["volume_change"] = data["volume"].pct_change()

    # Price range
    data["price_range"] = data["high"] - data["low"]

    # Drop rows with NaN values
    data = data.dropna()

    # Feature columns
    feature_cols = [
        "lag_1",
        "lag_2",
        "lag_3",
        "lag_4",
        "lag_5",
        "sma_5",
        "sma_10",
        "sma_20",
        "momentum_5",
        "momentum_10",
        "volume_change",
        "price_range",
    ]

    X = data[feature_cols].values
    y = data["close"].values

    return X, y


def _arima_predict(
    close_prices: np.ndarray,
    forecast_horizon: int,
    order: tuple[int, int, int] = (5, 1, 0),
) -> dict[str, Any]:
    """Run ARIMA prediction on close prices.

    Args:
        close_prices: Array of historical close prices
        forecast_horizon: Number of periods to forecast
        order: ARIMA order (p, d, q)

    Returns:
        Dictionary with predictions and model info
    """
    try:
        from statsmodels.tsa.arima.model import ARIMA

        # Fit ARIMA model
        model = ARIMA(close_prices, order=order)
        fitted_model = model.fit()

        # Generate forecast
        forecast = fitted_model.forecast(steps=forecast_horizon)

        # Get confidence intervals
        forecast_result = fitted_model.get_forecast(steps=forecast_horizon)
        conf_int = forecast_result.conf_int(alpha=0.05)

        return {
            "predictions": forecast.tolist(),
            "confidence_lower": conf_int[:, 0].tolist(),
            "confidence_upper": conf_int[:, 1].tolist(),
            "model_info": {
                "aic": round(fitted_model.aic, 2),
                "bic": round(fitted_model.bic, 2),
            },
        }
    except Exception as e:
        raise ValueError(f"ARIMA model failed: {str(e)}") from e


def _xgboost_predict(
    X: np.ndarray,
    y: np.ndarray,
    forecast_horizon: int,
    last_features: np.ndarray,
    hyperparams: dict[str, Any],
) -> dict[str, Any]:
    """Run XGBoost prediction.

    Args:
        X: Feature matrix
        y: Target values (close prices)
        forecast_horizon: Number of periods to forecast
        last_features: Most recent feature values for prediction
        hyperparams: Model hyperparameters

    Returns:
        Dictionary with predictions and model info
    """
    try:
        import xgboost as xgb

        # Extract hyperparameters with defaults
        params = {
            "n_estimators": min(hyperparams.get("n_estimators", 100), 200),
            "max_depth": min(hyperparams.get("max_depth", 3), 6),
            "learning_rate": max(0.01, min(hyperparams.get("learning_rate", 0.1), 0.3)),
            "subsample": max(0.5, min(hyperparams.get("subsample", 0.8), 1.0)),
            "colsample_bytree": max(
                0.5, min(hyperparams.get("colsample_bytree", 0.8), 1.0)
            ),
            "random_state": 42,
            "n_jobs": 1,  # Limit CPU usage
        }

        # Create and train model
        model = xgb.XGBRegressor(**params)
        model.fit(X, y, verbose=False)

        # Generate predictions iteratively
        predictions = []
        current_features = last_features.copy()

        for _ in range(forecast_horizon):
            pred = model.predict(current_features.reshape(1, -1))[0]
            predictions.append(float(pred))

            # Shift features for next prediction
            # Update lagged prices
            current_features = np.roll(current_features, 1)
            current_features[0] = pred  # New lag_1

        # Calculate simple confidence interval based on training error
        train_preds = model.predict(X)
        rmse = np.sqrt(np.mean((train_preds - y) ** 2))

        return {
            "predictions": predictions,
            "confidence_lower": [p - 1.96 * rmse for p in predictions],
            "confidence_upper": [p + 1.96 * rmse for p in predictions],
            "model_info": {
                "rmse": round(rmse, 2),
                "feature_importance": dict(
                    zip(
                        [
                            "lag_1",
                            "lag_2",
                            "lag_3",
                            "lag_4",
                            "lag_5",
                            "sma_5",
                            "sma_10",
                            "sma_20",
                            "momentum_5",
                            "momentum_10",
                            "volume_change",
                            "price_range",
                        ],
                        [round(float(x), 4) for x in model.feature_importances_],
                        strict=True,
                    )
                ),
            },
        }
    except ImportError as e:
        raise ValueError(
            "XGBoost is not installed. Please install xgboost package."
        ) from e
    except Exception as e:
        raise ValueError(f"XGBoost model failed: {str(e)}") from e


def _catboost_predict(
    X: np.ndarray,
    y: np.ndarray,
    forecast_horizon: int,
    last_features: np.ndarray,
    hyperparams: dict[str, Any],
) -> dict[str, Any]:
    """Run CatBoost prediction.

    Args:
        X: Feature matrix
        y: Target values (close prices)
        forecast_horizon: Number of periods to forecast
        last_features: Most recent feature values for prediction
        hyperparams: Model hyperparameters

    Returns:
        Dictionary with predictions and model info
    """
    try:
        from catboost import CatBoostRegressor

        # Extract hyperparameters with defaults and limits
        params = {
            "iterations": min(hyperparams.get("iterations", 100), 200),
            "depth": min(hyperparams.get("depth", 4), 6),
            "learning_rate": max(0.01, min(hyperparams.get("learning_rate", 0.1), 0.3)),
            "l2_leaf_reg": max(1, min(hyperparams.get("l2_leaf_reg", 3), 10)),
            "random_seed": 42,
            "verbose": False,
            "thread_count": 1,  # Limit CPU usage
        }

        # Create and train model
        model = CatBoostRegressor(**params)
        model.fit(X, y, verbose=False)

        # Generate predictions iteratively
        predictions = []
        current_features = last_features.copy()

        for _ in range(forecast_horizon):
            pred = model.predict(current_features.reshape(1, -1))[0]
            predictions.append(float(pred))

            # Shift features for next prediction
            current_features = np.roll(current_features, 1)
            current_features[0] = pred

        # Calculate confidence interval based on training error
        train_preds = model.predict(X)
        rmse = np.sqrt(np.mean((train_preds - y) ** 2))

        return {
            "predictions": predictions,
            "confidence_lower": [p - 1.96 * rmse for p in predictions],
            "confidence_upper": [p + 1.96 * rmse for p in predictions],
            "model_info": {
                "rmse": round(rmse, 2),
                "feature_importance": dict(
                    zip(
                        [
                            "lag_1",
                            "lag_2",
                            "lag_3",
                            "lag_4",
                            "lag_5",
                            "sma_5",
                            "sma_10",
                            "sma_20",
                            "momentum_5",
                            "momentum_10",
                            "volume_change",
                            "price_range",
                        ],
                        [round(float(x), 4) for x in model.feature_importances_],
                        strict=True,
                    )
                ),
            },
        }
    except ImportError as e:
        raise ValueError(
            "CatBoost is not installed. Please install catboost package."
        ) from e
    except Exception as e:
        raise ValueError(f"CatBoost model failed: {str(e)}") from e


def _lightgbm_predict(
    X: np.ndarray,
    y: np.ndarray,
    forecast_horizon: int,
    last_features: np.ndarray,
    hyperparams: dict[str, Any],
) -> dict[str, Any]:
    """Run LightGBM prediction.

    Args:
        X: Feature matrix
        y: Target values (close prices)
        forecast_horizon: Number of periods to forecast
        last_features: Most recent feature values for prediction
        hyperparams: Model hyperparameters

    Returns:
        Dictionary with predictions and model info
    """
    try:
        import lightgbm as lgb

        # Extract hyperparameters with defaults and limits
        params = {
            "n_estimators": min(hyperparams.get("n_estimators", 100), 200),
            "max_depth": min(hyperparams.get("max_depth", 3), 6),
            "learning_rate": max(0.01, min(hyperparams.get("learning_rate", 0.1), 0.3)),
            "num_leaves": min(hyperparams.get("num_leaves", 31), 50),
            "subsample": max(0.5, min(hyperparams.get("subsample", 0.8), 1.0)),
            "colsample_bytree": max(
                0.5, min(hyperparams.get("colsample_bytree", 0.8), 1.0)
            ),
            "random_state": 42,
            "n_jobs": 1,
            "verbose": -1,
        }

        # Create and train model
        model = lgb.LGBMRegressor(**params)
        model.fit(X, y)

        # Generate predictions iteratively
        predictions = []
        current_features = last_features.copy()

        for _ in range(forecast_horizon):
            pred = model.predict(current_features.reshape(1, -1))[0]
            predictions.append(float(pred))

            current_features = np.roll(current_features, 1)
            current_features[0] = pred

        # Calculate confidence interval
        train_preds = model.predict(X)
        rmse = np.sqrt(np.mean((train_preds - y) ** 2))

        return {
            "predictions": predictions,
            "confidence_lower": [p - 1.96 * rmse for p in predictions],
            "confidence_upper": [p + 1.96 * rmse for p in predictions],
            "model_info": {
                "rmse": round(rmse, 2),
                "feature_importance": dict(
                    zip(
                        [
                            "lag_1",
                            "lag_2",
                            "lag_3",
                            "lag_4",
                            "lag_5",
                            "sma_5",
                            "sma_10",
                            "sma_20",
                            "momentum_5",
                            "momentum_10",
                            "volume_change",
                            "price_range",
                        ],
                        [round(float(x), 4) for x in model.feature_importances_],
                        strict=True,
                    )
                ),
            },
        }
    except ImportError as e:
        raise ValueError(
            "LightGBM is not installed. Please install lightgbm package."
        ) from e
    except Exception as e:
        raise ValueError(f"LightGBM model failed: {str(e)}") from e


@api_view(["POST"])
def predict_stock_price(request: Request) -> JsonResponse:
    """Generate stock price predictions using ML models.

    Request Body:
        symbol: Stock ticker symbol
        model: Model type ('arima', 'xgboost', 'catboost', 'lightgbm')
        forecast_horizon: Number of days to forecast (1-30)
        hyperparams: Model-specific hyperparameters (optional)

    Returns:
        JSON response with predictions, confidence intervals, and model info.

    Note: This is for educational purposes only and should not be used
    as financial advice.
    """
    start_time = time.time()

    # Extract request parameters
    symbol = request.data.get("symbol", "").upper().strip()
    model_type = request.data.get("model", "arima").lower()
    forecast_horizon = request.data.get("forecast_horizon", 7)
    hyperparams = request.data.get("hyperparams", {})

    # Validate inputs
    if not symbol:
        return JsonResponse(
            {"error": "Symbol parameter is required"},
            status=400,
        )

    valid_models = ["arima", "xgboost", "catboost", "lightgbm"]
    if model_type not in valid_models:
        return JsonResponse(
            {"error": f"Invalid model. Must be one of: {', '.join(valid_models)}"},
            status=400,
        )

    # Enforce forecast horizon limits
    forecast_horizon = max(1, min(int(forecast_horizon), MAX_FORECAST_HORIZON))

    try:
        import yfinance as yf

        # Fetch historical data (limit to prevent resource abuse)
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="2y", interval="1d")

        if hist.empty:
            return JsonResponse(
                {"error": f"No historical data found for symbol: {symbol}"},
                status=404,
            )

        # Limit data points
        hist = hist.tail(MAX_TRAINING_POINTS)

        if len(hist) < MIN_TRAINING_POINTS:
            return JsonResponse(
                {
                    "error": f"Insufficient data. Need at least {MIN_TRAINING_POINTS} "
                    f"data points, got {len(hist)}."
                },
                status=400,
            )

        # Prepare DataFrame
        df = pd.DataFrame(
            {
                "open": hist["Open"].values,
                "high": hist["High"].values,
                "low": hist["Low"].values,
                "close": hist["Close"].values,
                "volume": hist["Volume"].values,
            }
        )

        # Get last date for generating future dates
        last_date = hist.index[-1]
        future_dates = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=forecast_horizon,
        )

        # Run prediction based on model type
        if model_type == "arima":
            # ARIMA hyperparameters
            p = min(max(hyperparams.get("p", 5), 1), 10)
            d = min(max(hyperparams.get("d", 1), 0), 2)
            q = min(max(hyperparams.get("q", 0), 0), 5)

            result = _arima_predict(
                df["close"].values,
                forecast_horizon,
                order=(p, d, q),
            )
        else:
            # Prepare features for tree-based models
            X, y = _prepare_features(df)
            last_features = X[-1]

            if model_type == "xgboost":
                result = _xgboost_predict(
                    X, y, forecast_horizon, last_features, hyperparams
                )
            elif model_type == "catboost":
                result = _catboost_predict(
                    X, y, forecast_horizon, last_features, hyperparams
                )
            elif model_type == "lightgbm":
                result = _lightgbm_predict(
                    X, y, forecast_horizon, last_features, hyperparams
                )

        # Check execution time
        execution_time = time.time() - start_time
        if execution_time > MAX_EXECUTION_TIME:
            return JsonResponse(
                {"error": "Model training exceeded time limit. Try with less data."},
                status=408,
            )

        # Format response
        response_data = {
            "symbol": symbol,
            "model": model_type,
            "forecast_horizon": forecast_horizon,
            "training_points": len(df),
            "execution_time_seconds": round(execution_time, 2),
            "predictions": [
                {
                    "date": date.strftime("%Y-%m-%d"),
                    "predicted_price": round(result["predictions"][i], 2),
                    "confidence_lower": round(result["confidence_lower"][i], 2),
                    "confidence_upper": round(result["confidence_upper"][i], 2),
                }
                for i, date in enumerate(future_dates)
            ],
            "model_info": result.get("model_info", {}),
            "last_actual_price": round(float(df["close"].iloc[-1]), 2),
            "last_actual_date": last_date.strftime("%Y-%m-%d"),
            "disclaimer": (
                "IMPORTANT: These predictions are for EDUCATIONAL and LEARNING "
                "purposes ONLY. They should NOT be used as financial advice or "
                "for making investment decisions. Past performance does not "
                "guarantee future results. Always consult a qualified financial "
                "advisor before making investment decisions."
            ),
        }

        return JsonResponse(response_data)

    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=400)
    except Exception as e:
        return JsonResponse(
            {"error": f"Prediction failed: {str(e)}"},
            status=500,
        )


@api_view(["GET"])
def get_available_models(request: Request) -> JsonResponse:  # noqa: ARG001
    """Get information about available ML models and their hyperparameters.

    Returns:
        JSON response with model information and configurable parameters.
    """
    models = {
        "arima": {
            "name": "ARIMA",
            "description": (
                "AutoRegressive Integrated Moving Average - A classical time series "
                "forecasting model that captures temporal dependencies in data."
            ),
            "hyperparameters": {
                "p": {
                    "name": "AR Order (p)",
                    "description": "Number of autoregressive terms",
                    "type": "integer",
                    "default": 5,
                    "min": 1,
                    "max": 10,
                },
                "d": {
                    "name": "Differencing (d)",
                    "description": "Degree of differencing for stationarity",
                    "type": "integer",
                    "default": 1,
                    "min": 0,
                    "max": 2,
                },
                "q": {
                    "name": "MA Order (q)",
                    "description": "Number of moving average terms",
                    "type": "integer",
                    "default": 0,
                    "min": 0,
                    "max": 5,
                },
            },
        },
        "xgboost": {
            "name": "XGBoost",
            "description": (
                "Extreme Gradient Boosting - A powerful ensemble method using "
                "gradient boosted decision trees for regression."
            ),
            "hyperparameters": {
                "n_estimators": {
                    "name": "Number of Trees",
                    "description": "Number of boosting rounds",
                    "type": "integer",
                    "default": 100,
                    "min": 10,
                    "max": 200,
                },
                "max_depth": {
                    "name": "Max Depth",
                    "description": "Maximum tree depth",
                    "type": "integer",
                    "default": 3,
                    "min": 1,
                    "max": 6,
                },
                "learning_rate": {
                    "name": "Learning Rate",
                    "description": "Step size shrinkage",
                    "type": "float",
                    "default": 0.1,
                    "min": 0.01,
                    "max": 0.3,
                    "step": 0.01,
                },
                "subsample": {
                    "name": "Subsample Ratio",
                    "description": "Fraction of samples for training",
                    "type": "float",
                    "default": 0.8,
                    "min": 0.5,
                    "max": 1.0,
                    "step": 0.1,
                },
            },
        },
        "catboost": {
            "name": "CatBoost",
            "description": (
                "Categorical Boosting - A gradient boosting library with built-in "
                "handling of categorical features and reduced overfitting."
            ),
            "hyperparameters": {
                "iterations": {
                    "name": "Iterations",
                    "description": "Number of boosting iterations",
                    "type": "integer",
                    "default": 100,
                    "min": 10,
                    "max": 200,
                },
                "depth": {
                    "name": "Tree Depth",
                    "description": "Depth of the trees",
                    "type": "integer",
                    "default": 4,
                    "min": 1,
                    "max": 6,
                },
                "learning_rate": {
                    "name": "Learning Rate",
                    "description": "Step size shrinkage",
                    "type": "float",
                    "default": 0.1,
                    "min": 0.01,
                    "max": 0.3,
                    "step": 0.01,
                },
                "l2_leaf_reg": {
                    "name": "L2 Regularization",
                    "description": "L2 regularization coefficient",
                    "type": "integer",
                    "default": 3,
                    "min": 1,
                    "max": 10,
                },
            },
        },
        "lightgbm": {
            "name": "LightGBM",
            "description": (
                "Light Gradient Boosting Machine - A fast, distributed gradient "
                "boosting framework with high efficiency and low memory usage."
            ),
            "hyperparameters": {
                "n_estimators": {
                    "name": "Number of Trees",
                    "description": "Number of boosting rounds",
                    "type": "integer",
                    "default": 100,
                    "min": 10,
                    "max": 200,
                },
                "max_depth": {
                    "name": "Max Depth",
                    "description": "Maximum tree depth",
                    "type": "integer",
                    "default": 3,
                    "min": 1,
                    "max": 6,
                },
                "learning_rate": {
                    "name": "Learning Rate",
                    "description": "Step size shrinkage",
                    "type": "float",
                    "default": 0.1,
                    "min": 0.01,
                    "max": 0.3,
                    "step": 0.01,
                },
                "num_leaves": {
                    "name": "Number of Leaves",
                    "description": "Maximum leaves per tree",
                    "type": "integer",
                    "default": 31,
                    "min": 10,
                    "max": 50,
                },
            },
        },
    }

    return JsonResponse(
        {
            "models": models,
            "constraints": {
                "max_forecast_horizon": MAX_FORECAST_HORIZON,
                "max_training_points": MAX_TRAINING_POINTS,
                "min_training_points": MIN_TRAINING_POINTS,
                "max_execution_time_seconds": MAX_EXECUTION_TIME,
            },
            "disclaimer": (
                "IMPORTANT: All predictions are for EDUCATIONAL and LEARNING "
                "purposes ONLY. They should NOT be used as financial advice."
            ),
        }
    )
