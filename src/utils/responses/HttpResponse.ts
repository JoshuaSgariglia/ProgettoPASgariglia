import { StatusCodes } from "http-status-codes";
import { Response } from "express";

/*
 * Base HttpResponse class, extended by SuccessResponse and ErrorResponse classes.
*/
export class HttpResponse {
    constructor(
        protected message: string,
        protected statusCode: StatusCodes,
    ) { }

    // Send response using the base Express res
    public sendIn(res: Response): void {
        res.status(this.statusCode).json(this)
    }
}