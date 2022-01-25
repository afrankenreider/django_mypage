from django.urls import include, re_path
from .views import ProjectListAndFormView

urlpatterns = [
    re_path(r'^$', ProjectListAndFormView.as_view(), name='main')
]