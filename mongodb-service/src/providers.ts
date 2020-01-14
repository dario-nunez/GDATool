import { S3BucketService } from "../../common-service/src/s3/s3BucketService"
import { ConfigurationOptions } from "aws-sdk/lib/config";
import { AWSConfig } from "../src/AWSConfig";
import { S3BucketServiceProxy } from "../src/s3/s3BucketServiceProxy";

export class Providers {

    public static getS3BucketServiceProxy(): S3BucketServiceProxy {
        const s3 = S3BucketService.createS3Client({
            region: process.env.AWS_REGION || "eu-west-2",
            accessKeyId: AWSConfig.awsAccessKeyId,
            secretAccessKey: AWSConfig.awsSecretAccessKey
        } as ConfigurationOptions);
        return new S3BucketServiceProxy(s3);
    }
}