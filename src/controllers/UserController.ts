import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { RequestStatusAndCreationPayload, SlotRequestPayload } from "../utils/schemas";
import { RequestStatus, SuccessType } from "../utils/enums";
import { SuccessResponseFactory } from "../utils/factories/successFactory";
import { success } from "zod";

export class UserController {
	constructor(private userService: UserService) { }

	public readonly createSlotRequest = async (req: Request, res: Response): Promise<void> => {
		const {request, ...requestInfo} = await this.userService.createSlotRequest(res.locals.tokenPayload.uuid, res.locals.validated as SlotRequestPayload);
		const successType = request.status === RequestStatus.Pending ? SuccessType.SlotRequestCreated : SuccessType.InvalidSlotRequestCreated;

		SuccessResponseFactory.getResponse(successType, { "request": request.toJSON(), ...requestInfo }).sendIn(res);
	}

	public readonly getRequestsByStatusAndCreationPeriod = async (req: Request, res: Response): Promise<void> => {
		const requests = await this.userService.getRequestsByStatusAndCreationPeriod(res.locals.tokenPayload.uuid, res.locals.validated as RequestStatusAndCreationPayload);

		SuccessResponseFactory.getResponse(SuccessType.SlotRequestsRetrieved, { "requests": requests }).sendIn(res);
	}

}
