import { StatusCodes } from "http-status-codes";
import { Response } from "express";

// HttpResponse definition
export class HttpResponse {
    constructor(
        protected message: string,
        protected statusCode: StatusCodes,
    ) { }

    // Send response
    public sendWith(res: Response): void {
        res.status(this.statusCode).json(this)
    }
}