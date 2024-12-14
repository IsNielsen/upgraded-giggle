from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('recipes/', view=views.recipes, name="create recipe"),  # Making new recipes
    path('recipes/<int:recipe_id>/', views.delete_recipe, name='delete recipe'),  # Deleting recipes
    path('tags/', views.get_tags, name='get_tags'),  # Formatting and displaying the tags
    path('add_event/', views.add_event, name='add_event'),  # Adding meals to the calendar
    path('events/', views.get_events, name='get_events'),  # Showing meals on the calendar
    path('events/<int:event_id>/', views.delete_event, name='delete_event'),  # Deleting meals from the calendar
    path('shopping_list/', views.shopping_list, name='shopping_list'),  # Making the shopping list
    path('add_to_shopping_list/', views.add_to_shopping_list, name='add_to_shopping_list'),  # Adding to the shopping list
]