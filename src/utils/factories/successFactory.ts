import { SuccessType } from "../enums";
import {
    AccountLoggedIn, AccountRegistered, CalendarArchived, CalendarCreated, CalendarDeleted,
    CalendarRetrieved, CalendarUpdated, CreatedResponse, InvalidSlotRequestCreated, OkayResponse,
    ServiceOnline, SlotRequestCreated, SlotRequestApproved, SlotRequestRefused, SlotRequestsRetrieved,
    SuccessResponse, SlotRequestDeleted, CalendarSlotAvailable, CalendarSlotUnavailable,
    CalendarRequestsRetrieved, UserTokensRecharged,
    SlotRequestsStatusRetrieved
} from "../responses/successResponses";

/**
 * Factory class to generate SuccessResponses based on a SuccessType and 
 * (optionally) some data to include in the response.
 * It uses predefined success response classes defined in "successResponses.ts".
*/
export class SuccessResponseFactory {
    public static getResponse(type: SuccessType = SuccessType.OK, data?: object): SuccessResponse {
        let response: SuccessResponse;
        switch (type) {
            // Base success
            case SuccessType.OK:
                response = new OkayResponse(undefined, data);
                break;
            case SuccessType.Created:
                response = new CreatedResponse(undefined, data);
                break;

            // OK success
            case SuccessType.ServiceOnline:
                response = new ServiceOnline(data);
                break;
            case SuccessType.AccountLoggedIn:
                response = new AccountLoggedIn(data);
                break;
            case SuccessType.CalendarRetrieved:
                response = new CalendarRetrieved(data);
                break;
            case SuccessType.CalendarUpdated:
                response = new CalendarUpdated(data);
                break;
            case SuccessType.CalendarDeleted:
                response = new CalendarDeleted(data);
                break;
            case SuccessType.CalendarArchived:
                response = new CalendarArchived(data);
                break;
            case SuccessType.SlotRequestsRetrieved:
                response = new SlotRequestsRetrieved(data);
                break;
            case SuccessType.SlotRequestsStatusRetrieved:
                response = new SlotRequestsStatusRetrieved(data);
                break;
            case SuccessType.SlotRequestApproved:
                response = new SlotRequestApproved(data);
                break;
            case SuccessType.SlotRequestRefused:
                response = new SlotRequestRefused(data);
                break;
            case SuccessType.SlotRequestDeleted:
                response = new SlotRequestDeleted(data);
                break;
            case SuccessType.CalendarSlotAvailable:
                response = new CalendarSlotAvailable(data);
                break;
            case SuccessType.CalendarSlotUnavailable:
                response = new CalendarSlotUnavailable(data);
                break;
            case SuccessType.CalendarRequestsRetrieved:
                response = new CalendarRequestsRetrieved(data);
                break;
            case SuccessType.UserTokensRecharged:
                response = new UserTokensRecharged(data);
                break;

            // Created success
            case SuccessType.AccountRegistered:
                response = new AccountRegistered(data);
                break;
            case SuccessType.CalendarCreated:
                response = new CalendarCreated(data);
                break;
            case SuccessType.SlotRequestCreated:
                response = new SlotRequestCreated(data);
                break;
            case SuccessType.InvalidSlotRequestCreated:
                response = new InvalidSlotRequestCreated(data);
                break;

            // Default success
            default:
                response = new OkayResponse(undefined, data);
                break;
        }
        return response;
    }
}