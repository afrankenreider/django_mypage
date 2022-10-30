"""Home page."""
from django.shortcuts import render


def home_page(request):
    """Load home page."""
    return render(request, "home/home_page.html")
