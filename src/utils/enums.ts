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
    None,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    InternalServerError,
    // Unathorized errors
    UndefinedRoute,
    // NotFound errors
    MissingAuthorization
}

export enum SuccessType {
    None,
    ServiceOnline,
    AccountLoggedIn,
    AccountRegistered
}