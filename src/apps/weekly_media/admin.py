from django.contrib import admin

from .models import MediaItem


@admin.register(MediaItem)
class MediaItemAdmin(admin.ModelAdmin):
    """Admin configuration for MediaItem model."""

    list_display = [
        "title",
        "media_type",
        "source",
        "date_added",
        "is_published",
    ]
    list_filter = ["media_type", "is_published", "date_added"]
    search_fields = ["title", "source", "description"]
    ordering = ["-date_added"]
    date_hierarchy = "date_added"

    fieldsets = (
        (
            None,
            {
                "fields": ("title", "source", "media_type", "url"),
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "tags"),
            },
        ),
        (
            "Publishing",
            {
                "fields": ("is_published",),
            },
        ),
    )
