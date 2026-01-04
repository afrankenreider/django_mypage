"""Stock data API endpoints using Yahoo Finance."""

from typing import Any

import yfinance as yf
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.request import Request


@api_view(["GET"])
def get_stock_quote(request: Request) -> JsonResponse:
    """Get current stock quote for a ticker symbol.

    Query Parameters:
        symbol: Stock ticker symbol (e.g., 'AAPL', 'GOOGL')

    Returns:
        JSON response with stock quote data including price, change, volume, etc.
    """
    symbol = request.query_params.get("symbol", "").upper().strip()

    if not symbol:
        return JsonResponse(
            {"error": "Symbol parameter is required"},
            status=400,
        )

    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # Check if we got valid data
        if not info or info.get("regularMarketPrice") is None:
            return JsonResponse(
                {"error": f"No data found for symbol: {symbol}"},
                status=404,
            )

        quote_data = {
            "symbol": symbol,
            "name": info.get("shortName", info.get("longName", symbol)),
            "price": info.get("regularMarketPrice", 0),
            "previousClose": info.get("previousClose", 0),
            "open": info.get("regularMarketOpen", 0),
            "dayHigh": info.get("regularMarketDayHigh", 0),
            "dayLow": info.get("regularMarketDayLow", 0),
            "volume": info.get("regularMarketVolume", 0),
            "avgVolume": info.get("averageVolume", 0),
            "marketCap": info.get("marketCap", 0),
            "peRatio": info.get("trailingPE", None),
            "eps": info.get("trailingEps", None),
            "dividend": info.get("dividendRate", None),
            "dividendYield": info.get("dividendYield", None),
            "52WeekHigh": info.get("fiftyTwoWeekHigh", 0),
            "52WeekLow": info.get("fiftyTwoWeekLow", 0),
            "50DayAvg": info.get("fiftyDayAverage", 0),
            "200DayAvg": info.get("twoHundredDayAverage", 0),
            "change": info.get("regularMarketPrice", 0) - info.get("previousClose", 0),
            "changePercent": (
                (
                    (info.get("regularMarketPrice", 0) - info.get("previousClose", 0))
                    / info.get("previousClose", 1)
                )
                * 100
                if info.get("previousClose", 0) != 0
                else 0
            ),
            "currency": info.get("currency", "USD"),
            "exchange": info.get("exchange", ""),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
        }

        return JsonResponse(quote_data)

    except Exception as e:
        return JsonResponse(
            {"error": f"Failed to fetch data for {symbol}: {str(e)}"},
            status=500,
        )


@api_view(["GET"])
def get_stock_history(request: Request) -> JsonResponse:
    """Get historical stock data for charting.

    Query Parameters:
        symbol: Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
        period: Time period ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'max')
        interval: Data interval ('1m', '5m', '15m', '1h', '1d', '1wk', '1mo')

    Returns:
        JSON response with historical OHLCV data.
    """
    symbol = request.query_params.get("symbol", "").upper().strip()
    period = request.query_params.get("period", "1mo")
    interval = request.query_params.get("interval", "1d")

    if not symbol:
        return JsonResponse(
            {"error": "Symbol parameter is required"},
            status=400,
        )

    # Validate period
    valid_periods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "max"]
    if period not in valid_periods:
        return JsonResponse(
            {"error": f"Invalid period. Must be one of: {', '.join(valid_periods)}"},
            status=400,
        )

    # Validate interval
    valid_intervals = ["1m", "5m", "15m", "30m", "1h", "1d", "1wk", "1mo"]
    if interval not in valid_intervals:
        return JsonResponse(
            {
                "error": f"Invalid interval. Must be one of: {', '.join(valid_intervals)}"
            },
            status=400,
        )

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)

        if hist.empty:
            return JsonResponse(
                {"error": f"No historical data found for symbol: {symbol}"},
                status=404,
            )

        # Convert to list of dicts for JSON serialization
        history_data: list[dict[str, Any]] = []
        for index, row in hist.iterrows():
            timestamp = index.isoformat() if hasattr(index, "isoformat") else str(index)
            history_data.append(
                {
                    "timestamp": timestamp,
                    "open": round(row["Open"], 2),
                    "high": round(row["High"], 2),
                    "low": round(row["Low"], 2),
                    "close": round(row["Close"], 2),
                    "volume": int(row["Volume"]),
                }
            )

        return JsonResponse(
            {
                "symbol": symbol,
                "period": period,
                "interval": interval,
                "data": history_data,
            }
        )

    except Exception as e:
        return JsonResponse(
            {"error": f"Failed to fetch history for {symbol}: {str(e)}"},
            status=500,
        )


@api_view(["POST"])
def get_multiple_quotes(request: Request) -> JsonResponse:
    """Get quotes for multiple stock symbols at once.

    Request Body:
        symbols: List of stock ticker symbols

    Returns:
        JSON response with quote data for each symbol.
    """
    symbols = request.data.get("symbols", [])

    if not symbols or not isinstance(symbols, list):
        return JsonResponse(
            {"error": "symbols array is required in request body"},
            status=400,
        )

    # Limit to 20 symbols to prevent abuse
    symbols = [s.upper().strip() for s in symbols[:20] if isinstance(s, str)]

    if not symbols:
        return JsonResponse(
            {"error": "At least one valid symbol is required"},
            status=400,
        )

    results: dict[str, Any] = {}

    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            if not info or info.get("regularMarketPrice") is None:
                results[symbol] = {"error": "No data found"}
                continue

            previous_close = info.get("previousClose", 0)
            current_price = info.get("regularMarketPrice", 0)
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close else 0

            results[symbol] = {
                "symbol": symbol,
                "name": info.get("shortName", info.get("longName", symbol)),
                "price": current_price,
                "change": round(change, 2),
                "changePercent": round(change_percent, 2),
                "volume": info.get("regularMarketVolume", 0),
                "marketCap": info.get("marketCap", 0),
                "dayHigh": info.get("regularMarketDayHigh", 0),
                "dayLow": info.get("regularMarketDayLow", 0),
            }

        except Exception as e:
            results[symbol] = {"error": str(e)}

    return JsonResponse({"quotes": results})


@api_view(["GET"])
def search_symbols(request: Request) -> JsonResponse:
    """Search for stock symbols by company name or ticker.

    Query Parameters:
        query: Search query string

    Returns:
        JSON response with matching symbols.
    """
    query = request.query_params.get("query", "").strip()

    if not query or len(query) < 1:
        return JsonResponse(
            {"error": "Query parameter is required (minimum 1 character)"},
            status=400,
        )

    try:
        # Try to get info for the exact match first
        results: list[dict[str, str]] = []

        # Check if it's a valid symbol
        try:
            ticker = yf.Ticker(query.upper())
            info = ticker.info
            if info and info.get("regularMarketPrice") is not None:
                results.append(
                    {
                        "symbol": query.upper(),
                        "name": info.get("shortName", info.get("longName", query)),
                        "exchange": info.get("exchange", ""),
                        "type": info.get("quoteType", ""),
                    }
                )
        except Exception:
            pass

        return JsonResponse({"results": results})

    except Exception as e:
        return JsonResponse(
            {"error": f"Search failed: {str(e)}"},
            status=500,
        )
