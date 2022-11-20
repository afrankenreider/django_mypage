"""Django tables module."""
import django_tables2 as tables


class ProjectList(tables.Table):
    """Quote table class."""

    project_title = tables.Column(verbose_name="Title")
    description = tables.Column(verbose_name="Description")
    technology = tables.Column(verbose_name="Tech")
    repository = tables.Column(verbose_name="Repository")

    class Meta:
        """Meta class."""

        attrs = {"class": "styled-table"}
