cd /djangoSource/ft_transcendenceBackend

python3 /djangoSource/ft_transcendenceBackend/manage.py makemigrations
python3 /djangoSource/ft_transcendenceBackend/manage.py migrate
python3 manage.py runsslserver 0.0.0.0:8000 --certificate /cert.pem --key /key.pem