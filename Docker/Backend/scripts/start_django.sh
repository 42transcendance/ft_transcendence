
python3 /djangoSource/ft_transcendenceBackend/manage.py makemigrations
python3 /djangoSource/ft_transcendenceBackend/manage.py migrate

# python3 manage.py runsslserver 0.0.0.0:8000 --certificate /cert.pem --key /key.pem
python3 /djangoSource/ft_transcendenceBackend/manage.py collectstatic --no-input

export DJANGO_SETTINGS_MODULE=ft_transcendenceBackend.settings

daphne -e ssl:8000:privateKey=/key.pem:certKey=/cert.pem ft_transcendenceBackend.asgi:application
