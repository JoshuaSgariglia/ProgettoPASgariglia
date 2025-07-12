import { UserRepository } from "../repositories/UserRepository";

export class AdminService {
    constructor(private userRepository: UserRepository) {}
}