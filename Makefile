PATH_YML = ./docker-compose.yml

all: start

test:
	@utils/setup.sh

start:
	@utils/setup.sh
	@docker-compose -f $(PATH_YML) up --build

stop:
	@docker-compose -f $(PATH_YML) stop

prune: stop
	@docker-compose -f $(PATH_YML) down -v
	@docker system prune -af
	@rm -rf /home/${USER}/pgdatabase/*

	@rm -rf .env

	@rm -rf ./Docker/Backend/conf/.pgpass
	@rm -rf ./Docker/Backend/conf/.pg_service.conf

	@echo "Pruned docker system, deleted content of database, deleted env file"

re: prune start