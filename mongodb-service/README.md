# MongoDB Service
Interfaces with MongoDB. Manages user and job preference data. The entities stored in the database are: User, Job, Plot, Aggregation, Cluster and Filter. This service listens on port 5000, offers CRUD operations and exposes a [Swagger UI](http://localhost:5000/ms/swagger/#/) once it is running.

## Requirements
1. [Docker](https://www.docker.com/)
2. An active docker container running MongoDB
3. An environment file containing system properties

## Environment file
The file should be stored as `mongodb-service/.env` and contain the following properties
```
MONGODB_URI = <URL to the MongoDB provider>
ENABLE_CORS = false
ENABLE_SWAGGER = true
awsAccessKeyIdEnvVariable = <AWS key id>
awsSecretAccessKeyEnvVariable = <AWS secret>
AWS_REGION = <S3 bucket region>
BUCKET_NAME = <S3 bucket root>
```

## Run (script)
1. Run docker-config's docker container
2. Navigate to `/mongodb-service`
3. Execute `./run`

## Run (manually)
1. Run the docker-config docker container
2. Navigate to `/mongodb-service`
3. Execute `npm run build`
4. Execute `npm run start`

## Test
1. Run the docker-config docker container
2. Navigate to `/mongodb-service`
3. Execute `npm run test` or `npm run test:coverage` for a coverage report

## Test coverage report

Category        |Percentage |Totals
----------------|-----------|---------
Tests passing   |100%       |( 67/67 )
Statements      |84.3%      |( 349/414 )
Branches        |64.29%     |( 18/28 )
Functions       |77.24%     |( 95/123 )
Lines           |84.04%     |( 337/401 )

## MongoDB entities

1. User
```
IUserModel{
    _id: string
    password: string
    email: string
    name: string
}
```

2. Job
```
IJobModel{
    _id: string
    name: string
    description: string
    rawInputDirectory: string
    stagingFileName: string
    userId: string
    generateESIndices: boolean
    jobStatus: double
}
```

3. Plot
```
IPlotModel{
    _id: string
    jobId: string
    identifier: string
    identifierType: string
    xAxis: string
    xType: string
    yAxis: string
    yType: string
}
```

4. Aggregation
```
IAggregationModel {
    _id: string
    operations: [string]
    featureColumns: [string]
    jobId: string
    metricColumn: string
    name: string
    sortColumnName: string
}
```

5. Cluster
```
IClusterModel{
    _id: string
    aggId: string
    aggName: string
    identifier: string
    identifierType: string
    xAxis: string
    xType: string
    yAxis: string
    yType: string
}
```

6. Filter
```
IFilterModel{
    _id: string
    aggId: string
    aggName: string
    query: string
}
```