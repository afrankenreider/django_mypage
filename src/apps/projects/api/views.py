from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from src.apps.projects.models import Projects
from src.apps.projects.serializers import ProjectsSerializer


class ProjectsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing projects."""

    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    permission_classes = [AllowAny]
