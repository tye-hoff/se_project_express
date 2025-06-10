const BAD_REQUEST_ERROR = 400;
const AUTHENTICATION_ERROR = 401;
const PERMISSION_ERROR = 403;
const NOT_FOUND_ERROR = 404;
const CONFLICT_ERROR = 409;
const SUCCESS = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;
const DUPLICATE_ERROR = 11000;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ConflictError,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  SUCCESS,
  CREATED,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  DUPLICATE_ERROR,
  AUTHENTICATION_ERROR,
  PERMISSION_ERROR,
};
