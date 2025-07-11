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
export class MissingAuthorization extends Unauthorized {
    constructor() {
        super("Authorization header is missing")
    }
}


// NotFound errors
export class UndefinedRouteOrInvalidMethod extends NotFound {
    constructor() {
        super("The selected route and\\or method are invalid")
    }
}