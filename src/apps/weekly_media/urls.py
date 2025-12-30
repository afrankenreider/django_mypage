"""Weekly Media app URL configuration."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MediaItemViewSet

app_name = "weekly_media"

router = DefaultRouter()
router.register(r"", MediaItemViewSet, basename="media-items")

urlpatterns = [
    path("", include(router.urls)),
]
