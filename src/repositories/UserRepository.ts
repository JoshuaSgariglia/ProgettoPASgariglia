import { where } from "sequelize";
import { User } from "../models/User";

export class UserRepository {

    public async list(): Promise<User[]> {
        return await User.findAll()
    }

    public async getByUsername(username: string): Promise<User | null> {
        return await User.findOne({where: {"username": username}})
    }
  
}
