import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "./HttpResponse";

// SuccessResponse class
export class SuccessResponse extends HttpResponse {
    constructor(
        message: string,
        statusCode: StatusCodes = StatusCodes.OK,
        protected data?: object,
    ) {
        super(message, statusCode);
    }
}

// Middle SuccessResponseClasses
export class OkayResponse extends SuccessResponse {
    constructor(message?: string, data?: object) {
        super(
            message ?? "Request processed successfully", 
            StatusCodes.OK, 
            data
        );
    }
}

export class CreatedResponse extends SuccessResponse {
    constructor(message?: string, data?: object) {
        super(
            message ?? "Item created successfully", 
            StatusCodes.CREATED, 
            data
        );
    }
}

// Specialized SuccessResponse classes

// OK responses
export class ServiceOnline extends OkayResponse {
    constructor(data?: object) {
        super(
            "Service is online and running", 
            data
        );
    }
}

export class AccountLoggedIn extends OkayResponse {
    constructor(data?: object) {
        super(
            "User logged in with success", 
            data
        );
    }
}

// Created responses
export class AccountRegistered extends CreatedResponse {
    constructor(data?: object) {
        super(
            "The new account has been successfully registered", 
            data
        );
    }
}