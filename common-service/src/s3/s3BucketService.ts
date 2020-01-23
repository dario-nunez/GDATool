import { S3 } from "aws-sdk";
import * as aws from "aws-sdk";
import { ConfigurationOptions } from "aws-sdk/lib/config";
import { ReadStream } from "fs";
import logger from "../logger/loggerFactory";

export class S3BucketService {

    public static createS3Client(awsConfig: ConfigurationOptions): aws.S3 {
        aws.config.update(awsConfig);
        return new aws.S3({
            signatureVersion: "v4",
            apiVersion: '2006-03-01'
        });
    }

    public static listBuckets(s3: S3): Promise<any> {
        return s3.listBuckets().promise();
    }

    public static listObjects(s3: S3, bucket: string): Promise<any> {
        const params: S3.Types.ListObjectsV2Request = {
            Bucket: bucket
        };
        return s3.listObjectsV2(params, (err, data) => {
            if (err) {
                logger.error(err);
            }
        }).promise();
    }

    public static upload(s3: S3, fileStream: ReadStream, bucket: string, key: string): Promise<any> {
        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: bucket,
            Key: key,
            Body: fileStream
        };
        logger.info(`Uploading: bucket: ${bucket}, key: ${key}`);
        return s3.upload(uploadParams, (err, data) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(data);
            }
        }).promise();
    }

    public static createFolder(s3: S3, bucket: string, key: string): Promise<any> {
        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: bucket,
            Key: key,
            Body: ""
        };
        logger.info(`Uploading: bucket: ${bucket}, key: ${key}`);
        return s3.upload(uploadParams, (err, data) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(data);
            }
        }).promise();
    }

    constructor(protected s3: S3 | null) {
        if (!s3) {
            this.s3 = S3BucketService.createS3Client({
                region: process.env.AWS_REGION || "eu-west-2",
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            } as ConfigurationOptions
            );
        }
    }

    public listBuckets(): Promise<any> {
        return S3BucketService.listBuckets(this.s3);
    }

    public listObjects(bucket: string): Promise<any> {
        return S3BucketService.listObjects(this.s3, bucket);
    }

    public upload(fileStream: ReadStream, bucket: string, key: string): Promise<any> {
        return S3BucketService.upload(this.s3, fileStream, bucket, key);
    }

    public createFolder(bucket: string, key: string): Promise<any> {
        return S3BucketService.createFolder(this.s3, bucket, key);
    }

    public getSignedUrl(bucket: string, key: string, signedUrlExpireSeconds: number): Promise<string> {
        return this.s3.getSignedUrlPromise("putObject", {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        });
    }

    public getSignedUrlValidFor30minutes(bucket: string, key: string): Promise<string> {
        const signedUrlExpireSeconds = 60 * 30;
        return this.s3.getSignedUrlPromise("putObject", {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        });
    }
}
