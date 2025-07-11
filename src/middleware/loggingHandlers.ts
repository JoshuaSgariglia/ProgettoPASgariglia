import { Request, Response, NextFunction } from "express";

function logRouteMethod(req: Request, res: Response, next: NextFunction) {
  console.log(`Received ${req.method} request on route ${req.originalUrl}`);
  next();
}


export const logginghandlers = [logRouteMethod];