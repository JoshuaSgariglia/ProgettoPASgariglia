import { InferAttributes } from "sequelize";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { UserPayload } from "../utils/schemas";
import { genSalt, hash } from "bcrypt-ts";
import { ErrorType } from "../utils/enums";
import { SALT_ROUNDS } from "../utils/config";

export class AdminService {
    constructor(private userRepository: UserRepository) { }

    public async createUser(userPayload: UserPayload): Promise<Omit<InferAttributes<User>, "password">> {
        const user: User | null = await this.userRepository.getByUsernameOrEmail(userPayload.username, userPayload.email);

        // User does not exist
        if (user === null) {
            // Generate salt
            const salt = await genSalt(SALT_ROUNDS);

            console.log("Generated salt")

            // Hash and salt password
            userPayload.password = await hash(userPayload.password, salt);

            console.log("Hashed password")

            // Create new User
            return await this.userRepository.add(userPayload);

        // User already exists
        } else if (user.username === userPayload.username) {
            throw ErrorType.UsernameAlreadyInUse;

        } else {
            throw ErrorType.EmailAlreadyInUse;
        }
    }
}