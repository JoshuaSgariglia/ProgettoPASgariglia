import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "./HttpResponse";

/*
 * This file includes a list of predefined ErrorResponses, divided into categories.
 * The base ErrorResponse class extends the HttpResponse class.
 * Middle ErrorResponse classes extend the base ErrorResponse class.
 * Specialized ErrorResponse classes extend a midlle ErrorResponse class.
*/

// --- Base ErrorResponse class ---
export class ErrorResponse extends HttpResponse {
    protected errorType: string;

    public getErrorType(): string {
        return this.errorType;
    }

    constructor(
        message: string,
        statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
        errorType?: string,
    ) {
        super(message, statusCode);
        this.errorType = errorType ?? this.constructor.name;
    }
}


// --- Middle ErrorResponse classes ---
export class BadRequest extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The submitted request data is invalid",
            StatusCodes.BAD_REQUEST,
        )
    }
}

export class Unauthorized extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "Authentication is needed to access this resource",
            StatusCodes.UNAUTHORIZED,
        )
    }
}

export class Forbidden extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The authorization is not adequate for this resource",
            StatusCodes.FORBIDDEN,
        )
    }
}

export class NotFound extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The submitted request data is invalid",
            StatusCodes.NOT_FOUND,
        )
    }
}

export class Conflict extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The submitted request cannot be fulfilled due to a conflict",
            StatusCodes.CONFLICT,
        )
    }
}

export class InternalServerError extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "An internal server error occurred",
            StatusCodes.INTERNAL_SERVER_ERROR,
        )
    }
}


// --- Specialized ErrorResponse classes ---

// BadRequest errors - Domain-specific
export class MissingPayload extends BadRequest {
    constructor() {
        super("Missing payload in request body")
    }
}

export class InvalidPayload extends BadRequest {
    constructor() {
        super("Invalid payload in request body")
    }
}

export class InvalidLoginCredentials extends BadRequest {
    constructor() {
        super("Invalid username and\\or password")
    }
}

export class UsernameAlreadyInUse extends BadRequest {
    constructor() {
        super("The inserted username is already in use")
    }
}

export class EmailAlreadyInUse extends BadRequest {
    constructor() {
        super("The inserted email is already in use")
    }
}

export class CalendarNameAlreadyInUse extends BadRequest {
    constructor() {
        super("The selected name is already associated to a calendar")
    }
}

export class CalendarArchived extends BadRequest {
    constructor() {
        super("Cannot update an archived calendar")
    }
}

export class OngoingRequests extends BadRequest {
    constructor() {
        super("Cannot delete or archive the calendar while there are ongoing requests")
    }
}

export class RefusedRequestDeletion extends BadRequest {
    constructor() {
        super("Cannot delete a refused request")
    }
}

export class ArchivedRequestDeletion extends BadRequest {
    constructor() {
        super("Cannot delete an archived request")
    }
}

export class FullyUsedRequestDeletion extends BadRequest {
    constructor() {
        super("Cannot delete a request that has been fully used")
    }
}

// Bad Request errors - Payload validation with Zod
export class MissingInputField extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Missing input field")
    }
}

export class UnrecognizedInputField extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Unrecognized input field")
    }
}

export class InvalidInputType extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input type")
    }
}

export class InvalidInputValue extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input value")
    }
}

export class InvalidInputFormat extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input format")
    }
}

export class InputValueTooSmall extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input value: number too small")
    }
}

export class InputValueTooBig extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input value: number too big")
    }
}

export class InputValueTooShort extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input value: string too short")
    }
}

export class InputValueTooLong extends BadRequest {
    constructor(message?: string) {
        super(message ?? "Invalid input value: string too long")
    }
}

// Unauthorized errors
export class MissingAuthorizationHeader extends Unauthorized {
    constructor() {
        super("Authorization header is missing")
    }
}

export class InvalidAuthorizationType extends Unauthorized {
    constructor() {
        super("Authorization type is invalid - Bearer token is requested")
    }
}

export class TokenExpired extends Unauthorized {
    constructor() {
        super("Token has expired")
    }
}

export class TokenNotActivated extends Unauthorized {
    constructor() {
        super("Token not yet activated - Retry in a few seconds")
    }
}

export class InvalidToken extends Unauthorized {
    constructor() {
        super("Token signature and\\or form is not valid")
    }
}

export class InvalidTokenPayload extends Unauthorized {
    constructor() {
        super("Token payload is invalid")
    }
}

// Forbidden errors
export class InsufficientPermissions extends Forbidden {
    constructor() {
        super("Insufficient permissions to access this resource")
    }
}

// NotFound errors
export class UndefinedRouteOrInvalidMethod extends NotFound {
    constructor() {
        super("The selected route and\\or method are invalid")
    }
}

export class ComputingResourceNotFound extends NotFound {
    constructor() {
        super("The selected computing resource does not exist")
    }
}

export class CalendarNotFound extends NotFound {
    constructor() {
        super("The selected calendar does not exist")
    }
}

export class SlotRequestNotFound extends NotFound {
    constructor() {
        super("The selected slot request does not exist")
    }
}

export class UserNotFound extends NotFound {
    constructor() {
        super("The selected user does not exist")
    }
}

// Conflict errors
export class ComputingResourceUnavailable extends Conflict {
    constructor() {
        super("The selected computing resource is already associated to a calendar")
    }
}

export class CalendarSlotUnavailable extends Conflict {
    constructor() {
        super("The selected time range is already assigned to another request")
    }
}

export class IntersectingRequests extends Conflict {
    constructor() {
        super("Cannot approve the request because there are approved intersecting requests")
    }
}