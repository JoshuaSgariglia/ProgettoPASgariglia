import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CheckSlotPayload, RequestStatusAndCreationPayload, RequestStatusAndPeriodPayload, SlotRequestPayload } from "../utils/validation/schemas";
import { RequestStatus, SuccessType } from "../utils/enums";
import { SuccessResponseFactory } from "../utils/factories/successFactory";

/**
 * Controller for actions protected with authentication and User role authorization.
 * Requires a UserService object passed through dependency injection.
 * Uses SuccessResponseFactory class to generate and send JSON reponses.
 * Used exclusively by "userRoutes.ts" file.
*/
export class UserController {
	// Constructor with UserService instance
	constructor(private userService: UserService) { }

	/**
	 * Action that allows to create a slot request for a calendar.
	 * Expects the authenticated user UUID to be present in "req.locals.tokenPayload.id".
	 * Expects a validated SlotRequestPayload object to be present in "res.locals.validated".
	 * If successful, returns the newly created slot request and information on spent and remaining tokens.
	*/
	public readonly createSlotRequest = async (req: Request, res: Response): Promise<void> => {
		const { request, ...requestInfo } = await this.userService.createSlotRequest(res.locals.tokenPayload.uuid, res.locals.validated as SlotRequestPayload);
		const successType = request.status === RequestStatus.Pending ? SuccessType.SlotRequestCreated : SuccessType.InvalidSlotRequestCreated;

		SuccessResponseFactory.getResponse(successType, { "request": request.toJSON(), ...requestInfo }).sendIn(res);
	}

	/**
	 * Action that allows to get a list of information about slot requests status created by the user, 
	 * filtered by status and creation datetime.
	 * Expects the authenticated user UUID to be present in "res.locals.tokenPayload.id".
	 * Expects a validated RequestStatusAndCreationPayload object to be present in "res.locals.validated".
	 * If successful, returns the filtered list of information about slot requests status.
	*/
	public readonly getRequestsByStatusAndCreation = async (req: Request, res: Response): Promise<void> => {
		const requestsStatusInfo = await this.userService.getRequestsByStatusAndCreation(res.locals.tokenPayload.uuid, res.locals.validated as RequestStatusAndCreationPayload);

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestsRetrieved, { "requests": requestsStatusInfo }).sendIn(res);
	}

	/**
	 * Action that allows to delete a slot request created by the user.
	 * Expects the authenticated user UUID to be present in "res.locals.tokenPayload.id".
	 * Expects the request UUID to be present in "req.params.id".
	 * If successful, returns the deleted slot request.
	*/
	public readonly deleteSlotRequest = async (req: Request, res: Response): Promise<void> => {
		const requestDeletionInfo = await this.userService.deleteSlotRequest(res.locals.tokenPayload.uuid, req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestDeleted, requestDeletionInfo).sendIn(res);
	}

	/**
	 * Action that allows to check if a certain slot is available on a calendar.
	 * Expects a validated CalendarSlotPayload object to be present in "res.locals.validated".
	 * If successful, returns information on the availability of the slot.
	*/
	public readonly checkCalendarSlot = async (req: Request, res: Response): Promise<void> => {
		const calendarSlotInfo = await this.userService.checkCalendarSlot(res.locals.validated as CheckSlotPayload);
		const successType = calendarSlotInfo.available ? SuccessType.CalendarSlotAvailable : SuccessType.CalendarSlotUnavailable;

		SuccessResponseFactory.getResponse(successType, calendarSlotInfo).sendIn(res);
	}

	/**
	 * Action that allows to get a list of slot requests created by the user, filtered by calendar, status and slot period.
	 * Expects the authenticated user UUID to be present in "res.locals.tokenPayload.id".
	 * Expects a validated RequestStatusAndPeriodPayload object to be present in "res.locals.validated".
	 * If successful, returns the list of filtered slot requests.
	*/
	public readonly getRequestsByStatusAndPeriod = async (req: Request, res: Response): Promise<void> => {
		const requests = await this.userService.getRequestsByStatusAndPeriod(res.locals.tokenPayload.uuid, res.locals.validated as RequestStatusAndPeriodPayload);

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestsRetrieved, { "requests": requests }).sendIn(res);
	}

}
