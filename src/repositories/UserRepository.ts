import { InferAttributes, InferCreationAttributes, Op } from "sequelize";
import { User } from "../models/User";
import { UserPayload } from "../utils/schemas";

/*
 * Repository class for the User model.
 * Provides higher-level methods to interact with the User model.
 */
export class UserRepository {

    // Returns a list of all users in the database
    public async list(): Promise<User[]> {
        return await User.findAll();
    }

    // Retrieves a user by their UUID
    public async getById(user_id: string): Promise<User | null> {
        return await User.findByPk(user_id);
    }

    // Retrieves a user by their username
    public async getByUsername(username: string): Promise<User | null> {
        return await User.findOne({ where: { "username": username } });
    }

    // Retrieves a user by either their username or email
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

    // Creates and saves a new user in the database
    public async add(userPayload: UserPayload): Promise<User> {
        return await User.create(userPayload);
    }

}
