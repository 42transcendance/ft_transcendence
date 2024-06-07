from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from spa.models import ChatMessage, CustomUser, GameHistory, Game
from django.conf import settings
from .usersManagement.pfp_utils import download_image, get_base64_image
from .friend_requests import * 
from .translate.static_translate import *
from channels.db import database_sync_to_async
from django.utils import timezone
from django.db import models

from django.db.models import Q

from django.utils.translation import gettext_lazy as _

import requests
import jwt
import os   

def home(request):
    token = request.session.get('token')
    language = request.session.get('language')

    if not language:
        request.session['language'] = 'en'
        
    translations = translate_static(request.session.get('language'))

    return render(request, 'frontend/index.html', {'token': token, 'translations': translations})
    
def custom_logout(request):
    if 'token' in request.session:
        del request.session['token']
    return redirect ('home')


def extract_user_info_from_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_PHRASE, algorithms=['HS256'])
        user_id = payload.get('user_id')
        username = payload.get('username')
        print(f"Extracted user_id: {user_id} (type: {type(user_id)})")
        print(f"Extracted username: {username}")
        return user_id, username
    except jwt.ExpiredSignatureError:
        return None, None
    except jwt.InvalidTokenError:
        return None, None

def change_language(request):
    if request.method == 'GET':
        language = request.GET.get('language', None)
        print(language)
        if language in ['en', 'fr', 'it']:
            request.session['language'] = language
            return JsonResponse({'success': True})
    return JsonResponse({'success': False})

def callback(request):
    code = request.GET.get('code')
    if code:
        token_url = 'https://api.intra.42.fr/oauth/token'
        response = requests.post(token_url, data={
            'grant_type': 'authorization_code',
            'client_id': settings.API_CLIENT_KEY,
            'client_secret': settings.API_SK,
            'redirect_uri': 'http://localhost:8000/callback',
            'code': code
        })
        print(response.json())
        if response.status_code == 200:
            access_token = response.json().get('access_token')
            print("ACCESS TOKEN ------------------------- ",access_token)
            headers = {
                'Authorization': 'Bearer ' + access_token
            }
            info_url = 'https://api.intra.42.fr/v2/me'
            api_response = requests.get(info_url, headers=headers)
            id_user = api_response.json().get('id')
            
            if CustomUser.objects.filter(userid=id_user).exists():
                 current_user = CustomUser.objects.get(userid=id_user)
            else :
                login_user = api_response.json().get('login')
                base_username = login_user
                username_suffix = 1
                while CustomUser.objects.filter(username=login_user).exists():
                    login_user = f"{base_username}_{username_suffix}"
                    username_suffix += 1
                pfp_dic = api_response.json().get('image')
                pfp_link = pfp_dic.get('link')
                pfp_filename = f"{id_user}_profile_picture.jpg"
                pfp_destination = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', pfp_filename)
                download_successful = download_image(pfp_link, pfp_destination)
                current_user = CustomUser(userid=id_user, username=login_user, profile_picture=f"profile_pictures/{pfp_filename}" if download_successful else None)
                current_user.save()
            if api_response.status_code == 200:
                jwt_token = jwt.encode({'user_id': current_user.userid, 'username': current_user.username}, settings.JWT_SECRET_PHRASE, algorithm='HS256')
                request.session['token'] = jwt_token
                return redirect ('home')
    return HttpResponseServerError('ERROR')

def get_chat_history(request):
    user_id, username = extract_user_info_from_token(request.session.get('token'))
    if not user_id:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    chat_type = request.GET.get('chat_type', 'global')
    target_user_id = request.GET.get('target_user_id', None)
    print(f"Fetching chat history for user: {user_id} chat_type: {chat_type} target_user_id: {target_user_id}")
    messages = []

    if chat_type == 'global':
        messages = ChatMessage.objects.filter(is_global=True).order_by('timestamp')
    elif chat_type == 'private' and target_user_id:
        messages = ChatMessage.objects.filter(
            models.Q(sender__userid=user_id, recipient__userid=target_user_id) |
            models.Q(sender__userid=target_user_id, recipient__userid=user_id)
        ).order_by('timestamp')
    
    print(f"Fetched messages: {messages}")

    chat_history = []
    for message in messages:
        chat_history.append({
            'sender': message.sender.username,
            'sender_id': message.sender.userid,  # Add sender_id here
            'recipient': message.recipient.username if message.recipient else 'global',
            'recipient_id': message.recipient.userid if message.recipient else None,  # Add recipient_id here
            'message': message.message,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        })

    print(f"Chat history response: {chat_history}")
    return JsonResponse({'chat_history': chat_history})


@database_sync_to_async
def save_chat_message(sender_id, recipient_id, message, is_global):
    try:
        print(f"Saving message from sender_id: {sender_id} (type: {type(sender_id)}) to recipient_id: {recipient_id} (type: {type(recipient_id)})")
        sender = CustomUser.objects.get(userid=sender_id)
    except CustomUser.DoesNotExist:
        print(f"Error: CustomUser with userid {sender_id} does not exist.")
        return

    recipient = CustomUser.objects.get(userid=recipient_id) if recipient_id else None
    ChatMessage.objects.create(sender=sender, recipient=recipient, message=message, timestamp=timezone.now(), is_global=is_global)
