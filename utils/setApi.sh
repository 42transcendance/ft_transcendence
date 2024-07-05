#!/bin/bash

hostname=$(hostname | cut -d '.' -f 1)

port=8000

redirect_uri="https://${hostname}:${port}/callback"


sed -i "s|'redirect_uri': 'https://[^']*',|'redirect_uri': '${redirect_uri}',|" ./backend/ft_transcendenceBackend/spa/views.py

sed -i "s/localhost/$hostname/g" ./backend/ft_transcendenceBackend/spa/static/js/login.js

