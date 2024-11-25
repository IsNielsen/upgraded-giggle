from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.me, name="current user"),
    path('notes/', view=views.notes, name="create note"),
    path('notes/<int:note_id>/', views.delete_note, name='delete_note'),

]