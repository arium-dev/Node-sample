const { HttpStatusCode, GenericConstants } = require("../constants");
class AppError extends Error {
  constructor(message, statusCode, err = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? GenericConstants.FAIL
      : GenericConstants._ERROR;
    this.isOperational = true;
    this.err = err;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequest extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.BAD_REQUEST, err);
  }
}

class Unauthorized extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.UNAUTHORIZED, err);
  }
}

class Forbidden extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.FORBIDDEN, err);
  }
}

class NotFound extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.NOT_FOUND, err);
  }
}

class InternalServerError extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, err);
  }
}

class BadGateway extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.BAD_GATEWAY, err);
  }
}

class Conflict extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.CONFLICT, err);
  }
}

class ExpectationFailed extends AppError {
  constructor(message, err = null) {
    super(message, HttpStatusCode.EXPECTATIONFAILED, err);
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  InternalServerError,
  BadGateway,
  Conflict,
  ExpectationFailed,
};
