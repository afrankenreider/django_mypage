# Generated by Django 4.1.1 on 2022-11-08 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('my_webpage', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='repository',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
