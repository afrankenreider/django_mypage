from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import MediaItem


class MediaItemModelTests(TestCase):
    """Tests for the MediaItem model."""

    def test_create_media_item(self) -> None:
        """Test creating a media item."""
        item = MediaItem.objects.create(
            title="Test Podcast",
            source="Test Source",
            media_type="podcast",
            url="https://example.com/podcast",
            description="A test podcast episode.",
            tags=["test", "podcast"],
        )
        self.assertEqual(str(item), "Test Podcast (Podcast)")
        self.assertTrue(item.is_published)

    def test_media_item_ordering(self) -> None:
        """Test that media items are ordered by date_added descending."""
        item1 = MediaItem.objects.create(
            title="First Item",
            source="Source",
            media_type="article",
            url="https://example.com/1",
            description="First item.",
        )
        item2 = MediaItem.objects.create(
            title="Second Item",
            source="Source",
            media_type="article",
            url="https://example.com/2",
            description="Second item.",
        )
        items = list(MediaItem.objects.all())
        self.assertEqual(items[0], item2)
        self.assertEqual(items[1], item1)


class MediaItemAPITests(APITestCase):
    """Tests for the MediaItem API endpoints."""

    def setUp(self) -> None:
        """Set up test data."""
        self.item1 = MediaItem.objects.create(
            title="Test Article",
            source="Tech Blog",
            media_type="article",
            url="https://example.com/article",
            description="An interesting article about technology.",
            tags=["tech", "programming"],
        )
        self.item2 = MediaItem.objects.create(
            title="Test Podcast",
            source="Podcast Network",
            media_type="podcast",
            url="https://example.com/podcast",
            description="A great podcast episode.",
            tags=["tech", "interviews"],
        )
        self.unpublished_item = MediaItem.objects.create(
            title="Unpublished Item",
            source="Source",
            media_type="video",
            url="https://example.com/video",
            description="This should not appear.",
            is_published=False,
        )

    def test_list_media_items(self) -> None:
        """Test listing all published media items."""
        url = reverse("weekly_media:media-items-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_by_media_type(self) -> None:
        """Test filtering media items by type."""
        url = reverse("weekly_media:media-items-list")
        response = self.client.get(url, {"media_type": "podcast"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Podcast")

    def test_search_media_items(self) -> None:
        """Test searching media items."""
        url = reverse("weekly_media:media-items-list")
        response = self.client.get(url, {"search": "article"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_media_types(self) -> None:
        """Test retrieving available media types."""
        url = reverse("weekly_media:media-items-media-types")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)

    def test_get_tags(self) -> None:
        """Test retrieving all unique tags."""
        url = reverse("weekly_media:media-items-tags")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tech", response.data)
        self.assertIn("programming", response.data)
        self.assertIn("interviews", response.data)

    def test_unpublished_items_hidden(self) -> None:
        """Test that unpublished items are not returned in the list."""
        url = reverse("weekly_media:media-items-list")
        response = self.client.get(url)
        titles = [item["title"] for item in response.data]
        self.assertNotIn("Unpublished Item", titles)
