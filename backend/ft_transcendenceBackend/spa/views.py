from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.contrib import messages
from django.contrib.auth import login, logout
from spa.models import CustomUser
import requests
import json
import time
import jwt
import os
from datetime import datetime
from urllib.parse import urlencode
from django.conf import settings


def home(request):
    token = request.session.get('token')
    custom_users = CustomUser.objects.all()
    for user in custom_users:
        print(f'User: {user.username}')
        print(f'  User ID: {user.userid}')
        print(f'  Join Date: {user.join_date}')
        print(f'  Pfp : {user.profile_picture}')
    return render(request, 'frontend/index.html',{'token': token})
    
def custom_logout(request):
    if 'token' in request.session:
        del request.session['token']
    return redirect ('home')

def download_image(url, destination):
    response = requests.get(url)
    if response.status_code == 200:
        with open(destination, 'wb') as f:
            f.write(response.content)
        return True
    else:
        return False

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
                pfp_dic = api_response.json().get('image')
                pfp_link = pfp_dic.get('link')
                pfp_filename = f"{id_user}_profile_picture.jpg"
                pfp_destination = os.path.join(settings.MEDIA_ROOT, 'profile_pictures', pfp_filename)
                download_successful = download_image(pfp_link, pfp_destination)
                current_user = CustomUser(userid=id_user, username=login_user, profile_picture=f"profile_pictures/{pfp_filename}" if download_successful else None)
                current_user.save()
            if api_response.status_code == 200:
                jwt_token = jwt.encode({'access_token': access_token}, settings.JWT_SECRET_PHRASE, algorithm='HS256')
                request.session['token'] = jwt_token
                return redirect ('home')
    return HttpResponseServerError('ERROR')


# def testGame (request):
#     return render(request, 'frontend/testGame.html')