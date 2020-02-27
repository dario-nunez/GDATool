import { Provided, Provider } from "typescript-ioc";
import { Providers } from "../providers";
import { S3BucketService } from "./s3BucketService";

const s3BucketServiceProxyProvider: Provider = {
    get: () =>  Providers.getS3BucketServiceProxy()
};

@Provided(s3BucketServiceProxyProvider)
export class S3BucketServiceProxy extends S3BucketService {

    public getSignedUrlValidFor30minutes(bucket: string, key: string): Promise<string> {
        const signedUrlExpireSeconds = 60 * 30;
        return this.s3.getSignedUrlPromise("putObject", {
            Bucket: bucket,
            Key: key,
            Expires: signedUrlExpireSeconds
        });
    }
}
