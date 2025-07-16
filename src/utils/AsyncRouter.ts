import e, { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * AsyncRouter is a wrapper around Express's Router that ensures all async route handlers
 * automatically catch errors and forward them to Express error middleware via `next()`.
 * This eliminates the need for repetitive try-catch blocks in controllers or service methods.
 * Only the last handler specified in the route (typically the controller action) is wrapped, 
 * leaving middleware untouched.
 */
export class AsyncRouter {
    public readonly router: e.Router;

    constructor(options?: e.RouterOptions) {
        // Initialize an Express router with optional config
        this.router = e.Router(options);
    }

    // Wraps an async handler so any thrown errors are passed to next()
    private asyncHandlerWrapper = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
        console.log(`Entering controller action`);
        Promise.resolve(fn(req, res, next)).catch(next);
    }

    // Wraps the route handler(s), leaving all but the last as-is
    // The last handler (usually the controller) is wrapped with async error handling
    private wrapHandlers(handlers: RequestHandler[]) {
        if (handlers.length === 1) {
            // Only one handler, wrap it as async
            return [this.asyncHandlerWrapper(handlers[0])];
        }

        // If multiple handlers, wrap only the last one
        const allButLast = handlers.slice(0, -1);
        const last = handlers[handlers.length - 1];
        return [...allButLast, this.asyncHandlerWrapper(last)];
    }

    // Async GET route registration
    public getAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.get(path, this.wrapHandlers(handlers));
    }

    // Async POST route registration
    public postAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.post(path, ...this.wrapHandlers(handlers));
    }

    // Async PUT route registration
    public putAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.put(path, ...this.wrapHandlers(handlers));
    }

    // Async DELETE route registration
    public deleteAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.delete(path, ...this.wrapHandlers(handlers));
    }

    // Async PATCH route registration
    public patchAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.patch(path, ...this.wrapHandlers(handlers));
    }

    // Async ALL-method route registration
    public allAsync(path: string, ...handlers: RequestHandler[]) {
        return this.router.all(path, ...this.wrapHandlers(handlers));
    }
}