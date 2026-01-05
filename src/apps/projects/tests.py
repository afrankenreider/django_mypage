from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Projects


class ProjectsModelTests(TestCase):
    """Tests for the Projects model."""

    def test_create_project(self) -> None:
        """Test creating a project."""
        project = Projects.objects.create(
            project_title="Test Project",
            description="A test project description.",
            technology="Python",
            repository="https://github.com/test/project",
            image="https://example.com/image.png",
        )
        self.assertEqual(project.project_title, "Test Project")
        self.assertEqual(project.description, "A test project description.")
        self.assertEqual(project.technology, "Python")
        self.assertEqual(project.repository, "https://github.com/test/project")

    def test_create_project_minimal(self) -> None:
        """Test creating a project with only required fields."""
        project = Projects.objects.create(
            project_title="Minimal Project",
            description="Minimal description.",
            technology="API",
        )
        self.assertEqual(project.project_title, "Minimal Project")
        self.assertIsNone(project.repository)
        self.assertIsNone(project.image)

    def test_project_technology_choices(self) -> None:
        """Test that technology field accepts valid choices."""
        valid_technologies = ["Python", "API", "Automation", "Modeling"]
        for tech in valid_technologies:
            project = Projects.objects.create(
                project_title=f"{tech} Project",
                description=f"A {tech} project.",
                technology=tech,
            )
            self.assertEqual(project.technology, tech)


class ProjectsAPITests(APITestCase):
    """Tests for the Projects API endpoints."""

    def setUp(self) -> None:
        """Set up test data."""
        self.project1 = Projects.objects.create(
            project_title="Python Automation Tool",
            description="A tool for automating repetitive tasks.",
            technology="Python",
            repository="https://github.com/test/automation",
            image="https://example.com/automation.png",
        )
        self.project2 = Projects.objects.create(
            project_title="REST API Service",
            description="A RESTful API service for data processing.",
            technology="API",
            repository="https://github.com/test/api-service",
        )
        self.project3 = Projects.objects.create(
            project_title="ML Modeling Project",
            description="Machine learning models for predictions.",
            technology="Modeling",
        )

    def test_list_projects(self) -> None:
        """Test listing all projects."""
        url = reverse("projects-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

    def test_retrieve_project(self) -> None:
        """Test retrieving a single project."""
        url = reverse("projects-detail", kwargs={"pk": self.project1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["project_title"], "Python Automation Tool")
        self.assertEqual(response.data["technology"], "Python")
        self.assertEqual(
            response.data["repository"], "https://github.com/test/automation"
        )

    def test_project_list_contains_all_fields(self) -> None:
        """Test that project list response contains all expected fields."""
        url = reverse("projects-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_fields = [
            "id",
            "project_title",
            "description",
            "technology",
            "repository",
            "image",
        ]
        for project in response.data:
            for field in expected_fields:
                self.assertIn(field, project)

    def test_project_with_null_optional_fields(self) -> None:
        """Test that projects with null optional fields are handled correctly."""
        url = reverse("projects-detail", kwargs={"pk": self.project3.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["repository"])
        self.assertIsNone(response.data["image"])

    def test_nonexistent_project_returns_404(self) -> None:
        """Test that requesting a nonexistent project returns 404."""
        url = reverse("projects-detail", kwargs={"pk": 99999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_readonly_viewset_disallows_post(self) -> None:
        """Test that POST requests are not allowed (ReadOnlyModelViewSet)."""
        url = reverse("projects-list")
        data = {
            "project_title": "New Project",
            "description": "Should not be created.",
            "technology": "Python",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_readonly_viewset_disallows_put(self) -> None:
        """Test that PUT requests are not allowed (ReadOnlyModelViewSet)."""
        url = reverse("projects-detail", kwargs={"pk": self.project1.pk})
        data = {
            "project_title": "Updated Project",
            "description": "Should not be updated.",
            "technology": "API",
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_readonly_viewset_disallows_delete(self) -> None:
        """Test that DELETE requests are not allowed (ReadOnlyModelViewSet)."""
        url = reverse("projects-detail", kwargs={"pk": self.project1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
