from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests

@csrf_exempt
def get_empty_translate(request):
    activate(request.session.get('language'))
    translations = {
        'empty': _("Empty"),
        }
    return JsonResponse({'translations': translations})
