from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Recipe(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.TextField()
    ingredients = models.TextField()
    instructions = models.TextField()
    tags = models.JSONField(default=list)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name