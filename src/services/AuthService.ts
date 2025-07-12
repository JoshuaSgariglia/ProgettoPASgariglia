import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { PRIVATE_KEY, SIGNING_ALGORITHM, TOKEN_DURATION } from "../utils/config";
import { ErrorType } from "../utils/enums";
import { LoginPayload } from "../utils/schemas";
import jwt from 'jsonwebtoken';


export class AuthService {
    constructor(private userRepository: UserRepository) {}

    public async login(loginPayload: LoginPayload): Promise<string> {
        const user: User | null = await this.userRepository.getByUsername(loginPayload.username)
        
        if (user === null || user.password !== loginPayload.password)
            throw ErrorType.InvalidLoginCredentials;

        return jwt.sign({ uuid: user.uuid, role: user.role }, PRIVATE_KEY,
            { algorithm: SIGNING_ALGORITHM, expiresIn: TOKEN_DURATION });
    }
}