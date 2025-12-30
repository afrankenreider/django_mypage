"""Linear Regression API endpoints for interactive demos."""

import numpy as np
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def calculate_linear_regression(x: list, y: list) -> dict:
    """Calculate linear regression coefficients and statistics."""
    x = np.array(x)
    y = np.array(y)
    n = len(x)

    # Calculate means
    x_mean = np.mean(x)
    y_mean = np.mean(y)

    # Calculate slope (m) and intercept (b)
    numerator = np.sum((x - x_mean) * (y - y_mean))
    denominator = np.sum((x - x_mean) ** 2)

    if denominator == 0:
        return {"error": "Cannot calculate regression - no variance in x"}

    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    # Predictions
    y_pred = slope * x + intercept

    # Calculate R-squared
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - y_mean) ** 2)
    r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0

    # Calculate residuals
    residuals = (y - y_pred).tolist()

    # Calculate standard error
    std_error = np.sqrt(ss_res / (n - 2)) if n > 2 else 0

    return {
        "slope": round(float(slope), 4),
        "intercept": round(float(intercept), 4),
        "r_squared": round(float(r_squared), 4),
        "std_error": round(float(std_error), 4),
        "predictions": [round(float(p), 4) for p in y_pred],
        "residuals": [round(float(r), 4) for r in residuals],
        "equation": f"y = {round(float(slope), 2)}x + {round(float(intercept), 2)}",
    }


@api_view(["POST"])
def linear_regression_calculate(request):
    """
    Calculate linear regression for provided data points.

    Expected POST body:
    {
        "x": [1, 2, 3, 4, 5],
        "y": [2.1, 4.0, 5.9, 8.1, 10.0]
    }
    """
    try:
        x = request.data.get("x", [])
        y = request.data.get("y", [])

        if not x or not y:
            return Response(
                {"error": "Both x and y arrays are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(x) != len(y):
            return Response(
                {"error": "x and y arrays must have the same length"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(x) < 2:
            return Response(
                {"error": "At least 2 data points are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = calculate_linear_regression(x, y)

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        return Response(result)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def linear_regression_sample_data():
    """
    Return sample datasets for linear regression demos.
    """
    datasets = {
        "housing": {
            "name": "Housing Prices",
            "description": "Square footage vs. house price",
            "x_label": "Square Footage",
            "y_label": "Price ($1000s)",
            "x": [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000],
            "y": [150, 180, 195, 240, 260, 295, 320, 355, 380, 410, 450],
        },
        "study_hours": {
            "name": "Study Hours vs. Exam Score",
            "description": "Hours studied vs. exam performance",
            "x_label": "Hours Studied",
            "y_label": "Exam Score",
            "x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "y": [45, 52, 58, 65, 70, 75, 82, 88, 92, 96],
        },
        "advertising": {
            "name": "Advertising Spend",
            "description": "Ad spend vs. sales revenue",
            "x_label": "Ad Spend ($1000s)",
            "y_label": "Sales ($1000s)",
            "x": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            "y": [25, 45, 55, 70, 85, 95, 115, 125, 140, 155],
        },
        "temperature": {
            "name": "Temperature & Ice Cream",
            "description": "Temperature vs. ice cream sales",
            "x_label": "Temperature (°F)",
            "y_label": "Sales (units)",
            "x": [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
            "y": [120, 150, 200, 280, 350, 420, 500, 580, 620, 680],
        },
    }

    return Response(datasets)
