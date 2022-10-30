from django.urls import path
from .page_views import home

urlpatterns = [
    path("", home.home_page, name="home_page"),
]
