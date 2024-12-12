# Generated by Django 5.0.3 on 2024-12-12 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='public',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='ingredients',
            field=models.JSONField(default=list),
        ),
    ]
