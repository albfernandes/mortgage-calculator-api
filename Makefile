install:
	docker-compose up -d

test:
	docker-compose up -d
	docker-compose exec -T mortgage-api npm test
