from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.TextField()
    ingredients = models.JSONField(default=list)
    instructions = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    public = models.BooleanField(default=False)

class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    date = models.DateField()

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name