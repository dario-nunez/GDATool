import { Inject } from "typescript-ioc";
import { Context, DELETE, GET, Path, PathParam, POST, PreProcessor, PUT, ServiceContext } from "typescript-rest";
import { IUser, IUserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { uniqueEmailValidator } from "../validators/validators";
import { Controller } from "./controller";

/**
 * User endpoints rooted at "/ms/user".
 */
@Path("/ms/user")
export class UserController extends Controller<IUser> {

    @Context
    public context: ServiceContext;

    constructor(@Inject private userRepository: UserRepository) {
        super(userRepository);
    }

    /**
     * Authenticate a user given an email and password.
     * @param userAndPass 
     */
    @Path("/authenticate")
    @POST
    public async authenticateUser(userAndPass: any): Promise<IUserModel> {
        return await this.userRepository.authenticateUser(userAndPass.email, userAndPass.password);
    }

    /**
     * Return a User given an email.
     * @param email 
     */
    @Path("/byEmail/:email")
    @GET
    public async getUserByEmail(@PathParam("email") email: string): Promise<IUserModel> {
        return await this.userRepository.getUserByEmail(email);
    }

    /**
     * Return all Users.
     */
    @Path("/getAll")
    @GET
    public async getAll(): Promise<Array<IUserModel>> {
        return await this.userRepository.getAll();
    }

    /**
     * Return a User by id.
     * @param id 
     */
    @Path(":id")
    @GET
    public async getUserById(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.getById(id);
    }

    /**
     * Store a single User. This endpoint is subject to the "uniqueEmailValidator" pre processor.
     * @param user 
     */
    @POST
    @PreProcessor(uniqueEmailValidator)
    public async createUser(user: IUserModel): Promise<IUserModel> {
        return await this.userRepository.create(user);
    }

    /**
     * Update a User given its id and a new object. This endpoint is subject to the "uniqueEmailValidator"
     *  pre processor.
     * @param id 
     * @param user 
     */
    @Path(":id")
    @PUT
    @PreProcessor(uniqueEmailValidator)
    public async updateUser(@PathParam("id") id: string, user: IUserModel): Promise<IUserModel> {
        return await this.userRepository.update(id, user);
    }

    /**
     * Delete a User by id.
     * @param id
     */
    @Path(":id")
    @DELETE
    public async deleteUser(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.delete(id);
    }

    /**
     * Delete a User by id recursively. All entities bellow User in the hierarchial structure are
     * also recursively deleted.
     * @param id 
     */
    @Path("/recursive/:id")
    @DELETE
    public async deleteUserRecursive(@PathParam("id") id: string): Promise<IUserModel> {
        return await this.userRepository.deleteRecursive(id);
    }
}
