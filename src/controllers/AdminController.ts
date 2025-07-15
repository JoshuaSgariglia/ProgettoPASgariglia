import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { CalendarCreationPayload, CalendarUpdatePayload, UserPayload } from "../utils/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { SuccessType } from "../utils/enums";

export class AdminController {
	constructor(private adminService: AdminService) { }

	public readonly createUser = async (req: Request, res: Response): Promise<void> => {
		const user = await this.adminService.createUser(res.locals.validated as UserPayload);

		SuccessResponseFactory.getResponse(SuccessType.AccountRegistered, { user: user.toJSON() }).sendIn(res);
	};

	public readonly createCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.createCalendar(res.locals.validated as CalendarCreationPayload);

		SuccessResponseFactory.getResponse(SuccessType.CalendarCreated, { calendar: calendar.toJSON() }).sendIn(res);
	};

	public readonly updateCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.updateCalendar(req.params.id.toString(), res.locals.validated as CalendarUpdatePayload);

		SuccessResponseFactory.getResponse(SuccessType.CalendarUpdated, { calendar: calendar.toJSON() }).sendIn(res);
	};

	public readonly getCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.getCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarRetrieved, { calendar: calendar.toJSON() }).sendIn(res);
	};

	public readonly deleteCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.deleteCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarDeleted, { calendar: calendar.toJSON() }).sendIn(res);
	};

	public readonly archiveCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.archiveCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarArchived, { calendar: calendar.toJSON() }).sendIn(res);
	};

}