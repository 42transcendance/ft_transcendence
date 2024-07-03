#!/bin/bash

chmod a+r /postgresql.conf /pg_hba.conf

useradd djangodb -m

chown djangodb /postgresql.conf /pg_hba.conf

mkdir -p /usr/local/pgsql/data/

chown djangodb /usr/local/pgsql/ /usr/local/pgsql/data/

su djangodb -c "/usr/lib/postgresql/13/bin/initdb -D /usr/local/pgsql/data/"

mv /postgresql.conf /usr/local/pgsql/data/.

mv /pg_hba.conf /usr/local/pgsql/data/.

chown djangodb /var/run/postgresql
