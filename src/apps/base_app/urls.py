"""Portfolio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import os

from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from src.apps.projects.api.kmeans import (
    kmeans_calculate,
    kmeans_sample_data,
)
from src.apps.projects.api.linear_regression import (
    linear_regression_calculate,
    linear_regression_sample_data,
)
from src.apps.projects.api.stock_data import (
    get_multiple_quotes,
    get_stock_history,
    get_stock_quote,
    search_symbols,
)
from src.apps.projects.api.views import ProjectsViewSet

# API Router
router = DefaultRouter()
router.register(r"projects", ProjectsViewSet, basename="projects")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/linear-regression/calculate/",
        linear_regression_calculate,
        name="linear-regression-calculate",
    ),
    path(
        "api/linear-regression/sample-data/",
        linear_regression_sample_data,
        name="linear-regression-sample-data",
    ),
    path(
        "api/kmeans/calculate/",
        kmeans_calculate,
        name="kmeans-calculate",
    ),
    path(
        "api/kmeans/sample-data/",
        kmeans_sample_data,
        name="kmeans-sample-data",
    ),
    path(
        "api/stocks/quote/",
        get_stock_quote,
        name="stock-quote",
    ),
    path(
        "api/stocks/history/",
        get_stock_history,
        name="stock-history",
    ),
    path(
        "api/stocks/quotes/",
        get_multiple_quotes,
        name="stock-quotes",
    ),
    path(
        "api/stocks/search/",
        search_symbols,
        name="stock-search",
    ),
    path(
        "api/weekly-media/",
        include(
            ("src.apps.weekly_media.urls", "weekly_media"), namespace="weekly_media"
        ),
    ),
]

# In production, serve the React frontend for all other routes
if os.environ.get("DYNO"):
    urlpatterns += [
        re_path(
            r"^(?!api|admin|static).*$",
            TemplateView.as_view(template_name="index.html"),
        ),
    ]
else:
    # In development, include Django template views (React runs separately on port 3000)
    urlpatterns += [
        path("", include(("src.apps.projects.urls", "projects"), namespace="projects")),
    ]
