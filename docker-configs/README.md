# Docker Configs
Handles all the Docker images needed to run the system: MongoDB, Elasticsearch and Kibana. Elasticsearch runs version 7.3.0 and listens on ports 9300 and 9200. Kibana run version 7.3.0 and listens on port 5601. MongoDB run the latest version and listens on port 27017.

## Requirements
1. [Docker](https://www.docker.com/)

## Run (script)
1. Navigate to `/docker-config`
2. Execute `./run-env.sh`

## Run (manually)
1. Navigate to `/docker-config`
2. Execute `docker system prune -f` to clean the Docker environment
3. Execute `docker-compose -f docker-compose.yaml up` to create the images and start the containers

## Available docker-compose files

The file currently in use is `docker-compose.yaml` which only contains database related conponents. The `docker-compose-medium.yaml` adds a Spark Master node and the `docker-compose-full.yaml` builds on that by adding two Spark Worker nodes.