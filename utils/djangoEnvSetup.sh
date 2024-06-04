#!/bin/bash

env_file="django.env"

apiSecretKey=""
apiClientKey=""
jwtSecretPhrase=""

read -p "Enter the API Secret Key : " apiSecretKey
read -p "Enter the API Client Key : " apiClientKey
read -p "Enter the JWT secret phrase : " jwtSecretPhrase

echo "API_SECRET_KEY=$apiSecretKey" > "$env_file"
echo "API_CLIENT_KEY=$apiClientKey" >> "$env_file"

echo "PGSERVICEFILE=/pg_service.conf" >> "$env_file"
echo "JWT_SECRET_PHRASE=$jwtSecretPhrase" >> "$env_file"