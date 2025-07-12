import e, { Router, RequestHandler, Request, Response, NextFunction } from "express";

// AsyncRouter wrapper class
export class AsyncRouter {
    public router: e.Router;

    // Catch errors in async functions
    private asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        console.log("Async handler used");
        Promise.resolve(fn(req, res, next)).catch(next);
    }

    constructor(options?: e.RouterOptions) {
        this.router = e.Router(options);
    }

    getAsync(path: string, ...handlers: Function[]) {
        return this.router.get(path, ...handlers.map(this.asyncHandler));
    }

    postAsync(path: string, ...handlers: Function[]) {
        return this.router.post(path, ...handlers.map(this.asyncHandler));
    }

    putAsync(path: string, ...handlers: Function[]) {
        return this.router.put(path, ...handlers.map(this.asyncHandler));
    }

    deleteAsync(path: string, ...handlers: Function[]) {
        return this.router.delete(path, ...handlers.map(this.asyncHandler));
    }

    patchAsync(path: string, ...handlers: Function[]) {
        return this.router.patch(path, ...handlers.map(this.asyncHandler));
    }

    allAsync(path: string, ...handlers: Function[]) {
        return this.router.all(path, ...handlers.map(this.asyncHandler));
    }
}