import { ErrorType } from "../utils/enums";
import { ErrorFactory } from "../utils/factories/errorFactory";
import { Request, Response, NextFunction } from "express";

// === 1. Not Found Handler (for undefined routes) ===
function undefinedRouteHandler(err: Error | ErrorType, req: Request, res: Response, next: NextFunction) {
    console.log("Error handler")
}

// === 2. Custom ErrorType Handler ===
function uncaughtErrorConverter(err: Error | ErrorType, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        console.log(`Uncaught error: ${err.message}`)
        err = ErrorType.InternalServerError
    }
    next(err)
}


// === 3. Final Error Handler (anything gets converted to ErrorFactory) ===
function errorFactoryHandler(err: ErrorType, req: Request, res: Response, next: NextFunction) {
    ErrorFactory.getError(err).send(res)
    next(err)
}


const errorHandlers: Function[] = [undefinedRouteHandler, uncaughtErrorConverter, errorFactoryHandler]