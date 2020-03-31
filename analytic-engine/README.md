# Analytic Engine
Performs analytics on a given dataset. It loads the data, performs groupbys, stores it in Elasticsearch and triggers the dashboard creation.

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