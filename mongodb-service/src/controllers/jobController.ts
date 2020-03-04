import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";
import { IJob, IJobModel } from "../models/jobModel";
import { JobRepository } from "../repositories/jobRepository";
import { S3BucketService } from "../s3/s3BucketService";
import { UploadUrlModel } from "../s3/uploadUrlModel";
import {Controller} from "./controller";

/**
 * Job endpoints rooted at "/ms/job".
 */
@Path("/ms/job")
export class JobController extends Controller<IJob> {

    private bucketName: string;

    constructor(@Inject private jobRepository: JobRepository,
        @Inject private s3BucketService: S3BucketService) {
        super(jobRepository);
        this.bucketName = process.env.BUCKET_NAME;    
    }

    /**
     * Return all Jobs.
     */
    @Path("getAll")
    @GET
    public async getAllJobs(): Promise<Array<IJobModel>> {
        return await this.jobRepository.getAll();
    }

    /**
     * Return a Job given an id.
     * @param id
     */
    @Path(":id")
    @GET
    public async getJobById(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.getById(id);
    }

    /**
     * Store a Job without creating an AWS S3 bucket directory.
     * @param job 
     */
    @Path("noAws")
    @POST
    public async createJobWithoutAWSInitialization(job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.create(job);
    }

    /**
     * Store a Job and create an AWS S3 bucket directory.
     * @param job
     */
    @POST
    public async createJob(job: IJobModel): Promise<IJobModel> {
        const newJob: IJobModel = await this.jobRepository.create(job);
        newJob.rawInputDirectory = `${newJob.userId}/${newJob._id}/raw`;
        newJob.stagingFileName = `${newJob.userId}/${newJob._id}/staging`;
        
        await this.s3BucketService.createFolder(this.bucketName, newJob.rawInputDirectory + "/schema.json");
        await this.s3BucketService.createFolder(this.bucketName, newJob.stagingFileName + "/foo");
        
        return this.updateJob(newJob._id, newJob);
    }

    /**
     * Update a Job given an original id and the new Job object.
     * @param id 
     * @param job 
     */
    @Path(":id")
    @PUT
    public async updateJob(@PathParam("id") id: string, job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.update(id, job);
    }

    /**
     * Delete a Job by id.
     * @param id
     */
    @Path(":id")
    @DELETE
    public async deleteJob(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.delete(id);
    }

    /**
     * Delete a Job by id recursively. All entities bellow Job in the hierarchial structure are
     * also recursively deleted.
     * @param id 
     */
    @Path("recursive/:id")
    @DELETE
    public async deleteJobRecursive(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.deleteRecursive(id);
    }

    /**
     * Return a user linked to a given User id.
     * @param id 
     */
    @Path("byUser/:id")
    @GET
    public async getJobsByUser(@PathParam("id") id: string): Promise<Array<IJobModel>> {
        return await this.jobRepository.getjobsByUserId(id);
    }

    /**
     * Get an S3 upload URL given an UploadUrlModel. This URL is used get authorized access S3
     * for a period of time. Default is 30 minutes.
     * @param uploadUrlModel 
     */
    @Path("getUploadFileUrl")
    @POST
    public async getUploadFileUrl(uploadUrlModel: UploadUrlModel): Promise<string> {
        const job: IJob = await this.jobRepository.getById(uploadUrlModel.jobId);
        const filePath = `${job.rawInputDirectory}/${uploadUrlModel.fileName}`;
        return this.s3BucketService.getSignedUrlValidFor30minutes(process.env.BUCKET_NAME, filePath);
    }

    /**
     * Return the contents of the schema.json file in the Job's directory in S3.
     * @param job 
     */
    @Path("readFile")
    @POST
    public async readFile(job: IJobModel) {
        const filePath = `${job.userId}/${job._id}/raw/schema.json`;
        const res = await this.s3BucketService.readFile(process.env.BUCKET_NAME, filePath);
        return res.Body.toString();
    }
}
