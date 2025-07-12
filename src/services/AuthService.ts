import { UserRepository } from "../repositories/UserRepository";

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    public async login(): Promise<string> {
        return "token"
    }
}