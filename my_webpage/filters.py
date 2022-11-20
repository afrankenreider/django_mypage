"""Filters for django tables."""
import django_filters

from .models import Projects


class ProjectsListFilter(django_filters.FilterSet):
    """Carrier Contact filter."""

    class Meta:
        """Meta class."""

        model = Projects
        fields = {
            "project_title": ["contains"],
            "repository": ["contains"],
        }
