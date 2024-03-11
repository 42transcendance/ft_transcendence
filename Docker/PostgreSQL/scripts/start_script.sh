#!/bin/bash

chmod a+r /postgresql.conf /pg_hba.conf
chown djangodb /postgresql.conf
chown djangodb /pg_hba.conf

useradd djangodb -m

mkdir /usr/local/pgsql/ /usr/local/pgsql/data/

chown djangodb /usr/local/pgsql/
chown djangodb /usr/local/pgsql/data/

su djangodb -c "/usr/lib/postgresql/13/bin/initdb -D /usr/local/pgsql/data/"

mv /postgresql.conf /usr/local/pgsql/data/.

mv /pg_hba.conf /usr/local/pgsql/data/.

chown djangodb /var/run/postgresql