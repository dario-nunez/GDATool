import User, { IUser } from "../models/userModel";
import { Repository } from "./repository";

export class UserRepository extends Repository<IUser> {
    constructor() {
        super(User);
    }
}
