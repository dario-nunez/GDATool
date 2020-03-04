import { S3 } from "aws-sdk";
import * as aws from "aws-sdk";
import { ConfigurationOptions } from "aws-sdk/lib/config";
import logger from "../logger/loggerFactory";
import { AWSConfig } from "./AWSConfig";

/**
 * Encapsulates methods used to interact with AWS and S3 buckets.
 */
export class S3BucketService {
    private s3: S3;

    constructor() {
        this.s3 = this.createS3Client({
            region: process.env.AWS_REGION || "eu-west-2",
            accessKeyId: AWSConfig.awsAccessKeyId,
            secretAccessKey: AWSConfig.awsSecretAccessKey
        } as ConfigurationOptions);
    }

    /**
     * Creates a directory at the specified location. In S3's virtual file system, folders 
     * don't exist so a file must be stored at a directory to stop it from collapsing. The
     * key parameter addresses this.
     * @param bucket 
     * @param key: allows a file to be stored at the deepest level of the directory to preserve it.
     */
    public createFolder(bucket: string, key: string): Promise<any> {
        const uploadParams: S3.Types.PutObjectRequest = {
            Bucket: bucket,
            Key: key,
            Body: ""
        };

        logger.info(`Uploading: bucket: ${bucket}, key: ${key}`);
        return this.s3.upload(uploadParams, (err, data) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(data);
            }
        }).promise();
    }

    /**
     * Reads and returns the contents of a file in an S3 bucket.
     * @param bucket 
     * @param key 
     */
    public readFile(bucket: string, key: string): Promise<any> {
        const params = {
            Bucket: bucket,
            Key: key,
        };

        return this.s3.getObject(params, (err, data) => {
            if (err) {
                logger.error(err);
            }
        }).promise();
    }

    /**
     * Returns a signed URL that is used for authenticating when uploading files. The default
     * timeout for this token is 30 minutes.
     * @param bucket 
     * @param key 
     */
    public getSignedUrlValidFor30minutes(bucket: string, key: string): Promise<string> {
        const signedUrlExpireSeconds = 60 * 30;
        return this.s3.getSignedUrlPromise("putObject", {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        });
    }

    /**
     * Creates an S3 client given an AWS configuration object.
     * @param awsConfig 
     */
    private createS3Client(awsConfig: ConfigurationOptions): aws.S3 {
        aws.config.update(awsConfig);
        return new aws.S3({
            signatureVersion: "v4",
            apiVersion: '2006-03-01'
        });
    }
}
