import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { CalendarCreationPayload, CalendarUpdatePayload, UserPayload } from "../utils/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";

export class AdminController {
      constructor(private adminService: AdminService) { }

      public async createUser(req: Request, res: Response): Promise<void> {
            const user = await this.adminService.createUser(res.locals.validated as UserPayload);

            SuccessResponseFactory.getResponse(SuccessType.AccountRegistered, { user: user.toJSON() }).send(res);
      };

      public async createCalendar(req: Request, res: Response): Promise<void> {
            const calendar = await this.adminService.createCalendar(res.locals.validated as CalendarCreationPayload);

            SuccessResponseFactory.getResponse(SuccessType.CalendarCreated, { calendar: calendar.toJSON() }).send(res);
      };

      public async updateCalendar(req: Request, res: Response): Promise<void> {
            const calendar = await this.adminService.updateCalendar(req.params.id.toString(), res.locals.validated as CalendarUpdatePayload);

            SuccessResponseFactory.getResponse(SuccessType.CalendarUpdated, { calendar: calendar.toJSON() }).send(res);
      };

      public async getCalendar(req: Request, res: Response): Promise<void> {
            const calendar = await this.adminService.getCalendar(req.params.id.toString());

            SuccessResponseFactory.getResponse(SuccessType.CalendarRetreived, { calendar: calendar.toJSON() }).send(res);
      };

      public async deleteCalendar(req: Request, res: Response): Promise<void> {
            const calendar = await this.adminService.deleteCalendar(req.params.id.toString());

            SuccessResponseFactory.getResponse(SuccessType.CalendarDeleted, { calendar: calendar.toJSON() }).send(res);
      };

      public async archiveCalendar(req: Request, res: Response): Promise<void> {
            const calendar = await this.adminService.archiveCalendar(req.params.id.toString());

            SuccessResponseFactory.getResponse(SuccessType.CalendarArchived, { calendar: calendar.toJSON() }).send(res);
      };

}