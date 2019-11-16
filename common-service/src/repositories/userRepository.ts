import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }

    public getByUsername(username: string): Promise<any> {
        return User.findOne({username: username}, (err, obj) => {}).lean().exec();
    }
}
