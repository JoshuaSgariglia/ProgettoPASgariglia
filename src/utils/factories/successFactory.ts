import { SuccessType } from "../enums";
import { AccountLoggedIn, AccountRegistered, CalendarArchived, CalendarCreated, CalendarDeleted, CalendarRetreived, CalendarUpdated, CreatedResponse, OkayResponse, ServiceOnline, SuccessResponse } from "../responses/successResponses";

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
            case SuccessType.CalendarRetreived:
                response = new CalendarRetreived(data);
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

            // Created success
            case SuccessType.AccountRegistered:
                response = new AccountRegistered(data);
                break;
            case SuccessType.CalendarCreated:
                response = new CalendarCreated(data);
                break;

            // Default success
            default:
                response = new OkayResponse(undefined, data);
                break;
        }
        return response;
    }
}