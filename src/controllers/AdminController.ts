import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";
import { CalendarCreationPayload, CalendarUpdatePayload, RequestApprovalPayload, UserPayload, UserRechargePayload } from "../utils/validation/schemas";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { RequestStatus, SuccessType } from "../utils/enums";

/**
 * Controller for actions protected with authentication and Admin role authorization.
 * Requires an AdminService object passed through dependency injection.
 * Uses SuccessResponseFactory class to generate and send JSON reponses.
 * Used exclusively by "adminRoutes.ts" file.
*/
export class AdminController {
	// Constructor with AdminService instance
	constructor(private adminService: AdminService) { }

	/**
	 * Action that allows to create a user.
	 * Expects a validated UserPayload object to be present in "res.locals.validated".
	 * If successful, returns the newly created user.
	*/
	public readonly createUser = async (req: Request, res: Response): Promise<void> => {
		const user = await this.adminService.createUser(res.locals.validated as UserPayload);

		SuccessResponseFactory.getResponse(SuccessType.AccountRegistered, { user: user.toJSON() }).sendIn(res);
	};

	/**
	 * Action that allows to create a calendar.
	 * Expects a validated CalendarCreationPayload object to be present in "res.locals.validated".
	 * If successful, returns the newly created calendar.
	*/
	public readonly createCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.createCalendar(res.locals.validated as CalendarCreationPayload);

		SuccessResponseFactory.getResponse(SuccessType.CalendarCreated, { calendar: calendar.toJSON() }).sendIn(res);
	};

	/**
	 * Action that allows to update a calendar.
	 * Expects the calendar UUID to be present in "req.params.id".
	 * Expects a validated CalendarUpdatePayload object to be present in "res.locals.validated".
	 * If successful, returns the updated calendar.
	*/
	public readonly updateCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.updateCalendar(req.params.id.toString(), res.locals.validated as CalendarUpdatePayload);

		SuccessResponseFactory.getResponse(SuccessType.CalendarUpdated, { calendar: calendar.toJSON() }).sendIn(res);
	};


	/**
	 * Action that allows to get a calendar.
	 * Expects the calendar UUID to be present in "req.params.id".
	 * If successful, returns the calendar.
	*/
	public readonly getCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.getCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarRetrieved, { calendar: calendar.toJSON() }).sendIn(res);
	};

	/**
	 * Action that allows to delete a calendar.
	 * Expects the calendar UUID to be present in "req.params.id".
	 * If successful, returns the deleted calendar.
	*/
	public readonly deleteCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.deleteCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarDeleted, { calendar: calendar.toJSON() }).sendIn(res);
	};

	/**
	 * Action that allows to archive a calendar.
	 * Expects the calendar UUID to be present in "req.params.id".
	 * If successful, returns the archived calendar.
	*/
	public readonly archiveCalendar = async (req: Request, res: Response): Promise<void> => {
		const calendar = await this.adminService.archiveCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarArchived, { calendar: calendar.toJSON() }).sendIn(res);
	};

	/**
	 * Action that allows to update the status of a request.
	 * Expects the request UUID to be present in "req.params.id".
	 * Expects a validated RequestApprovalPayload object to be present in "res.locals.validated".
	 * If successful, returns the updated request.
	*/
	public readonly updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
		const request = await this.adminService.updateRequestStatus(req.params.id.toString(), res.locals.validated as RequestApprovalPayload);
		const successType = request.status === RequestStatus.Approved ? SuccessType.SlotRequestApproved : SuccessType.SlotRequestRefused;

		SuccessResponseFactory.getResponse(successType, { request: request }).sendIn(res);
	};

	/**
	 * Action that allows to get a list of requests by calendar.
	 * Expects the calendar UUID to be present in "req.params.id".
	 * If successful, returns the list of requests associated to the calendar.
	*/
	public readonly getRequestsByCalendar = async (req: Request, res: Response): Promise<void> => {
		const requests = await this.adminService.getRequestsByCalendar(req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.CalendarRequestsRetrieved, { requests }).sendIn(res);
	}

	/**
	 * Action that allows to recharge the tokens of a user.
	 * Expects the user UUID to be present in "req.params.id".
	 * Expects a validated UserRechardPayload object to be present in "res.locals.validated".
	 * If successful, returns the old and new token amounts of the user.
	*/
	public readonly updateUserTokens = async (req: Request, res: Response): Promise<void> => {
		const userTokenUpdateInfo = await this.adminService.updateUserTokens(req.params.id.toString(), res.locals.validated as UserRechargePayload);

		SuccessResponseFactory.getResponse(SuccessType.UserTokensRecharged, userTokenUpdateInfo).sendIn(res);
	}

}