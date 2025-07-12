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
    Refused = "approved",
}

export enum ContentType {
  JSON = "application/json",
  HTML = "text/html",
  TEXT = "text/plain",
  FORM = "application/x-www-form-urlencoded",
  MULTIPART = "multipart/form-data",
  XML = "application/xml"
}

export enum ErrorType {
  // Base errors
  None = "None",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  NotFound = "NotFound",
  InternalServerError = "InternalServerError",

  // Unauthorized errors
  MissingAuthorizationHeader = "MissingAuthorizationHeader",
  InvalidAuthorizationType = "InvalidAuthorizationType",
  TokenExpired = "TokenExpired",
  TokenNotActivated = "TokenNotActivated",
  InvalidToken = "InvalidToken",
  MissingTokenPayload = "MissingTokenPayload",
  InvalidTokenPayload = "InvalidTokenPayload",

  // Forbidden
  InsufficientPermissions = "InsufficientPermissions",

  // NotFound errors
  UndefinedRouteOrInvalidMethod = "UndefinedRouteOrInvalidMethod",
}

export enum SuccessType {
  None = "None",
  ServiceOnline = "ServiceOnline",
  AccountLoggedIn = "AccountLoggedIn",
  AccountRegistered = "AccountRegistered",
}