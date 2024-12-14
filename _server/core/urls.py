from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('recipes/', view=views.recipes, name="create recipe"),
    path('recipes/<int:recipe_id>/', views.delete_recipe, name='delete recipe'),
    path('tags/', views.get_tags, name='get_tags'),
    path('add_event/', views.add_event, name='add_event'),  # New path for adding events
    path('events/', views.get_events, name='get_events'),  # New path for fetching events
    path('events/<int:event_id>/', views.delete_event, name='delete_event'),  # New path for deleting events
    path('shopping_list/', views.shopping_list, name='shopping_list'),  # New path for making the shopping list
]