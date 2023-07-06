# USE below commands to build/run/push on different environments
# Development
# make build-dev ENV=dev
# make run ENV=dev
# make push ENV=dev

# Test
# make build-test
# make run
# make push

# Production
# make build ENV=prod
# make run ENV=prod
# make push ENV=prod

DOCKER_ID = jycontainertest.azurecr.io
APP_NAME = gapcure-backend:1.0.0

ifeq ($(ENV),prod)
	DOCKER_ID := jycontainersg.azurecr.io
	APP_NAME = gapcure-backend:1.0.0
endif

ifeq ($(ENV),dev)
	DOCKER_ID := jycontainerdev.azurecr.io
	APP_NAME = gapcure-backend:1.0.0
endif

.PHONY: build
# Build the container image - Development
build-dev:
	docker build -t $(DOCKER_ID)/${APP_NAME}\
		--target development-build-stage\
		-f Dockerfile .

# Build the container image - Test
build-test:
	docker build -t $(DOCKER_ID)/${APP_NAME}\
		--target test-build-stage\
		-f Dockerfile .

# Build the container image - Production
build:
	docker build -t $(DOCKER_ID)/${APP_NAME}\
		--target production-build-stage\
		-f Dockerfile .

# Clean the container image
clean:
	docker rmi -f $(DOCKER_ID)/${APP_NAME}

# Run the container image
run:
	docker run -it -p 8080:8081 $(DOCKER_ID)/${APP_NAME}

push:
	docker push $(DOCKER_ID)/${APP_NAME}

all: build
