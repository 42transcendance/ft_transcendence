PATH_YML = ./docker-compose.yml

HOSTNAME= $(shell hostname | cut -d '.' -f 1)

all: build start

build:
	@utils/djangoEnvSetup.sh
	@utils/postgresEnvSetup.sh
	@utils/setApi.sh
	docker-compose -f $(PATH_YML) build

start:
	@utils/postgresEnvSetup.sh
	docker-compose -f $(PATH_YML) up

stop:
	@docker-compose -f $(PATH_YML) stop

setup:
	@utils/djangoEnvSetup.sh
	@utils/postgresEnvSetup.sh

prune: stop
	
	@docker run --rm -v /goinfre/$(USER)/pgdatabase/:/pgdatabase alpine sh -c 'rm -rf /pgdatabase/* && echo "Cleanup complete"'
	@rm -rf /goinfre/$(USER)/pgdatabase/
	@docker-compose -f $(PATH_YML) down -v
	@docker system prune -af
	@find ./backend/ft_transcendenceBackend/media/profile_pictures/ -type f ! -name 'nerdface.png' -exec rm {} +

	@sed -i "s|'redirect_uri': 'https://[^']*',|'redirect_uri': 'https://localhost:8000/callback',|" ./backend/ft_transcendenceBackend/spa/views.py

	@rm -rf *.env

	@rm -rf ./Docker/Backend/conf/.pgpass
	@rm -rf ./Docker/Backend/conf/.pg_service.conf
	
	@echo "Pruned docker system, deleted content of database, deleted env file"

re: prune all