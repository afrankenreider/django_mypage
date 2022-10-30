"""Home page."""
from django.shortcuts import render


def projects_page(request):
    """Load projects page."""
    return render(request, "home/projects.html")
