import { Transaction } from "sequelize";
import { Calendar } from "../models/Calendar";
import { SlotRequest } from "../models/SlotRequest";
import { User } from "../models/User";
import { CalendarRepository } from "../repositories/CalendarRepository";
import { SlotRequestRepository } from "../repositories/SlotRequestRepository";
import { UserRepository } from "../repositories/UserRepository";
import { withTransaction } from "../utils/connector/transactionDecorator";
import { ErrorType, RequestStatus } from "../utils/enums";
import { SlotRequestCreationData, SlotRequestPayload } from "../utils/schemas";
import { hoursDiff, SlotRequestCreationInfo } from "../utils/misc";

export class UserService {
	constructor(
		private userRepository: UserRepository,
		private calendarRepository: CalendarRepository,
		private slotRequestRepository: SlotRequestRepository
	) { }

	public async createSlotRequest(user_id: string, slotRequestPayload: SlotRequestPayload): Promise<SlotRequestCreationInfo> {
		// Throws error if calendar does not exist or if it is archived
		const calendar: Calendar = await this.getCalendarIfExistsAndNotArchived(slotRequestPayload.calendar);

		// Get intersecting requests
		const requests: SlotRequest[] = await this.slotRequestRepository.getPeriodIntersectingRequests(
			slotRequestPayload.calendar,
			RequestStatus.Approved,
			slotRequestPayload.datetimeStart,
			slotRequestPayload.datetimeEnd
		);

		// Check that there are no approved intersecting requests
		if (requests.length !== 0)
			throw ErrorType.CalendarSlotUnavailable;

		// Calculate cost
		const requestCost: number = hoursDiff(
			slotRequestPayload.datetimeStart, slotRequestPayload.datetimeEnd) * calendar.tokenCostPerHour;
		
		// Get user
		const user: User | null = await this.userRepository.getById(user_id);

		let slotRequest: SlotRequest;

		if (user!.tokenAmount > requestCost) {
			slotRequest = await withTransaction(async (transaction: Transaction) => {
				// Initialize SlotRequest creation data
				const slotRequestCreationData: SlotRequestCreationData = {
					...slotRequestPayload,
					user: user!.uuid,
					status: RequestStatus.Pending,
				};

				// Create SlotRequest
				slotRequest = await this.slotRequestRepository.add(slotRequestCreationData, transaction);

				// Decrement User tokenAmount
				await user!.decrement("tokenAmount", { by: requestCost, transaction })
				await user!.reload()

				return slotRequest;
			});

		} else {
			// Initialize SlotRequest creation data
			const slotRequestCreationData: SlotRequestCreationData = {
				...slotRequestPayload,
				user: user!.uuid,
				status: RequestStatus.Invalid,
			};

			// Create SlotRequest
			slotRequest = await this.slotRequestRepository.add(slotRequestCreationData);
		}

		return { "request": slotRequest, "requestCost": requestCost, "remainingTokens": user!.tokenAmount  }
	}

	private async getCalendarIfExistsAndNotArchived(calendar_id: string): Promise<Calendar> {
		// Search calendar by id
		const calendar: Calendar | null = await this.calendarRepository.getById(calendar_id);

		// Calendar does not exist or is archived
		if (calendar === null || calendar.isArchived)
			throw ErrorType.CalendarNotFound;

		return calendar;
	}
}
