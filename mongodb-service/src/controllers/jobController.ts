import { IJob, IJobModel } from "../../../common-service/src/models/jobModel";
import {Controller} from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";
import { JobRepository } from "../../../common-service/src/repositories/jobRepository";

@Path("/ms/job")
export class JobController extends Controller<IJob> {

    constructor(@Inject private jobRepository: JobRepository) {
        super(jobRepository);
    }

    @Path("getAll")
    @GET
    public async getAllJobs(): Promise<Array<IJobModel>> {
        return await this.jobRepository.getAll();
    }

    @Path(":id")
    @GET
    public async getJobById(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.getById(id);
    }

    @POST
    public async createJob(job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.create(job);
    }

    @Path(":id")
    @PUT
    public async updateJob(@PathParam("id") id: string, job: IJobModel): Promise<IJobModel> {
        return await this.jobRepository.update(id, job);
    }

    @Path(":id")
    @DELETE
    public async deleteJob(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.delete(id);
    }

    @Path("recursive/:id")
    @DELETE
    public async deleteJobRecursive(@PathParam("id") id: string): Promise<IJobModel> {
        return await this.jobRepository.deleteRecursive(id);
    }

    @Path("byUser/:id")
    @GET
    public async getJobsByUser(@PathParam("id") id: string): Promise<Array<IJobModel>> {
        return await this.jobRepository.getjobsByUserId(id);
    }
}
