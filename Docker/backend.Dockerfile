FROM debian:bullseye

RUN apt-get update && apt-get -y install python3 python3-pip
RUN pip install django

WORKDIR /djangoSource/ft_transcendenceBackend/

ENTRYPOINT [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]

#EXPOSE 8000
