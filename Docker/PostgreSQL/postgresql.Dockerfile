FROM debian:bullseye

RUN apt-get update && \
    apt-get -y install postgresql

COPY scripts/init_db.sh /init_db.sh 

COPY scripts/start_script.sh /start_script.sh

RUN chmod +x start_script.sh init_db.sh

COPY conf/postgresql.conf /postgresql.conf

COPY conf/pg_hba.conf /pg_hba.conf

RUN ./start_script.sh

ENTRYPOINT [ "bash", "init_db.sh" ]

EXPOSE 5432 