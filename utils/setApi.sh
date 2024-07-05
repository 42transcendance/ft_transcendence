#!/bin/bash

hostname=$(hostname | cut -d '.' -f 1)

port=8000

source django.env

clientKey=$API_CLIENT_KEY

redirect_uri="https://${hostname}:${port}/callback"

callbacklink="https://api.intra.42.fr/oauth/authorize?client_id=$clientKey&redirect_uri=https%3A%2F%2F$hostname%3A8000%2Fcallback&response_type=code"

echo $callbacklink

sed -i "s|'redirect_uri': 'https://[^']*',|'redirect_uri': '${redirect_uri}',|" ./backend/ft_transcendenceBackend/spa/views.py

echo "CALLBACK_LINK="$callbacklink"" >> "django.env"
