from django.urls import path
from .page_views import home, projects

urlpatterns = [
    path("", home.home_page, name="home_page"),
    path("projects/", projects.projects_page, name="projects_page"),
]
