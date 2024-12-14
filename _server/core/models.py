from django.db import models
from django.contrib.auth.models import User

# Recipe
class Recipe(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.TextField()
    ingredients = models.JSONField(default=list)
    instructions = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    public = models.BooleanField(default=False)

# Meal in the meal plan
class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    date = models.DateField()

# Dietary Restriction Tag
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
# Shopping List
class List(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    items = models.JSONField(default=list)  # list of items to buy