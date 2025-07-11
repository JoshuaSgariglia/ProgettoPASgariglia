import { SuccessType } from "../enums";
import { AccountLoggedIn, AccountRegistered, OkayResponse, ServiceOnline, SuccessResponse } from "../responses/successResponses";

export class SuccessResponseFactory {
    public static getResponse(type: SuccessType = SuccessType.None, data: object = {}): SuccessResponse {
        let response: SuccessResponse;
        switch (type) {
            case SuccessType.ServiceOnline:
                response = new ServiceOnline(data);
                break;
            case SuccessType.AccountLoggedIn:
                response = new AccountLoggedIn(data);
                break;
            case SuccessType.AccountRegistered:
                response = new AccountRegistered(data);
                break;
            default:
                response = new OkayResponse()
        }
        return response;
    }
}