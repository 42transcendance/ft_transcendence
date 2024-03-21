FROM debian:bullseye

RUN apt-get update && apt-get -y install \
        python3 \
        python3-pip \
        python3-psycopg2 

RUN pip install django

RUN python3 -m pip install Pillow requests pyjwt python-dotenv django-environ

COPY ./scripts/start_django.sh /start_django.sh

COPY ./conf/.pg_service.conf /pg_service.conf

COPY ./conf/.pgpass /.pgpass

# ENTRYPOINT [ "bash", "start_django.sh"]

ENTRYPOINT ["tail", "-f", "/dev/null"]        

EXPOSE 8000
