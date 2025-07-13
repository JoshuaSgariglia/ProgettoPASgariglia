import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginPayload } from "../utils/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";

export class AuthController {
  constructor(private authService: AuthService) { }

  public async loginUser(req: Request, res: Response): Promise<void> {
    const authToken: string = await this.authService.login(res.locals.validated as LoginPayload);

    SuccessResponseFactory.getResponse(SuccessType.AccountLoggedIn, { authToken: authToken }).send(res)
  };
}