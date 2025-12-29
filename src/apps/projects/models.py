from django.db import models


class Projects(models.Model):
    """Projects model."""

    TECH = (
        ("Python", "Python"),
        ("API", "API"),
        ("Automation", "Automation"),
        ("Modeling", "Modeling"),
    )

    project_title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=30, choices=TECH)
    repository = models.CharField(max_length=200, blank=True, null=True)
    image = models.TextField(blank=True, null=True)

    class Meta:
        """Meta class."""

        verbose_name_plural = "Projects"
