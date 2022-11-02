from django.urls import path
from .page_views import home, projects, about_me, skills

urlpatterns = [
    path("", home.home_page, name="home_page"),
    path("projects/", projects.projects_page, name="projects_page"),
    path("my_story/", about_me.about_me_page, name="about_me"),
    path("skills/", skills.skills_page, name="skills"),
]
