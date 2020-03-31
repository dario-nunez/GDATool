# Website Ui
The Angular website front end of the system. Available on [localhost](http://localhost:4200/) once running.

## Requirements
1. [Docker](https://www.docker.com/)
2. Active docker container runnig MongoDB, Elasticsearch and Kibana

## Run (script)
1. Run docker-config's docker container
2. Navigate to `/website-ui`
3. Execute `./run`

## Run (manually)
1. Run the docker-config docker container
2. Navigate to `/website-ui`
3. Execute `ng serve --open`

## Test
1. Navigate to `/website-ui`
2. Execute `ng test`