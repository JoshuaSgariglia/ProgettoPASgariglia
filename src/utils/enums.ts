/**
 * This file defines all the enum classes used in the app, including ErrorType and SuccessType.
*/

import logger from "./logger";

// Used by User model class
export enum UserRole {
	User = "user",
	Admin = "admin"
}

// Used by ComputingResource model class
export enum ResourceType {
	CPU = "cpu",
	GPU = "gpu"
}

// Used by SlotRequest model class
export enum RequestStatus {
	Pending = "pending",
	Invalid = "invalid",
	Approved = "approved",
	Refused = "refused",
}

// Used in "validationHandlers.ts" to know where to look for the input data
export enum InputSource {
	BODY = "body",
	QUERY = "query",
	PARAMS = "params"
}

// Thrown in the service layer for error response generation with ErrorFactory
export enum ErrorType {
	// Base Errors
	BadRequest = "BadRequest",
	Unauthorized = "Unauthorized",
	Forbidden = "Forbidden",
	NotFound = "NotFound",
	Conflict = "Conflict",
	InternalServerError = "InternalServerError",

	// BadRequest errors
	MissingPayload = "MissingPayload",
	InvalidPayload = "InvalidPayload",
	InvalidLoginCredentials = "InvalidCredentials",
	UsernameAlreadyInUse = "UsernameAlreadyInUse",
	EmailAlreadyInUse = "EmailAlreadyInUse",
	CalendarNameAlreadyInUse = "CalendarNameAlreadyInUse",
	CalendarArchived = "CalendarArchived",
	OngoingRequests = "OngoingRequests",
	RefusedRequestDeletion = "RefusedRequestDeletion",
	ArchivedRequestDeletion = "ArchivedRequestDeletion",
	FullyUsedRequestDeletion = "FullyUsedRequestDeletion",

	// BadRequest errors - Payload validation
	MissingInputField = "MissingInputField",
	UnrecognizedInputField = "UnrecognizedInputField",
	InvalidInputType = "InvalidInputType",
	InvalidInputValue = "InvalidInputValue",
	InvalidInputFormat = "InvalidInputFormat",
	InputValueTooSmall = "InputValueTooSmall",
	InputValueTooBig = "InputValueTooBig",
	InputValueTooShort = "InputValueTooShort",
	InputValueTooLong = "InputValueTooLong",

	// Unauthorized errors
	MissingAuthorizationHeader = "MissingAuthorizationHeader",
	InvalidAuthorizationType = "InvalidAuthorizationType",
	TokenExpired = "TokenExpired",
	TokenNotActivated = "TokenNotActivated",
	InvalidToken = "InvalidToken",
	InvalidTokenPayload = "InvalidTokenPayload",

	// Forbidden errors
	InsufficientPermissions = "InsufficientPermissions",

	// NotFound errors
	UndefinedRouteOrInvalidMethod = "UndefinedRouteOrInvalidMethod",
	ComputingResourceNotFound = "ComputingResourceNotFound",
	CalendarNotFound = "CalendarNotFound",
    SlotRequestNotFound = "SlotRequestNotFound",
    UserNotFound = "UserNotFound",

	// Conflict errors
	ComputingResourceUnavailable = "ComputingResourceUnavailable",
	CalendarSlotUnavailable = "CalendarSlotUnavailable",
    IntersectingRequests = "IntersectingRequests",
}

// Used in the controller layer for response generation with SuccessResponseFactory
export enum SuccessType {
	// Base success
	OK = "OK",
	Created = "Created",

	// OK success
	ServiceOnline = "ServiceOnline",
	CalendarRetrieved = "CalendarRetrieved",
	CalendarUpdated = "CalendarUpdated",
	CalendarDeleted = "CalendarDeleted",
	CalendarArchived = "CalendarArchived",
	SlotRequestsRetrieved = "SlotRequestsRetrieved",
	SlotRequestsStatusRetrieved = "SlotRequestsStatusRetrieved",
	SlotRequestApproved = "SlotRequestApproved",
	SlotRequestRefused = "SlotRequestRefused",
	SlotRequestDeleted = "SlotRequestDeleted",
	CalendarSlotAvailable = "CalendarSlotAvailable",
	CalendarSlotUnavailable = "CalendarSlotUnavailable",
	CalendarRequestsRetrieved = "CalendarRequestsRetrieved",
	UserTokensRecharged = "UserTokensRecharged",

	// Created Success
	AccountLoggedIn = "AccountLoggedIn",
	AccountRegistered = "AccountRegistered",
	CalendarCreated = "CalendarCreated",
	SlotRequestCreated = "SlotRequestCreated",
	InvalidSlotRequestCreated = "InvalidSlotRequestCreated",
}

logger.info('Enum types loaded successfully');