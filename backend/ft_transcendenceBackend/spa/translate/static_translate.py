from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests


def translate_static(language):
    activate(language)
    translations = {
        'social': _("Social"),
        'friends': _("FRIENDS"),
        'chats': _("CHATS"),
        'add_friend': _("ADD FRIEND"),
        'frds': _("Friends"),
        'out_req': _("Outgoing Requests"),
        'inc_req': _("Incoming Requests"),
        'blocked': _("Blocked"),
        'cre_cha': _("CREATE CHANNEL"),
        'joi_cha': _("JOIN CHANNEL"),
        'glo_cha': _("Global Chat"),
        'messages': _("Messages"),
        'send': _("Send"),
        'settings': _("Settings"),
        'user_name': _("Username:"),
        'change': _("Change"),
        'joined': _("Joined"),
        'mtch_plyd': _("Matches Played:"),
        'duel': _("Duel"),
        'tourn': _("Tournament"),
        'start_g': _("Start game"),
        'ply_1': _("Player 1:"),
        'ply_2': _("Player 2:"),
        'ply_3': _("Player 3:"),
        'fp': _("Friends Profile"),
        'logout': _("Logout"),
        'message_ph': _("Type your message here..."),
        'language' : _("Language Selection :"),
        'en' : _("English"),
        'fr' :_("French"),
        'it' :_("Italian"),
        'crt_priv' : _("Create Private Game"),
        'join_priv' : _("Join Private Game"),
        'wfo' : _("Waiting for opponent..."),
        'join' : _("Join"),
        'privid' : _("Enter private game id."),
        'genchat' : _("General Chat"),
        'cancel_game_text' : _("Cancel Game")
    }

    return translations

def get_translations(request):
    activate(request.session.get('language'))
    translations = {
        'social': _("Social"),
        'friends': _("FRIENDS"),
        'chats': _("CHATS"),
        'add_friend': _("ADD FRIEND"),
        'frds': _("Friends"),
        'out_req': _("Outgoing Requests"),
        'inc_req': _("Incoming Requests"),
        'blocked': _("Blocked"),
        'cre_cha': _("CREATE CHANNEL"),
        'joi_cha': _("JOIN CHANNEL"),
        'glo_cha': _("Global Chat"),
        'messages': _("Messages"),
        'send': _("Send"),
        'settings': _("Settings"),
        'user_name': _("Username:"),
        'change': _("Change"),
        'joined': _("Joined"),
        'mtch_plyd': _("Matches Played:"),
        'duel': _("Duel"),
        'tourn': _("Tournament"),
        'start_g': _("Start game"),
        'ply_1': _("Player 1:"),
        'ply_2': _("Player 2:"),
        'ply_3': _("Player 3:"),
        'fp': _("Friends Profile"),
        'logout': _("Logout"),
        'message_ph': _("Type your message here..."),
        'language' : _("Language Selection :"),
        'en' : _("English"),
        'fr' :_("French"),
        'it' :_("Italian"),
        'crt_priv' : _("Create Private Game"),
        'join_priv' : _("Join Private Game"),
        'wfo' : _("Waiting for opponent..."),
        'join' : _("Join"),
        'privid' : _("Enter private game id."),
        'genchat' : _("General Chat"),
        'cancel_game_text' : _("Cancel Game")
    }
    return JsonResponse({'translations' : translations})