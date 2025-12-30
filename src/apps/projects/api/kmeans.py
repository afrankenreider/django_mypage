"""K-Means Clustering API endpoints for interactive demos."""

import numpy as np
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


def calculate_kmeans(
    points: list, k: int, max_iterations: int = 100, random_seed: int = None
) -> dict:
    """
    Calculate k-means clustering for provided data points.

    Args:
        points: List of [x, y] coordinates
        k: Number of clusters
        max_iterations: Maximum number of iterations
        random_seed: Random seed for reproducibility

    Returns:
        Dictionary with cluster assignments, centroids, and iteration history
    """
    if random_seed is not None:
        np.random.seed(random_seed)

    points_array = np.array(points)
    n_points = len(points_array)

    if n_points < k:
        return {
            "error": f"Number of points ({n_points}) must be >= number of clusters ({k})"
        }

    # Initialize centroids randomly from existing points
    initial_indices = np.random.choice(n_points, k, replace=False)
    centroids = points_array[initial_indices].copy()

    # Track history for visualization
    history = []

    for iteration in range(max_iterations):
        # Assign points to nearest centroid
        distances = np.zeros((n_points, k))
        for i in range(k):
            distances[:, i] = np.linalg.norm(points_array - centroids[i], axis=1)

        assignments = np.argmin(distances, axis=1)

        # Store current state
        history.append(
            {
                "iteration": iteration,
                "centroids": centroids.tolist(),
                "assignments": assignments.tolist(),
            }
        )

        # Calculate new centroids
        new_centroids = np.zeros((k, 2))
        for i in range(k):
            cluster_points = points_array[assignments == i]
            if len(cluster_points) > 0:
                new_centroids[i] = cluster_points.mean(axis=0)
            else:
                # If cluster is empty, reinitialize randomly
                new_centroids[i] = points_array[np.random.randint(n_points)]

        # Check for convergence
        if np.allclose(centroids, new_centroids):
            centroids = new_centroids
            # Add final state
            distances = np.zeros((n_points, k))
            for i in range(k):
                distances[:, i] = np.linalg.norm(points_array - centroids[i], axis=1)
            assignments = np.argmin(distances, axis=1)

            history.append(
                {
                    "iteration": iteration + 1,
                    "centroids": centroids.tolist(),
                    "assignments": assignments.tolist(),
                }
            )
            break

        centroids = new_centroids

    # Calculate final metrics
    final_assignments = history[-1]["assignments"]
    final_centroids = np.array(history[-1]["centroids"])

    # Calculate inertia (within-cluster sum of squares)
    inertia = 0
    for i in range(k):
        cluster_points = points_array[np.array(final_assignments) == i]
        if len(cluster_points) > 0:
            inertia += np.sum((cluster_points - final_centroids[i]) ** 2)

    # Calculate silhouette score (simplified)
    silhouette_scores = []
    for i in range(n_points):
        point = points_array[i]
        cluster = final_assignments[i]

        # Calculate average distance to points in same cluster
        same_cluster_points = points_array[np.array(final_assignments) == cluster]
        if len(same_cluster_points) > 1:
            a = np.mean(np.linalg.norm(same_cluster_points - point, axis=1))
        else:
            a = 0

        # Calculate average distance to points in nearest other cluster
        b = float("inf")
        for j in range(k):
            if j != cluster:
                other_cluster_points = points_array[np.array(final_assignments) == j]
                if len(other_cluster_points) > 0:
                    dist = np.mean(np.linalg.norm(other_cluster_points - point, axis=1))
                    b = min(b, dist)

        if b == float("inf"):
            b = 0

        if max(a, b) > 0:
            silhouette_scores.append((b - a) / max(a, b))
        else:
            silhouette_scores.append(0)

    avg_silhouette = np.mean(silhouette_scores) if silhouette_scores else 0

    return {
        "converged": len(history) < max_iterations,
        "iterations": len(history) - 1,
        "final_centroids": final_centroids.tolist(),
        "final_assignments": final_assignments,
        "inertia": round(float(inertia), 4),
        "silhouette_score": round(float(avg_silhouette), 4),
        "history": history,
    }


@api_view(["POST"])
def kmeans_calculate(request):
    """
    Calculate k-means clustering for provided data points.

    Expected POST body:
    {
        "points": [[1, 2], [3, 4], [5, 6], ...],
        "k": 3,
        "max_iterations": 100,
        "random_seed": 42
    }
    """
    try:
        points = request.data.get("points", [])
        k = request.data.get("k", 3)
        max_iterations = request.data.get("max_iterations", 100)
        random_seed = request.data.get("random_seed")

        if not points:
            return Response(
                {"error": "Points array is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(k, int) or k < 1:
            return Response(
                {"error": "k must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(points) < k:
            return Response(
                {"error": f"Number of points ({len(points)}) must be >= k ({k})"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate point format
        for point in points:
            if not isinstance(point, list | tuple) or len(point) != 2:
                return Response(
                    {"error": "Each point must be a 2D coordinate [x, y]"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        result = calculate_kmeans(points, k, max_iterations, random_seed)

        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        return Response(result)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def kmeans_sample_data():
    """
    Return sample datasets for k-means clustering demos.
    """
    datasets = {
        "customer_segments": {
            "name": "Customer Segments",
            "description": "Annual income vs. spending score from retail analytics",
            "x_label": "Annual Income ($K)",
            "y_label": "Spending Score",
            "k": 3,
            "points": [
                # High income, high spending (Premium customers)
                [85, 90],
                [88, 85],
                [92, 88],
                [78, 82],
                [95, 92],
                [82, 78],
                [90, 95],
                [75, 80],
                [98, 88],
                [80, 85],
                [87, 91],
                [93, 87],
                # Low income, high spending (Careful spenders)
                [15, 85],
                [18, 90],
                [12, 78],
                [22, 82],
                [20, 88],
                [25, 75],
                [17, 80],
                [28, 85],
                [14, 92],
                [23, 78],
                # Medium income, low spending (Budget conscious)
                [45, 20],
                [52, 25],
                [48, 18],
                [55, 22],
                [42, 28],
                [58, 15],
                [50, 30],
                [47, 24],
                [53, 19],
                [44, 26],
                [56, 21],
                [49, 17],
            ],
        },
        "retail_products": {
            "name": "Retail Products",
            "description": "Price point vs. sales volume for product categorization",
            "x_label": "Price Point ($)",
            "y_label": "Sales Volume (units)",
            "k": 4,
            "points": [
                # Premium products (high price, low volume)
                [85, 15],
                [90, 12],
                [88, 18],
                [92, 10],
                [80, 20],
                [95, 8],
                # Mass market (low price, high volume)
                [15, 85],
                [18, 90],
                [12, 88],
                [20, 82],
                [22, 78],
                [10, 92],
                # Mid-tier products
                [45, 50],
                [50, 55],
                [48, 45],
                [52, 52],
                [55, 48],
                [42, 58],
                # Niche products (mid price, low volume)
                [55, 18],
                [60, 15],
                [58, 22],
                [62, 12],
                [50, 25],
                [65, 10],
            ],
        },
        "geographic_locations": {
            "name": "Store Locations",
            "description": "Geographic coordinates for retail store clustering",
            "x_label": "Longitude (normalized)",
            "y_label": "Latitude (normalized)",
            "k": 3,
            "points": [
                # Downtown district
                [25, 75],
                [28, 72],
                [22, 78],
                [30, 70],
                [27, 76],
                [24, 73],
                [26, 79],
                [29, 74],
                [23, 71],
                [31, 77],
                # Suburban area
                [70, 65],
                [73, 68],
                [68, 62],
                [75, 70],
                [72, 64],
                [67, 67],
                [76, 66],
                [71, 69],
                [74, 63],
                [69, 71],
                # Industrial zone
                [55, 25],
                [58, 28],
                [52, 22],
                [60, 30],
                [57, 24],
                [54, 27],
                [61, 26],
                [56, 29],
                [53, 23],
                [59, 31],
            ],
        },
    }

    return Response(datasets)
