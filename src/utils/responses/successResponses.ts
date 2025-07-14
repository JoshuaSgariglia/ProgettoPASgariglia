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

export class CalendarRetrieved extends OkayResponse {
    constructor(data?: object) {
        super(
            "Calendar found and retrieved", 
            data
        );
    }
}

export class CalendarUpdated extends OkayResponse {
    constructor(data?: object) {
        super(
            "The calendar has been updated", 
            data
        );
    }
}

export class CalendarDeleted extends OkayResponse {
    constructor(data?: object) {
        super(
            "The calendar has been deleted", 
            data
        );
    }
}

export class CalendarArchived extends OkayResponse {
    constructor(data?: object) {
        super(
            "The calendar has been archived", 
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

export class CalendarCreated extends CreatedResponse {
    constructor(data?: object) {
        super(
            "The new calendar has been successfully created", 
            data
        );
    }
}

export class SlotRequestCreated extends CreatedResponse {
    constructor(data?: object) {
        super(
            "The new request has been successfully created and is currently pending", 
            data
        );
    }
}

export class InvalidSlotRequestCreated extends CreatedResponse {
    constructor(data?: object) {
        super(
            "The new request has been created but its status is invalid due to insufficient tokens", 
            data
        );
    }
}