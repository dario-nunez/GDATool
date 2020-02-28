import { Inject } from "typescript-ioc";
import { Context, DELETE, Errors, GET, Path, PathParam, POST, PreProcessor, PUT, ServiceContext } from "typescript-rest";
import logger from "../logger/loggerFactory";
import { IUser, IUserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { uniqueEmailValidator } from "../validators/validators";
import { Controller } from "./controller";

@Path("/ms/user")
export class UserController extends Controller<IUser> {

    @Context
    public context: ServiceContext;

    constructor(@Inject private userRepository: UserRepository) {
        super(userRepository);
    }

    @Path("/authenticate")
    @POST
    public async authenticateUser(userAndPass: any): Promise<IUserModel> {
        try {
            return await this.userRepository.authenticateUser(userAndPass.email, userAndPass.password);
        } catch (error) {
            logger.error(error.message);
            throw new Errors.InternalServerError(error.message);
        }
    }

    @Path("/byEmail/:email")
    @GET
    public async getUserByEmail(@PathParam("email") email: string): Promise<IUserModel> {
        return await this.userRepository.getUserByEmail(email);
    }

    @Path("/getAll")
    @GET
    public async getAll(): Promise<Array<IUserModel>> {
        return await this.userRepository.getAll();
    }

    @Path(":id")
    @GET
    public async getUserById(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.getById(id);
    }

    @POST
    @PreProcessor(uniqueEmailValidator)
    public async createUser(user: IUserModel): Promise<IUserModel> {
        return await this.userRepository.create(user);
    }

    @Path(":id")
    @PUT
    @PreProcessor(uniqueEmailValidator)
    public async updateUser(@PathParam("id") id: string, user: IUserModel): Promise<IUserModel> {
        return await this.userRepository.update(id, user);
    }

    @Path(":id")
    @DELETE
    public async deleteUser(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.delete(id);
    }

    @Path("/recursive/:id")
    @DELETE
    public async deleteUserRecursive(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.deleteRecursive(id);
    }
}
