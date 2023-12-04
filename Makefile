PATH_YML = ./docker-compose.yml

all: build start

build:
	docker-compose -f $(PATH_YML) build

start:
	docker-compose -f $(PATH_YML) up --build

stop:
	docker-compose -f $(PATH_YML) stop

prune:
	docker-compose -f $(PATH_YML) down
	docker system prune -af
	docker network prune -f
	docker volume rm ft_transcendence_backend

cleardbase:


