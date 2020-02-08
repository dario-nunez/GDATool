# Docker Configs:
Handles all the Docker images needed to run the system: MongoDB, Elasticsearch, Kibana, elasticsearch-service, mongodb-service, website-ui, Spark: Master, Spark: Worker 1 and Spark: Worker 2.

# Connecting to docker container via SSH:
docker exec -it <container_name> /bin/bash

docker exec -it be07446bf2a2 /bin/bash

# Copying the shaded jar to the docker container:
On a normal console do: docker cdp <shaded_jar_path> <container_id>:<destination_path>
docker cp /home/dario/github/GDATool/analytic-engine/target/analytic-engine-1.0-SNAPSHOT-shaded.jar 55e86bb897fc:/spark/examples/jars

docker cp Documents/GitHub/GDATool/analytic-engine/target/analytic-engine-1.0-SNAPSHOT-shaded.jar be07446bf2a2:/spark/examples/jars

docker cp Documents/GitHub/GDATool/spark-service/target/spark-service-1.0-SNAPSHOT.jar f4581838eb9c:/spark

# Spark_submit arguments for running an application on a Spark standalone cluster in CLIENT deploy mode
./bin/spark-submit \
  --class <main-class> \
  --master <master-url> \
  --deploy-mode <deploy-mode> \
  --conf <key>=<value> \

# Running spark-submit. Run form /spark:
./bin/spark-submit --class com.mycompany.run.SchemaInferenceMain --master spark://be07446bf2a2:7077 --executor-memory 2G /spark/examples/jars/analytic-engine-1.0-SNAPSHOT-shaded.jar DOCKER 5e39de14114a0621c760d9ab 5e39de29114a0621c760d9ac

./bin/spark-submit --class com.mycompany.run.DataAnalysisMain --master spark://be07446bf2a2:7077 --executor-memory 2G /spark/examples/jars/analytic-engine-1.0-SNAPSHOT-shaded.jar DOCKER 5e39de14114a0621c760d9ab 5e39de29114a0621c760d9ac

# Maven routine to create the shaded jar:
Clean, Compile, Package

# Running jar files
java -jar <filename>.jar

# List open ports on Mac
lsof -nP +c 15 | grep LISTEN

# Hitting an endpoint on a container
use localhost:exposed_port...