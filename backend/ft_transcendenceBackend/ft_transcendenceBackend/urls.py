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
from spa import friend_requests
from spa.usersManagement import update_username
from spa.usersManagement import pfp_utils

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('callback/', views.callback, name='callback'),
    path('logout/', views.custom_logout, name='logout'),
    path('get_user_details/', friend_requests.get_user_details, name='get_user_details'),
    path('send_friend_request/', friend_requests.send_friend_request, name='send_friend_request'),
    path('accept_friend_request/', friend_requests.accept_friend_request, name='accept_friend_request'),
    path('decline_friend_request/', friend_requests.decline_friend_request, name='decline_friend_request'),
    path('get_incoming_requests/', friend_requests.get_incoming_requests, name='get_incoming_resquests'),
    path('get_outgoing_requests/', friend_requests.get_outgoing_requests, name='get_outgoing_requests'),
    path('get_friends/', friend_requests.get_friends, name='get_friends'),
    path('get_block_list/', friend_requests.get_block_list, name='get_block_list'),
    path('block_friend/', friend_requests.block_friend, name='block_friend'),
    path('unblock_friend/', friend_requests.unblock_friend, name='unblock_friend'),
    path('update_username/', update_username.update_username, name='update_username'),
    path('upload_profile_picture/', pfp_utils.upload_profile_picture, name='upload_profile_picture'),
]

