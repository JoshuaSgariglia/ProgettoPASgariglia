import { ErrorType } from "../utils/enums";
import { ErrorFactory } from "../utils/factories/errorFactory";
import { Request, Response, NextFunction } from "express";

// === 1. Not Found Handler (for undefined routes) ===
function undefinedRouteHandler(req: Request, res: Response, next: NextFunction) {
    console.log("Undefined route accessed - generating error");
    next(ErrorType.UndefinedRouteOrInvalidMethod);
}

// === 2. Uncaught Error Handler ===
function uncaughtErrorConverter(err: Error | ErrorType | any, req: Request, res: Response, next: NextFunction) {
    if (!Object.values(ErrorType).includes(err)) {
        console.log(`Uncaught error: ${err}`);
        err = ErrorType.InternalServerError;
    }
    next(err);
}

// === 3. Final Error Handler (anything gets converted to ErrorFactory) ===
function errorFactoryHandler(err: ErrorType, req: Request, res: Response, next: NextFunction) {
    console.log(`Handling factory-generated error`);
    ErrorFactory.getError(err).send(res);
}


export const errorHandlers = [undefinedRouteHandler, uncaughtErrorConverter, errorFactoryHandler];