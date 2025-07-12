import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) { }

  loginUser = async (req: Request, res: Response) => {
    return await this.authService.login()
  };
}