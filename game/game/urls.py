from django.urls import path
from . import views

urlpatterns = [
    path('', views.interface, name ="interface"),
    path('duelRegistration/', views.duelRegistration, name ="duelRegistration"),
    path('duelRegistration/recevoir_donnees/', views.recevoir_donnees, name ="recevoir_donnees"),

    path('tournementRegistration', views.tournementRegistration, name ="tournementRegistration"),


    path('duelRegistration/game/', views.game, name ="game")
    
]