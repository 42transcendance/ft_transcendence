from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests

@csrf_exempt
def get_translate_add_friend(request):
    activate(request.session.get('language'))
    translations = {
        'add_friends': _("Add Friend"),
        'add_text': _("Add a friend to your friend list"),
        'username': _("Enter username"),
        'add_btn': _("Add"),
        'cnl_btn': _("Cancel"),
    }
    return JsonResponse({'translations': translations})

@csrf_exempt
def get_change_username_translate(request):
    activate(request.session.get('language'))
    translations = {
        'change_usr': _("Change Username"),
        'usr_text': _("Enter your new username"),
        'username': _("New Username"),
        'change_btn': _("Change"),
        'cnl_btn': _("Cancel"),
    }
    return JsonResponse({'translations': translations})


@csrf_exempt
def get_logout_translate(request):
    activate(request.session.get('language'))
    translations = {
        'logout': _("Logout"),
        'logout_text': _("Are you sure you want to logout?"),
        'yes_btn': _("Yes"),
        'no_btn': _("No"),
    }
    return JsonResponse({'translations': translations})

@csrf_exempt
def get_pfp_translate(request):
    activate(request.session.get('language'))
    translations = {
        'upload': _("Upload Profile Picture"),
        'file_btn': _("Choose File"),
        'file_text': _("No file chosen"),
        'upload_btn': _("Upload"),
        'cnl_btn': _("Cancel"),
    }
    return JsonResponse({'translations': translations})

@csrf_exempt
def get_block_translate(request):
    activate(request.session.get('language'))
    translations = {
        'block': _("Block User"),
        'block_txt': _("Are you sure you want to block this user?"),
        'yes_btn': _("Yes"),
        'no_btn': _("No"),
    }
    return JsonResponse({'translations': translations})

@csrf_exempt
def get_notif_translate(request):
    message = request.GET.get('message')
    activate(request.session.get('language'))
    translations = {
        'message' : _(message),
    }
    return JsonResponse({'translations': translations})
