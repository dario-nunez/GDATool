# Docker Configs:
Handles all the Docker images needed to run the system: MongoDB, Elasticsearch, Kibana, elasticsearch-service, mongodb-service, website-ui, Spark: Master, Spark: Worker 1 and Spark: Worker 2.

# Connecting to docker container via SSH:
docker exec -it <container_name> /bin/bash

# Copying the shaded jar to the docker container:
On a normal console do: docker cdp <shaded_jar_path> <container_id>:<destination_path>
docker cp /home/dario/github/GDATool/analytic-engine/target/analytic-engine-1.0-SNAPSHOT-shaded.jar 55e86bb897fc:/spark/examples/jars

# Spark_submit arguments for running an application on a Spark standalone cluster in CLIENT deploy mode
./bin/spark-submit \
  --class <main-class> \
  --master <master-url> \
  --deploy-mode <deploy-mode> \
  --conf <key>=<value> \

# Running spark-submit. Run form /spark:
./bin/spark-submit --class Main --master spark://55e86bb897fc:7077 --executor-memory 2G /spark/examples/jars/analytic_engine_rewrite-1.0-SNAPSHOT-shaded.jar DEV 5e2df7c21111fb240d36c85f 5e2dfca61111fb240d36c860

./bin/spark-submit --class AnalysisMain --master spark://360b36e62022:7077 --executor-memory 2G /spark/examples/jars/analytic_engine_rewrite-1.0-SNAPSHOT-shaded.jar DEV 5e2df7c21111fb240d36c85f 5e2dfca61111fb240d36c860

# Maven routine to create the shaded jar:
Clean, Compile, Package