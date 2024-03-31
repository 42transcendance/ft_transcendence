#!/bin/bash

apiSecretKey=""
apiClientKey=""

read -p "Enter the API Secret Key : " apiSecretKey
read -p "Enter the API Client Key : " apiClientKey

sed -i 's/API_SECRET_KEY=.*/API_SECRET_KEY='$apiSecretKey'/' docker-compose.yml

sed -i 's/API_CLIENT_KEY=.*/API_CLIENT_KEY='$apiClientKey'/' docker-compose.yml
