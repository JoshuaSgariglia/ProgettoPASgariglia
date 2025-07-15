import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CheckSlotPayload, RequestStatusAndCreationPayload, RequestStatusAndPeriodPayload, SlotRequestPayload } from "../utils/schemas";
import { RequestStatus, SuccessType } from "../utils/enums";
import { SuccessResponseFactory } from "../utils/factories/successFactory";

export class UserController {
	constructor(private userService: UserService) { }

	public readonly createSlotRequest = async (req: Request, res: Response): Promise<void> => {
		const {request, ...requestInfo} = await this.userService.createSlotRequest(res.locals.tokenPayload.uuid, res.locals.validated as SlotRequestPayload);
		const successType = request.status === RequestStatus.Pending ? SuccessType.SlotRequestCreated : SuccessType.InvalidSlotRequestCreated;

		SuccessResponseFactory.getResponse(successType, { "request": request.toJSON(), ...requestInfo }).sendIn(res);
	}

	public readonly getRequestsByStatusAndCreation = async (req: Request, res: Response): Promise<void> => {
		const requests = await this.userService.getRequestsByStatusAndCreation(res.locals.tokenPayload.uuid, res.locals.validated as RequestStatusAndCreationPayload);

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestsRetrieved, { "requests": requests }).sendIn(res);
	}

	public readonly deleteSlotRequest = async (req: Request, res: Response): Promise<void> => {
		const requestDeletionInfo = await this.userService.deleteSlotRequest(res.locals.tokenPayload.uuid, req.params.id.toString());

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestDeleted, requestDeletionInfo).sendIn(res);
	}

	public readonly checkCalendarSlot = async (req: Request, res: Response): Promise<void> => {
		const calendarSlotInfo = await this.userService.checkCalendarSlot(res.locals.validated as CheckSlotPayload);
		const successType = calendarSlotInfo.available ? SuccessType.CalendarSlotAvailable : SuccessType.CalendarSlotUnavailable;

		SuccessResponseFactory.getResponse(successType, calendarSlotInfo).sendIn(res);
	}

	public readonly getRequestsByStatusAndPeriod = async (req: Request, res: Response): Promise<void> => {
		const requests = await this.userService.getRequestsByStatusAndPeriod(res.locals.tokenPayload.uuid, res.locals.validated as RequestStatusAndPeriodPayload);

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestsRetrieved, { "requests": requests }).sendIn(res);
	}

}
