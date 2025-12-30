from rest_framework import serializers

from .models import MediaItem


class MediaItemSerializer(serializers.ModelSerializer):
    """Serializer for the MediaItem model."""

    class Meta:
        model = MediaItem
        fields = [
            "id",
            "title",
            "source",
            "media_type",
            "url",
            "description",
            "date_added",
            "tags",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "date_added", "created_at", "updated_at"]


class MediaItemListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing media items."""

    class Meta:
        model = MediaItem
        fields = [
            "id",
            "title",
            "source",
            "media_type",
            "url",
            "description",
            "date_added",
            "tags",
        ]
