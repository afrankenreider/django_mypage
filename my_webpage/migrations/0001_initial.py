# Generated by Django 4.1.1 on 2022-11-08 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Projects',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('technology', models.CharField(choices=[('Python', 'Python'), ('API', 'API'), ('Automation', 'Automation'), ('Modeling', 'Modeling')], max_length=30)),
            ],
            options={
                'verbose_name_plural': 'Projects',
            },
        ),
    ]
