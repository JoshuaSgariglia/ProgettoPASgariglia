import { ErrorType } from "../enums";
import { BadRequest, ErrorResponse, Forbidden, InternalServerError, MissingAuthorization, NotFound, Unauthorized, UndefinedRouteOrInvalidMethod } from "../responses/errorResponses";

export class ErrorFactory {
    public static getError(type: ErrorType): ErrorResponse {
        let error: ErrorResponse;
        switch (type) {
            // Base errors
            case ErrorType.BadRequest:
                error = new BadRequest();
                break;
            case ErrorType.Unauthorized:
                error = new Unauthorized();
                break;
            case ErrorType.Forbidden:
                error = new Forbidden();
                break;
            case ErrorType.NotFound:
                error = new NotFound();
                break;
            case ErrorType.InternalServerError:
                error = new InternalServerError();
                break;
            // Unauthorized errors
            case ErrorType.MissingAuthorization:
                error = new MissingAuthorization()
                break;
            // NotFound errors
            case ErrorType.UndefinedRouteOrInvalidMethod:
                error = new UndefinedRouteOrInvalidMethod();
                break;
            // Default error
            default:
                error = new InternalServerError()
        }
        return error;
    }
}



