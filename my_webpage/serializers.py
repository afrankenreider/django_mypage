from rest_framework import serializers
from .models import Projects


class ProjectsSerializer(serializers.ModelSerializer):
    """Serializer for the Projects model."""

    class Meta:
        model = Projects
        fields = [
            "id",
            "project_title",
            "description",
            "technology",
            "repository",
            "image",
        ]
