#!/bin/bash

directory="/goinfre/$USER/pgdatabase"

if [ ! -d "$directory" ]; then
  echo "Database directory doesn't exist. Creating it now..."
  mkdir -p "$directory"
  echo "Database directory created at $directory"
else
  echo "Database directory already exists."
fi

mkdir -p ./Docker/Backend/conf/
env_file="postgres.env"
user_input=""
password_file="./Docker/Backend/conf/.pgpass"
service_file="./Docker/Backend/conf/.pg_service.conf"

if [ ! -e "$env_file" ] || [ ! -e "$password_file" ] || [ ! -e "$service_file" ]; then
  echo "Files needed for configuration have been compromised you might need to intervene"
fi

if [ -e "$env_file" ]; then
  echo "The .env file already exists."
else
  read -p "Enter django user's password for postgres: " user_input
  
  echo "DB_NAME=djangodb" > "$env_file"
  echo "DB_USER=postgresUser" >> "$env_file"
  echo "DB_PASSWORD=$user_input" >> "$env_file"
  echo "DB_HOST=postgresql" >> "$env_file"
  echo "DB_PORT=5432" >> "$env_file"
fi



if [ -e "$password_file" ]; then
    echo "Password file already exists."
else
    echo "[django]" > $service_file
    echo "dbname=djangodb" >> $service_file
    echo "user=postgresUser" >> $service_file
    echo "password=$user_input" >> $service_file
    echo "host=postgresql" >> $service_file
    echo "port=5432" >> $service_file
    
    
    
    echo "postgresql:5432:djangodb:postgresUser:$user_input" > $password_file
fi