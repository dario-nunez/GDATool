# Elasticsearch Service
Interfaces with the Elasticsearch cluster. Creates index patterns, visualizations and dashboards. This service listens on port 5020 and exposes a [Swagger UI](http://localhost:5020/es/swagger/#/) once it is running.

## Requirements
1. [Docker](https://www.docker.com/)
2. Active docker container runnig MongoDB, Elasticsearch and Kibana
3. mongodb-service

## Run (script)
1. Run docker-config's docker container
2. Navigate to `/elasticsearch-service`
3. Execute `./run`

## Run (manually)
1. Run the docker-config docker container
2. Navigate to `/elasticsearch-service`
3. Execute `npm run build`
4. Execute `npm run start`

## Test
1. Run mongodb-service
2. Navigate to `/elasticsearch-service`
3. Execute `npm run test` or `npm run test:coverage` for a test coverage report

## Test coverage report

Category        |Percentage |Totals
----------------|-----------|---------
Tests passing   |100%       |( 21/21 )
Statements      |91.85%     |( 327/356 )
Branches        |81.25%     |( 39/48 )
Functions       |94.44%     |( 51/54 )
Lines           |91.76%     |( 312/340 )