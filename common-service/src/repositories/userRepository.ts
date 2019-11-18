import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public async authenticateUser(username: string, password: string): Promise<boolean> {
        const user: IUser = await User.findOne({username: username}, (err, obj) => {}).lean().exec();

        if (user != null && user.password === password) {
            return true;
        }

        return false;
    }
}
