import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginPayload } from "../utils/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";

/*
 * Controller for unprotected actions (no authentication required).
 * Requires an AuthService object passed through dependency injection.
 * Uses SuccessResponseFactory class to generate and send JSON reponses.
 * Used exclusively by "publicRoutes.ts" file.
*/
export class AuthController {
	// Constructor with AuthService instance
  constructor(private authService: AuthService) { }

  /*
	 * Action that allows a user to login.
	 * Expects a validated LoginPayload object to be present in "res.locals.validated".
	 * If successful, returns the newly created JWT.
	*/
  public readonly loginUser = async (req: Request, res: Response): Promise<void> => {
    const authToken: string = await this.authService.login(res.locals.validated as LoginPayload);

    SuccessResponseFactory.getResponse(SuccessType.AccountLoggedIn, { authToken: authToken }).sendIn(res)
  };
}