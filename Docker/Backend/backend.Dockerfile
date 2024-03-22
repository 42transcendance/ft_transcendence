FROM debian:bullseye

RUN apt-get update && apt-get -y install \
        python3 \
        python3-pip \
        python3-psycopg2 

RUN python3 -m pip install django Pillow channels==3.0.4

COPY ./scripts/start_django.sh /start_django.sh

COPY ./conf/.pg_service.conf /pg_service.conf

COPY ./conf/.pgpass /.pgpass

ENTRYPOINT [ "bash", "start_django.sh" ]

EXPOSE 8000
