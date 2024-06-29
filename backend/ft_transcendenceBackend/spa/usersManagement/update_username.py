from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from spa.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
import requests
import jwt
from spa.views import extract_user_info_from_token

def update_username(request):
    new_username = request.GET.get('search_term', '')
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        try:
            user = CustomUser.objects.get(userid=user_id)
            try:
                existing_user = CustomUser.objects.get(username=new_username)
                return JsonResponse({'error': 'Username already taken'}, status=400)
            except ObjectDoesNotExist:
                user.username = new_username
                user.save()
                return JsonResponse({'username': user.username}, status=200)

        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Invalid token'}, status=401)