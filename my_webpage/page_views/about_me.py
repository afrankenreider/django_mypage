"""Home page."""
from django.shortcuts import render


def about_me_page(request):
    """Load projects page."""
    return render(request, "home/about_me.html")
