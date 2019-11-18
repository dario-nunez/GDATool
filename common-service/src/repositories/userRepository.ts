import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public async authenticateUser(username: string, password: string): Promise<any> {
        const user: IUser = await User.findOne({username: username}, (err, obj) => {}).lean().exec();

        if (user != null && user.password === password) {
            return {
                id: user._id,
                username: user.email
            };
        }

        return {
            id: null,
            username: null
        };
    }

    public async getUserByUsername(username: string): Promise<IUser> {
        return User.findOne({username: username}, (err, obj) => {}).lean().exec();
    }
}
