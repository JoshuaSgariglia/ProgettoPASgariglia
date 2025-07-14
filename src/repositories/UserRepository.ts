import { InferAttributes, InferCreationAttributes, Op } from "sequelize";
import { User } from "../models/User";
import { UserPayload } from "../utils/schemas";

export class UserRepository {

    public async list(): Promise<User[]> {
        return await User.findAll()
    }

    public async getByUsername(username: string): Promise<User | null> {
        return await User.findOne({ where: { "username": username } })
    }

    public async getByUsernameOrEmail(username: string, email: string): Promise<User | null> {
        return await User.findOne({
            where: {
                [Op.or]: [
                    { "username": username },
                    { "email": email }
                ]
            }
        });
    }

    public async add(userPayload: UserPayload): Promise<User> {
        return await User.create(userPayload);
    }

}
