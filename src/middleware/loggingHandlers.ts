import { Request, Response, NextFunction } from "express";

/**
 * This file includes the middleware handlers for the logging.
*/

// --- Logging handler functions ---

// Logs every request received by the server
function logRouteMethod(req: Request, res: Response, next: NextFunction) {
  console.log(`Received ${req.method} request on route ${req.originalUrl}`);
  next();
}

// --- Logging handler chain ---
export const logginghandlers = [logRouteMethod];