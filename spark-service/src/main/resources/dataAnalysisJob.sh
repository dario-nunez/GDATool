#!/bin/bash
echo "userId: $1"
echo "jobId: $2"
echo "clusterMasterId: $3"
./bin/spark-submit --class com.mycompany.run.DataAnalysisMain --master spark://$3:7077 --executor-memory 2G /spark/examples/jars/analytic-engine-1.0-SNAPSHOT-shaded.jar DOCKER $1 $2