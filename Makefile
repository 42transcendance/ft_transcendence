PATH_YML = ./docker-compose.yml

all: build start

build:
	@utils/setApiKeys.sh
	@utils/setup.sh
	docker-compose -f $(PATH_YML) build

start:
	@utils/setup.sh
	docker-compose -f $(PATH_YML) up

stop:
	@docker-compose -f $(PATH_YML) stop

prune: stop
	
	@docker run --rm -v /goinfre/$(USER)/pgdatabase/:/pgdatabase alpine sh -c 'rm -rf /pgdatabase/* && echo "Cleanup complete"'
	@rm -rf /goinfre/$(USER)/pgdatabase/
	@docker-compose -f $(PATH_YML) down -v
	@docker system prune -af
	@rm -rf ./backend/ft_transcendenceBackend/media/profile_pictures/*

	@rm -rf .env

	@rm -rf ./Docker/Backend/conf/.pgpass
	@rm -rf ./Docker/Backend/conf/.pg_service.conf

	@sed -i 's/API_SECRET_KEY=.*/API_SECRET_KEY=s/' docker-compose.yml
	@sed -i 's/API_CLIENT_KEY=.*/API_CLIENT_KEY=u/' docker-compose.yml

	@echo "Pruned docker system, deleted content of database, deleted env file"

re: prune start