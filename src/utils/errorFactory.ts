import { StatusCodes } from "http-status-codes";
import { ErrorType } from "./enums";
import { Response } from "express";

// HttpResponse definition
class HttpResponse {
    constructor(
        protected message: string,
        protected statusCode: StatusCodes,
    ) { }

    // Send response
    public send(res: Response): void {
        res.status(this.statusCode).json(this)
    }
}

// ErrorResponse class
class ErrorResponse extends HttpResponse {
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

// SuccessResponse class
class SuccessResponse extends HttpResponse {
    constructor(
        message: string,
        statusCode: StatusCodes = StatusCodes.OK,
        protected data?: object,
    ) {
        super(message, statusCode);
    }

    public send(res: Response, data?: object): void {
        res.status(this.statusCode).json({ message: this.message, statusCode: this.statusCode, data: data })
    }
}

class InternalServerError extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "An internal server error occurred",
            StatusCodes.INTERNAL_SERVER_ERROR,
        )
    }

}

class Unauthorized extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "Authentication is needed to access this resource",
            StatusCodes.UNAUTHORIZED,
        )
    }
}

class Forbidden extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The authorization is not adequate for this resource",
            StatusCodes.FORBIDDEN,
        )
    }
}

class BadRequest extends ErrorResponse {
    constructor(message?: string) {
        super(
            message ?? "The submitted request data is invalid",
            StatusCodes.BAD_REQUEST,
        )
    }
}

export class ErrorFactory {
    public static getError(type: ErrorType): ErrorResponse {
        let retval: ErrorResponse;
        switch (type) {
            case ErrorType.InternalServerError:
                retval = new InternalServerError();
                break;
            case ErrorType.Unauthorized:
                retval = new Unauthorized();
                break;
            case ErrorType.Forbidden:
                retval = new Forbidden();
                break;
            case ErrorType.BadRequest:
                retval = new BadRequest();
                break;
            default:
                retval = new InternalServerError()
        }
        return retval;
    }
}

