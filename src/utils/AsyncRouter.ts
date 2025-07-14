import e, { Request, Response, NextFunction, RequestHandler } from "express";

// AsyncRouter wrapper class
export class AsyncRouter {
    public readonly router: e.Router;

    constructor(options?: e.RouterOptions) {
        this.router = e.Router(options);
    }
    
    // Catch errors in async functions
    private asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
        console.log(`Entering controller action`);
        Promise.resolve(fn(req, res, next)).catch(next);
    }

    private wrapHandlers(handlers: RequestHandler[]) {
        if (handlers.length === 1) {
            // Only one handler, wrap it async
            return [this.asyncHandler(handlers[0])];
        }
        
        // Multiple handlers: leave all except last as-is, wrap only last
        const allButLast = handlers.slice(0, -1);
        const last = handlers[handlers.length - 1];
        return [...allButLast, this.asyncHandler(last)];
    }

    public getAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.get(path, this.wrapHandlers(handlers));
    }

    public postAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.post(path, ...this.wrapHandlers(handlers));
    }

    public putAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.put(path, ...this.wrapHandlers(handlers));
    }

    public deleteAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.delete(path, ...this.wrapHandlers(handlers));
    }

    public patchAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.patch(path, ...this.wrapHandlers(handlers));
    }

    public allAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.all(path, ...this.wrapHandlers(handlers));
    }
}