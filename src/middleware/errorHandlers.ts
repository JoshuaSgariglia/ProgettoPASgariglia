import { ErrorType } from "../utils/enums";
import { ErrorFactory } from "../utils/factories/errorFactory";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/responses/errorResponses";

// === 1. Undefined Route Handler (automatically called if no response is sent and no error is thrown) ===
function undefinedRouteHandler(req: Request, res: Response, next: NextFunction) {
    console.log("Undefined route accessed");
    next(ErrorType.UndefinedRouteOrInvalidMethod);
}

// === 2. ErrorType Handler (generates ErrorResponse based on ErrorType) ===
function errorTypeHandler(err: ErrorType | ErrorResponse | any, req: Request, res: Response, next: NextFunction) {
    if (Object.values(ErrorType).includes(err)) {
        console.log(`Generating error \"${err}\"`);
        ErrorFactory.getError(err).sendWith(res);
    } else {
        next(err);
    }
}

// === 3. ErrorResponse Handler (sends ErrorResponse) ===
function errorResponseHandler(err: ErrorResponse | any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ErrorResponse) {
        console.log(`Handling factory-generated error \"${err}\"`);
        err.sendWith(res)
    } else {
        next(err)
    }
        
}

// === 4. Uncaught Error Handler (generates default ErrorResponse) ===
function uncaughtErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log("Uncaught error: ", err);
    console.log(`Generating \"${ErrorType.InternalServerError}\"`);
    ErrorFactory.getError(ErrorType.InternalServerError).sendWith(res);
    next(err)
}



export const errorHandlers = [undefinedRouteHandler, errorTypeHandler, errorResponseHandler, uncaughtErrorHandler];