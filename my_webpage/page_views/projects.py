"""Home page."""
from django.shortcuts import render

from my_webpage.models import Projects


def projects_page(request):
    projects = Projects.objects.all()
    context = {"projects": projects}
    return render(request, "home/projects.html", context)
