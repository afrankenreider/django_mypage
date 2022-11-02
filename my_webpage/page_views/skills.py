"""Home page."""
from django.shortcuts import render


def skills_page(request):
    """Load skills page."""
    return render(request, "home/skills.html")
