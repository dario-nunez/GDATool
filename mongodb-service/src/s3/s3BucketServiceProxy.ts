import { Provided, Provider } from "typescript-ioc";
import { S3BucketService } from "../../../common-service/src/s3/s3BucketService";
import { Providers } from "../providers";

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
