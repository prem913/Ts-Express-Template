export const enum STATUS_CODES {
  OK = 200,
  BAD_REQUEST = 400,
  UN_AUTHORISED = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export class AppError extends Error {
  statusCode: STATUS_CODES;
  errorDescription : unknown;
  constructor(description: string, errorDescription: unknown, statusCode: STATUS_CODES) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errorDescription = errorDescription;
    Error.captureStackTrace(this);
  }
}

//api Specific Errors
export class APIError extends AppError {
  constructor(description = "Internal Server Error", errorDescription?: unknown, statusCode = STATUS_CODES.INTERNAL_ERROR) {
    super(description, errorDescription, statusCode);
  }
}

//400
export class BadRequestError extends AppError {
  constructor(description = "Bad Request", errorDescription?: unknown, statusCode = STATUS_CODES.BAD_REQUEST) {
    super(description, errorDescription, statusCode);
  }
}

export class ValidationError extends AppError {
  constructor(description = "Validation Error", errorDescription?: unknown, statusCode = STATUS_CODES.UN_AUTHORISED) {
    super(description, errorDescription, statusCode);
  }
}

export class NotFoundError extends AppError {
  constructor(description = "Validation Error", errorDescription?: unknown, statusCode = STATUS_CODES.NOT_FOUND) {
    super(description, errorDescription, statusCode);
  }
}
