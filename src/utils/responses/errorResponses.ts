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

export class MissingTokenPayload extends Unauthorized {
    constructor() {
        super("Token payload is missing")
    }
}

export class InvalidTokenPayload extends Unauthorized {
    constructor() {
        super("Token payload is invalid - UUID and role are requested")
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