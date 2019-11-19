import { IUser, IUserModel } from "../../../common-service/src/models/userModel";
import { UserRepository } from "../../../common-service/src/repositories/userRepository";
import { Controller } from "../../../common-service/src/controllers/controller";
import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { Context, DELETE, Errors, GET, Path, PathParam, POST, PUT, ServiceContext, PreProcessor } from "typescript-rest";
import { uniqueEmailValidator } from "../validators/validators";

@Path("/ms/user")
export class UserController extends Controller<IUser> {

    @Context
    public context: ServiceContext;

    constructor(@Inject private userRepository: UserRepository) {
        super(userRepository);
    }

    @Path("/authenticate")
    @POST
    public async authenticateUser(userAndPass: any): Promise<any> {
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
        try {
            return await this.userRepository.getAll();
        } catch (error) {
            logger.error(error.message);
            throw new Errors.InternalServerError(error.message);
        }
    }

    @Path(":id")
    @GET
    public async getUserById(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.getById(id);
    }

    @POST
    @PreProcessor(uniqueEmailValidator)
    public async createUser(user: IUserModel): Promise<IUserModel> {
        logger.info("User at mongodb-service");
        logger.info(this.context.request.body);
        const userModel: IUser = user as any;

        return await this.userRepository.create(userModel);
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
}
