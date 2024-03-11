from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from ft_transcendenceBackend.forms import LoginForm, SignUpForm, ProfileForm
from spa.models import Profile
import requests


def home(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get_or_create(user=request.user)[0]
        return render(request, 'frontend/index.html', {'is_user': True, 'profile': profile})
    else:
        return render(request, 'frontend/index.html', {'is_user': False})

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')
    else:
        form = LoginForm()
    return render(request, 'frontend/login.html', {'form': form})


def signup(request):
    if request.method == 'POST':
        user_form = SignUpForm(request.POST)
        profile_form = ProfileForm(request.POST, request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user = user_form.save()
            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()
            return redirect('home')
    else:
        user_form = SignUpForm()
        profile_form = ProfileForm()
    return render(request, 'frontend/signup.html', {'user_form': user_form, 'profile_form': profile_form}) 

def user_logout(request):
    logout(request)
    request.user = None
    return redirect('home')

def connexion(request):
    authorization_url = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5afc4a5214c57269a802fc3629c48621c8edf6b99e531450eb5975de732483d&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback&response_type=code'
    return HttpResponseRedirect(authorization_url)

def callback(request):
    CLIENT_ID = 'u-s4t2ud-a5afc4a5214c57269a802fc3629c48621c8edf6b99e531450eb5975de732483d'
    CLIENT_SECRET = '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'
    TOKEN_URL = 'https://api.intra.42.fr/oauth/token'

    authorization_code = request.GET.get('code')
    access_token = None

    if authorization_code:
        data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': authorization_code,
            'redirect_uri': 'http://localhost:8000/callback',
        }

        response = requests.post(TOKEN_URL, data=data)

        if response.status_code == 200:
            access_token = response.json().get('access_token')
        else:
            return HttpResponseServerError("Error obtaining access token")

    return render(request, 'frontend/test.html', {'token': access_token})
