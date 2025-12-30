from django.db import models


class MediaItem(models.Model):
    """Model representing a media item (podcast, article, whitepaper, etc.)."""

    MEDIA_TYPES = (
        ("podcast", "Podcast"),
        ("article", "Article"),
        ("whitepaper", "Whitepaper"),
        ("video", "Video"),
        ("book", "Book"),
    )

    title = models.CharField(max_length=255)
    source = models.CharField(max_length=255)
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES)
    url = models.URLField(max_length=500)
    description = models.TextField()
    date_added = models.DateField(auto_now_add=True)
    tags = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Meta options for MediaItem."""

        verbose_name = "Media Item"
        verbose_name_plural = "Media Items"
        ordering = ["-date_added", "-created_at"]

    def __str__(self) -> str:
        """Return string representation of the media item."""
        return f"{self.title} ({self.get_media_type_display()})"
