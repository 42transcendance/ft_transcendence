FROM debian:bullseye

RUN apt-get update && apt-get -y install \
        python3 \
        python3-pip \
        python3-psycopg2

RUN pip install django

COPY ./conf/.pg_service.conf /pg_service.conf

COPY ./conf/.pgpass /.pgpass

WORKDIR /djangoSource/ft_transcendenceBackend/

ENTRYPOINT [ "python3", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
