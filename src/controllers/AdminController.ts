import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { UserPayload } from "../utils/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";

export class AdminController {
      constructor(private adminService: AdminService) { }

      public async createUser(req: Request, res: Response): Promise<void> {
            const user = await this.adminService.createUser(res.locals.validated as UserPayload);

            SuccessResponseFactory.getResponse(SuccessType.AccountRegistered, { user: user }).send(res)
      };

}