from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.request import Request
from rest_framework.response import Response

from .filters import MediaItemFilter
from .models import MediaItem
from .serializers import MediaItemListSerializer, MediaItemSerializer


class MediaItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing media items.

    Provides list, create, retrieve, update, and delete actions.
    """

    queryset = MediaItem.objects.filter(is_published=True)
    serializer_class = MediaItemSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MediaItemFilter
    search_fields = ["title", "source", "description"]
    ordering_fields = ["date_added", "title", "created_at"]
    ordering = ["-date_added"]

    def get_serializer_class(self) -> type:
        """Return appropriate serializer class based on action."""
        if self.action == "list":
            return MediaItemListSerializer
        return MediaItemSerializer

    @action(detail=False, methods=["get"])
    def media_types(self, _request: Request) -> Response:
        """
        Return a list of available media types.

        Args:
            _request: The HTTP request (unused).

        Returns:
            Response containing list of media types.
        """
        media_types = [
            {"value": value, "label": label} for value, label in MediaItem.MEDIA_TYPES
        ]
        return Response(media_types)

    @action(detail=False, methods=["get"])
    def tags(self, _request: Request) -> Response:
        """
        Return a list of all unique tags used across media items.

        Args:
            _request: The HTTP request (unused).

        Returns:
            Response containing list of unique tags.
        """
        # Get all tags from published media items
        all_tags: set[str] = set()
        for item in MediaItem.objects.filter(is_published=True).values_list(
            "tags", flat=True
        ):
            if item:
                all_tags.update(item)
        return Response(sorted(all_tags))
