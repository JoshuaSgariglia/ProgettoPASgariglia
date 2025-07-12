import { ErrorType } from "../enums";
import { BadRequest, ErrorResponse, Forbidden, InsufficientPermissions, InternalServerError, InvalidAuthorizationType, InvalidPayload, InvalidToken, InvalidTokenPayload, MissingAuthorizationHeader, MissingPayload, MissingTokenPayload, NotFound, TokenExpired, TokenNotActivated, Unauthorized, UndefinedRouteOrInvalidMethod } from "../responses/errorResponses";

export class ErrorFactory {
    public static getError(type: ErrorType = ErrorType.InternalServerError): ErrorResponse {
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

            // BadRequest errors
            case ErrorType.MissingPayload:
                error = new MissingPayload()
                break;
            case ErrorType.InvalidPayload:
                error = new InvalidPayload()
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
                break;

            // NotFound errors
            case ErrorType.UndefinedRouteOrInvalidMethod:
                error = new UndefinedRouteOrInvalidMethod();
                break;
        }
        return error;
    }
}



