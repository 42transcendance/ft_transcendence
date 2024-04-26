
from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _

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
        'two_fa': _("Two Factor Authentication:"),
        'disable': _("Disabled"),
        'change': _("Change"),
        'joined': _("Joined"),
        'mtch_plyd': _("Matches Played:"),
        'duel': _("Duel"),
        'tourn': _("Tournament"),
        'start_g': _("Start game"),
        'ply_1': _("Player 1:"),
        'ply_2': _("Player 2:"),
        'ply_3': _("Player 3:"),
        'carrers': _("Carrer's"),
        'logout': _("Logout"),
        'message_ph': _("Type your message here..."),
    }

    return translations