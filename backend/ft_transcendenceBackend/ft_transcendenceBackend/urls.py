"""
URL configuration for ft_transcendenceBackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from spa import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('callback/', views.callback, name='callback'),
    path('logout/', views.custom_logout, name='logout'),
    path('get_user_details/', views.get_user_details, name='get_user_details'),
    path('send_friend_request/', views.send_friend_request, name='send_friend_request'),
    path('accept_friend_request/', views.accept_friend_request, name='accept_friend_request'),
    path('decline_friend_request/', views.decline_friend_request, name='decline_friend_request'),
    path('get_incoming_requests/', views.get_incoming_requests, name='get_incoming_resquests'),
    path('get_outgoing_requests/', views.get_outgoing_requests, name='get_outgoing_requests'),
    path('get_friends/', views.get_friends, name='get_friends'),
    path('get_block_list/', views.get_block_list, name='get_block_list'),
    path('block_user/', views.block_user, name='block_user'),
    # path('testGame/', views.testGame, name='testGame'),
]

