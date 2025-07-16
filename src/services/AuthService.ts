import { compare } from "bcrypt-ts";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { PRIVATE_KEY, SIGNING_ALGORITHM, TOKEN_DURATION } from "../utils/config";
import { ErrorType } from "../utils/enums";
import { LoginPayload } from "../utils/validation/schemas";
import jwt from 'jsonwebtoken';

/**
 * Service with business logic, orchestrator between controller and repositories.
 * Requires a UserRepository instance, passed through dependency injection.
 * Throws ErrorType instances in case of domain-specific errors.
 * Used exclusively by AuthController.
*/
export class AuthService {
    constructor(private userRepository: UserRepository) { }

    /**
	 * Allows a user to login. 
     * Uses a LoginPayload instance with the credentials needed to log in.
	 * If successful, returns a generated JWT.
	*/
    public async login(loginPayload: LoginPayload): Promise<string> {
        // Get user by username
        const user: User | null = await this.userRepository.getByUsername(loginPayload.username)

        // Check username and password
        if (user === null || !await compare(loginPayload.password, user.password))
            throw ErrorType.InvalidLoginCredentials;

        // Generate and return JWT
        return jwt.sign({ uuid: user.uuid, role: user.role }, PRIVATE_KEY,
            { algorithm: SIGNING_ALGORITHM, expiresIn: TOKEN_DURATION });
    }
}