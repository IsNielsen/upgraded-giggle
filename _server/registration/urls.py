from django.urls import path
from . import views

# This is the file you want to edit

urlpatterns = [
    path('sign_in/', views.sign_in),
    path('sign_up/', views.sign_up),
    path('logout/', views.logout_view),
]