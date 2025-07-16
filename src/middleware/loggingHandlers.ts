import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * This file includes the middleware handlers for the logging.
*/

// --- Logging handler functions ---

// Logs every request received by the server
function logRouteMethod(req: Request, res: Response, next: NextFunction) {
  logger.info(`Received ${req.method} request on route ${req.originalUrl}`);
  next();
}

// --- Logging handler chain ---
export const loggingHandlers = [logRouteMethod];