import { ErrorType } from "../utils/enums";
import { ErrorFactory } from "../utils/factories/errorFactory";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/responses/errorResponses";

/*
 * This file includes the middleware handlers for the errors.
 * The handlers are in the order in which they are called.
*/

// --- Error handlers ---

// 1. Undefined Route Handler (automatically called if no response is sent and no error is thrown)
function undefinedRouteHandler(req: Request, res: Response, next: NextFunction) {
    console.log("Undefined route accessed");
    next(ErrorType.UndefinedRouteOrInvalidMethod);
}

// 2. ErrorType Handler (generates and sends ErrorResponse based on ErrorType)
function errorTypeHandler(err: ErrorType | ErrorResponse | any, req: Request, res: Response, next: NextFunction) {
    // Check whether the error is an ErrorType
    if (Object.values(ErrorType).includes(err)) {
        console.log(`Generating error \"${err}\"`);
        ErrorFactory.getError(err).sendIn(res);


    } else {    // If it isn't, pass the error to the next handler
        next(err);
    }
}

// 3. ErrorResponse Handler (sends ErrorResponse)
function errorResponseHandler(err: ErrorResponse | any, req: Request, res: Response, next: NextFunction) {
    // Check whether the error is an ErrorResponse
    if (err instanceof ErrorResponse) {
        console.log(`Handling factory-generated error \"${err}\"`);
        err.sendIn(res)

    } else { // If it isn't, pass the error to the next handler
        next(err)
    }
}

// 4. Uncaught Error Handler (generates and sends default ErrorResponse)
function uncaughtErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log("Uncaught error:", err);
    console.log(`Generating \"${ErrorType.InternalServerError}\"`);
    ErrorFactory.getError(ErrorType.InternalServerError).sendIn(res);
    next(err)
}


// --- Error handler chain ---
export const errorHandlers = [undefinedRouteHandler, errorTypeHandler, errorResponseHandler, uncaughtErrorHandler];