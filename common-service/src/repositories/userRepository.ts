import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public async authenticateUser(email: string, password: string): Promise<any> {
        const user: IUser = await User.findOne({email: email}).lean().exec();

        if (user != null && user.password === password) {
            return {
                id: user._id,
                email: user.email
            };
        }

        return {
            id: null,
            email: null
        };
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return User.findOne({email: email}).lean().exec();
    }
}
