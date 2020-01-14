import { S3BucketService } from "../../../common-service/src/s3/s3BucketService";
import { Provided, Provider } from "typescript-ioc";
import { Providers } from "../providers";

const s3BucketServiceProxyProvider: Provider = {
    get: () =>  Providers.getS3BucketServiceProxy()
};

@Provided(s3BucketServiceProxyProvider)
export class S3BucketServiceProxy extends S3BucketService {
}
