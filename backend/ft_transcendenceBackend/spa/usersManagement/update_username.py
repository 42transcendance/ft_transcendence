from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from spa.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
import requests
import jwt
from spa.views import extract_user_info_from_token
from django.conf import settings
from django.core.cache import cache

from channels.db import database_sync_to_async


def update_username(request):
    new_username = request.GET.get('search_term', '')
    if not new_username.strip():
        return JsonResponse({'error': 'Username cannot be blank'}, status=400)
    
    token = request.session.get('token')
    if token:
        user_id, username = extract_user_info_from_token(token)
        
        try:
            user = CustomUser.objects.get(userid=user_id)
            
            try:
                existing_user = CustomUser.objects.get(username=new_username)
                return JsonResponse({'error': 'Username already taken'}, status=400)
            except CustomUser.DoesNotExist:
                old_username = user.username
                user.username = new_username
                user.save()
                
                cache.clear()
                updated_user = CustomUser.objects.get(userid=user_id)
                
                jwt_token = jwt.encode({'user_id': user.userid, 'username': user.username}, settings.JWT_SECRET_PHRASE, algorithm='HS256')
                request.session['token'] = jwt_token
                
                print(f"Username changed from {old_username} to {new_username}")
                return JsonResponse({}, status=200)
        
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'An error occurred while updating the username: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid token'}, status=401)
