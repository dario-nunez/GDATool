import { IUser, IUserModel } from "../../../common-service/src/models/userModel";
import { UserRepository } from "../../../common-service/src/repositories/userRepository";
import { Controller } from "../../../common-service/src/controllers/controller";
import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { Context, DELETE, Errors, GET, Path, PathParam, POST, PreProcessor, PUT, ServiceContext } from "typescript-rest";
import { uniqueUsernameValidator } from "../validators/validators";

@Path("/ms/user")
export class UserController extends Controller<IUser> {

    @Context
    public context: ServiceContext;

    constructor(@Inject private userRepository: UserRepository) {
        super(userRepository);
    }

    @Path("/authenticate")
    @POST
    public async authenticateUser(userAndPass: any): Promise<boolean> {
        try {
            return await this.userRepository.authenticateUser(userAndPass.username, userAndPass.password);
        } catch (error) {
            logger.error(error.message);
            throw new Errors.InternalServerError(error.message);
        }
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
    @PreProcessor(uniqueUsernameValidator)
    public async createUser(user: IUserModel): Promise<IUserModel> {
        logger.info(this.context.request.body);
        const userModel: IUser = user as any;
        if (!userModel.username) {
            userModel.username = userModel.email;
        }
        userModel.password = userModel.password;
        return await this.userRepository.create(userModel);
    }

    @Path(":id")
    @PUT
    public async updateUser(@PathParam("id") id: string, user: IUserModel): Promise<IUserModel> {
        return await this.userRepository.update(id, user);
    }

    @Path(":id")
    @DELETE
    public async deleteUser(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.delete(id);
    }
}
