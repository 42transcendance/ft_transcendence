from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from ft_transcendenceBackend.forms import LoginForm, SignUpForm, ProfileForm
from spa.models import Profile


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


def testGame(request):
    return render(request, 'frontend/testGame.html')