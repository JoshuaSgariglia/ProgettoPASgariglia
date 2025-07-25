import { ErrorType } from "../enums";
import {
    BadRequest, CalendarArchived, CalendarNameAlreadyInUse, CalendarNotFound,
    CalendarSlotUnavailable, ComputingResourceNotFound, ComputingResourceUnavailable, EmailAlreadyInUse,
    ErrorResponse, Forbidden, InputValueTooBig, InputValueTooLong, InputValueTooShort, InputValueTooSmall,
    InsufficientPermissions, InternalServerError, IntersectingRequests, InvalidAuthorizationType,
    InvalidInputFormat, InvalidInputType, InvalidInputValue, InvalidLoginCredentials, InvalidPayload,
    InvalidToken, InvalidTokenPayload, MissingAuthorizationHeader, MissingInputField, MissingPayload,
    NotFound, OngoingRequests, ArchivedRequestDeletion, FullyUsedRequestDeletion, RefusedRequestDeletion,
    SlotRequestNotFound, TokenExpired, TokenNotActivated, Unauthorized, UndefinedRouteOrInvalidMethod,
    UnrecognizedInputField, UsernameAlreadyInUse, UserNotFound,
    Conflict
} from "../responses/errorResponses";

/**
 * Factory class to generate ErrorResponses based on an ErrorType and (optionally) an error message.
 * It uses predefined error response classes defined in "errorResponses.ts".
*/
export class ErrorFactory {
    public static getError(type: ErrorType = ErrorType.InternalServerError, message?: string): ErrorResponse {
        let error: ErrorResponse;
        switch (type) {
            // Base errors
            case ErrorType.BadRequest:
                error = new BadRequest(message);
                break;
            case ErrorType.Unauthorized:
                error = new Unauthorized(message);
                break;
            case ErrorType.Forbidden:
                error = new Forbidden(message);
                break;
            case ErrorType.NotFound:
                error = new NotFound(message);
                break;
            case ErrorType.Conflict:
                error = new Conflict(message);
                break;
            case ErrorType.InternalServerError:
                error = new InternalServerError(message);
                break;

            // BadRequest errors
            case ErrorType.MissingPayload:
                error = new MissingPayload();
                break;
            case ErrorType.InvalidPayload:
                error = new InvalidPayload();
                break;
            case ErrorType.InvalidLoginCredentials:
                error = new InvalidLoginCredentials();
                break;
            case ErrorType.UsernameAlreadyInUse:
                error = new UsernameAlreadyInUse();
                break;
            case ErrorType.EmailAlreadyInUse:
                error = new EmailAlreadyInUse();
                break;
            case ErrorType.CalendarNameAlreadyInUse:
                error = new CalendarNameAlreadyInUse();
                break;
            case ErrorType.CalendarArchived:
                error = new CalendarArchived();
                break;
            case ErrorType.OngoingRequests:
                error = new OngoingRequests();
                break;
            case ErrorType.RefusedRequestDeletion:
                error = new RefusedRequestDeletion();
                break;
            case ErrorType.ArchivedRequestDeletion:
                error = new ArchivedRequestDeletion();
                break;
            case ErrorType.FullyUsedRequestDeletion:
                error = new FullyUsedRequestDeletion();
                break;

            // BadRequest errors - Payload validation
            case ErrorType.MissingInputField:
                error = new MissingInputField(message);
                break;
            case ErrorType.UnrecognizedInputField:
                error = new UnrecognizedInputField(message);
                break;
            case ErrorType.InvalidInputType:
                error = new InvalidInputType(message);
                break;
            case ErrorType.InvalidInputValue:
                error = new InvalidInputValue(message);
                break;
            case ErrorType.InvalidInputFormat:
                error = new InvalidInputFormat(message);
                break;
            case ErrorType.InputValueTooSmall:
                error = new InputValueTooSmall(message);
                break;
            case ErrorType.InputValueTooBig:
                error = new InputValueTooBig(message);
                break;
            case ErrorType.InputValueTooShort:
                error = new InputValueTooShort(message);
                break;
            case ErrorType.InputValueTooLong:
                error = new InputValueTooLong(message);
                break;

            // Unauthorized errors
            case ErrorType.MissingAuthorizationHeader:
                error = new MissingAuthorizationHeader();
                break;
            case ErrorType.InvalidAuthorizationType:
                error = new InvalidAuthorizationType();
                break;
            case ErrorType.TokenExpired:
                error = new TokenExpired();
                break;
            case ErrorType.TokenNotActivated:
                error = new TokenNotActivated();
                break;
            case ErrorType.InvalidToken:
                error = new InvalidToken();
                break;
            case ErrorType.InvalidTokenPayload:
                error = new InvalidTokenPayload();
                break;

            // Forbidden errors
            case ErrorType.InsufficientPermissions:
                error = new InsufficientPermissions()
                break;

            // NotFound errors
            case ErrorType.UndefinedRouteOrInvalidMethod:
                error = new UndefinedRouteOrInvalidMethod();
                break;
            case ErrorType.ComputingResourceNotFound:
                error = new ComputingResourceNotFound();
                break;
            case ErrorType.CalendarNotFound:
                error = new CalendarNotFound();
                break;
            case ErrorType.SlotRequestNotFound:
                error = new SlotRequestNotFound();
                break;
            case ErrorType.UserNotFound:
                error = new UserNotFound();
                break;
            
            // Conflict errors
            case ErrorType.ComputingResourceUnavailable:
                error = new ComputingResourceUnavailable();
                break;
            case ErrorType.CalendarSlotUnavailable:
                error = new CalendarSlotUnavailable();
                break;
            case ErrorType.IntersectingRequests:
                error = new IntersectingRequests();
                break;

            // Default error
            default:
                error = new InternalServerError(message);
                break;
        }
        return error;
    }
}



