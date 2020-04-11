# Analytic Engine
Performs analytics on a given dataset. It loads the data, cleans it, performs analytics, stores the results in Elasticsearch & AWS and triggers the dashboard creation process.

## Requirements
1. [Docker](https://www.docker.com/)
2. Active docker container runnig MongoDB, Elasticsearch and Kibana
3. mongodb-service
4. elasticsearch-service
5. A property file containing AWS credentials.

## AWS credentials property file
The file should be stored as `analytic-engine/src/main/resources/common.properties` and contain the following properties
```
awsAccessKeyIdEnvVariable = <AWS key id>
awsSecretAccessKeyEnvVariable = <AWS secret>
appName = <S3 bucket root>
```

## Run (IDE virtual environment)

1. Ensure the `pom.xml` file is present in the project root
2. `build` the project
3. `run` any main class

## Run (Spark environment)

Steps 1 to 5 only need to be done once.

1. Navigate to `/analytic-engine`
2. Execute Maven `clean`
3. Execute Maven `compile`
4. Execute Maven `package` to create a shaded jar
5. Execute `docker cp <origin> <destination>` to copy the shaded jar to the Spark environment
6. Trigger Spark jobs using the command `./bin/spark-submit --class <job main class> --master <cluster master node id> --executor-memory 2G <shaded jar location> <console arguments>`

## Test (excluding EndToEnd test)

1. Execute Maven `test`

## Test (including EndToEnd test)

1. Remove the `@Ignore` annotation from the EndToEnd test class
2. Run mongodb-service
3. Run elasticsearch-service
4. Execute Maven `test`

## Test coverage report (including EndToEnd test)

Category        |Percentage |Totals
----------------|-----------|---------
Tests passing   |100%       |( 41/41 )

### Class breakdown

Element         |Class          |Method         |Line               |
----------------|---------------|---------------|-------------------|
configuration   |75%    (3/4)   |71%    (10/14) |61%    (40/65)     |
jobs            |100%   (6/6)   |88%    (30/34) |83%    (237/283)   |
models          |90%    (10/11) |88%    (35/52) |58%    (138/236)   |
run             |0%     (0/2)   |0%     (0/2)   |0%     (0/19)      |
services        |100%   (16/16) |100%   (26/26) |100%   (80/80)     |
TOTAL           |0.89%          |75%            |72%                |