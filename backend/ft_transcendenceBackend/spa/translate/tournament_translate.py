from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests

@csrf_exempt
def tournament_form_translate(request):
    activate(request.session.get('language'))
    translations = {
        'player': _("Player "),
        }
    return JsonResponse({'translations': translations})

@csrf_exempt
def tournament_next_translate(request):
    activate(request.session.get('language'))
    translations = {
        'next': _("Next match will be "),
        'against': _(" against "),
        'snm' : _("Start next match !"),
        }
    return JsonResponse({'translations' : translations})

@csrf_exempt
def tournament_win_translate(request):
    activate(request.session.get('language'))
    translations = {
        'win': _(" wins with a score of "),
        'against': _(" against "),
        }
    return JsonResponse({'translations' : translations})


@csrf_exempt
def tournament_winmsg_translate(request):
    activate(request.session.get('language'))
    translations = {
        'winmsg': _(" has won the tournament !"),
        }
    return JsonResponse({'translations' : translations})


@csrf_exempt
def invite_code_translate(request):
    activate(request.session.get('language'))
    translations = {
        'inv_code': _("Invite code : "),
        }
    return JsonResponse({'translations' : translations})
