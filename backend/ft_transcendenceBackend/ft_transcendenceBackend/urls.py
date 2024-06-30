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
from spa.usersManagement import game_history
from spa.translate import modal_translate
from spa.translate import profile_friends_translate
from spa.translate import tournament_translate
from spa.translate import static_translate

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
	path('message_from_blocked/', friend_requests.message_from_blocked, name='message_from_blocked'),
    path('block_friend/', friend_requests.block_friend, name='block_friend'),
    path('unblock_friend/', friend_requests.unblock_friend, name='unblock_friend'),
    path('update_username/', update_username.update_username, name='update_username'),
    path('upload_profile_picture/', pfp_utils.upload_profile_picture, name='upload_profile_picture'),
    path('get_game_history/', game_history.get_game_history, name='get_game_history'),
    path('get_translate_add_friend/', modal_translate.get_translate_add_friend, name='get_translate_add_friend'),
    path('get_change_username_translate/', modal_translate.get_change_username_translate, name='get_change_username_translate'),
    path('get_logout_translate/', modal_translate.get_logout_translate, name='get_logout_translate'),
    path('get_pfp_translate/', modal_translate.get_pfp_translate, name='get_pfp_translate'),
    path('get_empty_translate/', profile_friends_translate.get_empty_translate, name='get_empty_translate'),
    path('get_block_translate/', modal_translate.get_block_translate, name='get_block_translate'),
    path('get_notif_translate/', modal_translate.get_notif_translate, name='get_notif_translate'),
    path('tournament_form_translate/', tournament_translate.tournament_form_translate, name='tournament_form_translate'),
    path('tournament_next_translate/', tournament_translate.tournament_next_translate, name='tournament_next_translate'),
    path('tournament_win_translate/', tournament_translate.tournament_win_translate, name='tournament_win_translate'),
    path('tournament_winmsg_translate/', tournament_translate.tournament_winmsg_translate, name='tournament_winmsg_translate'),
    path('change_language/', views.change_language, name='change_language'),
	path('get_chat_history/', views.get_chat_history, name='get_chat_history'),
	path('save_chat_message/', views.save_chat_message, name='save_chat_message'),
	path('get_chat_users/', views.get_chat_users, name='get_chat_users'),
    path('invite_code_translate/', tournament_translate.invite_code_translate, name='invite_code_translate'),
	path('check_authentication/', views.check_authentication, name='check_authentication'),
    path('get_translations/', static_translate.get_translations, name='get_translations'),
    

]


