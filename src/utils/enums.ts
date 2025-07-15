export enum UserRole {
	User = "user",
	Admin = "admin"
}

export enum ResourceType {
	CPU = "cpu",
	GPU = "gpu"
}

export enum RequestStatus {
	Pending = "pending",
	Invalid = "invalid",
	Approved = "approved",
	Refused = "refused",
}

export enum ContentType {
	JSON = "application/json",
	HTML = "text/html",
	TEXT = "text/plain",
	FORM = "application/x-www-form-urlencoded",
	MULTIPART = "multipart/form-data",
	XML = "application/xml"
}

export enum InputSource {
	BODY = "body",
	QUERY = "query",
	PARAMS = "params"
}

export enum ErrorType {
	// Base Errors
	BadRequest = "BadRequest",
	Unauthorized = "Unauthorized",
	Forbidden = "Forbidden",
	NotFound = "NotFound",
	InternalServerError = "InternalServerError",

	// BadRequest errors
	MissingPayload = "MissingPayload",
	InvalidPayload = "InvalidPayload",
	InvalidLoginCredentials = "InvalidCredentials",
	UsernameAlreadyInUse = "UsernameAlreadyInUse",
	EmailAlreadyInUse = "EmailAlreadyInUse",
	ComputingResourceUnavailable = "ComputingResourceUnavailable",
	CalendarNameAlreadyInUse = "CalendarNameAlreadyInUse",
	CalendarSlotUnavailable = "CalendarSlotUnavailable",
	CalendarArchived = "CalendarArchived",
	OngoingRequests = "OngoingRequests",
    IntersectingRequests = "IntersectingRequests",
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

	// Forbidden
	InsufficientPermissions = "InsufficientPermissions",

	// NotFound errors
	UndefinedRouteOrInvalidMethod = "UndefinedRouteOrInvalidMethod",
	ComputingResourceNotFound = "ComputingResourceNotFound",
	CalendarNotFound = "CalendarNotFound",
    SlotRequestNotFound = "SlotRequestNotFound",
}

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
	SlotRequestApproved = "SlotRequestApproved",
	SlotRequestRefused = "SlotRequestRefused",
	SlotRequestDeleted = "SlotRequestDeleted",
	CalendarSlotAvailable = "CalendarSlotAvailable",
	CalendarSlotUnavailable = "CalendarSlotUnavailable",

	// Created Success
	AccountLoggedIn = "AccountLoggedIn",
	AccountRegistered = "AccountRegistered",
	CalendarCreated = "CalendarCreated",
	SlotRequestCreated = "SlotRequestCreated",
	InvalidSlotRequestCreated = "InvalidSlotRequestCreated",
}