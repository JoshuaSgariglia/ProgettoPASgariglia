import { ErrorType } from "../enums";
import { BadRequest, ErrorResponse, Forbidden, InsufficientPermissions, InternalServerError, InvalidAuthorizationType, InvalidToken, InvalidTokenPayload, MissingAuthorizationHeader, MissingTokenPayload, NotFound, TokenExpired, TokenNotActivated, Unauthorized, UndefinedRouteOrInvalidMethod } from "../responses/errorResponses";

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
            case ErrorType.MissingAuthorizationHeader:
                error = new MissingAuthorizationHeader()
                break;
            case ErrorType.InvalidAuthorizationType:
                error = new InvalidAuthorizationType()
                break;
            case ErrorType.TokenExpired:
                error = new TokenExpired()
                break;
            case ErrorType.TokenNotActivated:
                error = new TokenNotActivated()
                break;
            case ErrorType.InvalidToken:
                error = new InvalidToken()
                break;
            case ErrorType.MissingTokenPayload:
                error = new MissingTokenPayload()
                break;
            case ErrorType.InvalidTokenPayload:
                error = new InvalidTokenPayload()
                break;
            // Forbidden errors
            case ErrorType.InsufficientPermissions:
                error = new InsufficientPermissions()
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



