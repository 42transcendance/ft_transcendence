#!/bin/bash

su djangodb -c "/usr/lib/postgresql/13/bin/pg_ctl -D /usr/local/pgsql/data/ start"

su djangodb -c "createdb ${DB_NAME}"

psql -U djangodb << EOF
CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
ALTER ROLE "$DB_USER" SET client_encoding TO 'utf8';
ALTER ROLE "$DB_USER" SET default_transaction_isolation TO 'read committed';
ALTER ROLE "$DB_USER" SET timezone TO 'UTC';
GRANT CONNECT ON DATABASE "$DB_NAME" TO "$DB_USER";
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO "$DB_USER";
EOF

su djangodb -c "/usr/lib/postgresql/13/bin/pg_ctl -D /usr/local/pgsql/data/ stop"

su djangodb -c "/usr/lib/postgresql/13/bin/postgres -D /usr/local/pgsql/data/"