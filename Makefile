REGISTRY?=registry.gitlab.com/daustinsac/setbeat-client/setbeat
APP_VERSION?=latest

default: build

build: format lint
	yarn run build

deps:
	yarn install --pure-lockfile
	npm rebuild node-sass

test:
	yarn run test

format:
	yarn run prettier

lint:
	yarn run lint

registry: registry-build registry-push

registry-build:
	docker build --pull -t $(REGISTRY):$(APP_VERSION) .

registry-push:
	docker push $(REGISTRY):$(APP_VERSION)

dev:
	ENV=dev skaffold dev