# Generated by Django 5.0.3 on 2024-12-12 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_recipe_public_alter_recipe_ingredients'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='instructions',
            field=models.JSONField(default=list),
        ),
    ]