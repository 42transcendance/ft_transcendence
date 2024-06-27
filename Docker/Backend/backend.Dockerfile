FROM debian:bullseye

RUN apt-get update && apt-get -y install \
        python3 \
        python3-pip \
        python3-psycopg2 \
        gettext \
        openssl

RUN pip install django

RUN python3 -m pip install Pillow channels==3.0.4 requests pyjwt python-dotenv django-environ django-sslserver whitenoise

RUN openssl genpkey -algorithm RSA -out /key.pem \
    && openssl req -new -key /key.pem -out /csr.pem -subj "/CN=localhost" \
    && openssl x509 -req -days 365 -in /csr.pem -signkey /key.pem -out /cert.pem

COPY ./scripts/start_django.sh /start_django.sh

COPY ./conf/.pg_service.conf /pg_service.conf

COPY ./conf/.pgpass /.pgpass

WORKDIR /djangoSource/ft_transcendenceBackend

ENTRYPOINT [ "bash", "/start_django.sh" ]

EXPOSE 8000
