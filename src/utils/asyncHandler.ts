import { Request, Response, NextFunction } from "express";

// Catch errors in async functions
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    console.log("Async handler used");
    Promise.resolve(fn(req, res, next)).catch(next);
}
    