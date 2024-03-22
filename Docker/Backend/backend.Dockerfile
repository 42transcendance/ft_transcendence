FROM debian:bullseye

RUN apt-get update && apt-get -y install \
        python3 \
        python3-pip \
        python3-psycopg2 

<<<<<<< HEAD
RUN pip install django

RUN python3 -m pip install Pillow requests pyjwt python-dotenv django-environ
=======
RUN python3 -m pip install django Pillow channels==3.0.4
>>>>>>> dd13b353736ec1bd87d7cc6e2799f68f6b753d7a

COPY ./scripts/start_django.sh /start_django.sh

COPY ./conf/.pg_service.conf /pg_service.conf

COPY ./conf/.pgpass /.pgpass

<<<<<<< HEAD
<<<<<<< HEAD
# ENTRYPOINT [ "bash", "start_django.sh"]

ENTRYPOINT ["tail", "-f", "/dev/null"]        
=======
# ENTRYPOINT [ "bash", "start_django.sh" ]

ENTRYPOINT [ "tail", "-f", "/dev/null" ]
>>>>>>> dd13b353736ec1bd87d7cc6e2799f68f6b753d7a
=======
ENTRYPOINT [ "bash", "start_django.sh" ]
>>>>>>> origin/main

EXPOSE 8000
