import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "./HttpResponse";


// Base ErrorResponse class
export class ErrorResponse extends HttpResponse {
    protected errorType: string;

    constructor(
        message: string,
        statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
        errorType?: string,
    ) {
        super(message, statusCode);
        this.errorType = errorType ?? this.constructor.name;
    }

}


// Middle ErrorResponse classes
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

export class InternalServerError extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "An internal server error occurred",
            StatusCodes.INTERNAL_SERVER_ERROR,
        )
    }

}


// Specialized ErrorResponse classes

// BadRequest errors
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

// Bad Request errors - Payload validation
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