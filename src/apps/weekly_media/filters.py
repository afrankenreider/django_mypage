import django_filters

from .models import MediaItem


class MediaItemFilter(django_filters.FilterSet):
    """Filter set for MediaItem model."""

    title = django_filters.CharFilter(lookup_expr="icontains")
    source = django_filters.CharFilter(lookup_expr="icontains")
    media_type = django_filters.ChoiceFilter(choices=MediaItem.MEDIA_TYPES)
    search = django_filters.CharFilter(method="filter_search")
    date_from = django_filters.DateFilter(field_name="date_added", lookup_expr="gte")
    date_to = django_filters.DateFilter(field_name="date_added", lookup_expr="lte")

    class Meta:
        model = MediaItem
        fields = ["title", "source", "media_type", "is_published"]

    def filter_search(
        self, queryset: "django_filters.QuerySet", _name: str, value: str
    ) -> "django_filters.QuerySet":
        """
        Filter by searching across title, source, description, and tags.

        Args:
            queryset: The queryset to filter.
            name: The name of the filter field.
            value: The search value.

        Returns:
            Filtered queryset.
        """
        from django.db.models import Q

        return queryset.filter(
            Q(title__icontains=value)
            | Q(source__icontains=value)
            | Q(description__icontains=value)
            | Q(tags__icontains=value)
        )
