from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError, JsonResponse
from spa.models import CustomUser, GameHistory, Game
from django.conf import settings
from .usersManagement.pfp_utils import download_image, get_base64_image
from .friend_requests import * 
from .translate.static_translate import *

from django.utils.translation import gettext_lazy as _

import requests
import jwt
import os   

def home(request):
    token = request.session.get('token')
    language = request.session.get('language')

    if not language:
        request.session['language'] = 'fr'
        
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
        return user_id, username
    except jwt.ExpiredSignatureError:
        return None, None
    except jwt.InvalidTokenError:
        return None, None



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