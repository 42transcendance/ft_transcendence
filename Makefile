PATH_YML = ./docker-compose.yml

all: build start

build:
	@utils/setup.sh
	docker-compose -f $(PATH_YML) build

start:
	@utils/setup.sh
	@docker-compose -f $(PATH_YML) up

stop:
	@docker-compose -f $(PATH_YML) stop

prune: stop
	@docker-compose -f $(PATH_YML) down -v
	@docker system prune -af
	@rm -rf ~/pgdatabase/*

	@rm -rf .env

	@rm -rf ./Docker/Backend/conf/.pgpass
	@rm -rf ./Docker/Backend/conf/.pg_service.conf
	@rm -rf ~/pgdatabase

	@echo "Pruned docker system, deleted content of database, deleted env file"

re: prune start