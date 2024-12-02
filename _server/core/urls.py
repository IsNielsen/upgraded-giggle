from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('recipes/', view=views.recipes, name="create recipe"),
    path('recipes/<int:recipe_id>/', views.delete_recipe, name='delete recipe'),
        path('tags/', views.get_tags, name='get_tags'),


]