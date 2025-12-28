from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from my_webpage.models import Projects
from my_webpage.serializers import ProjectsSerializer


class ProjectsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing projects."""

    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer
    permission_classes = [AllowAny]
