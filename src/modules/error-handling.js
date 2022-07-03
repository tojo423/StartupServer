const wrapAsync = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

class AppError {
  constructor(
    errorCode = "Unknown",
    message = "An error has occured!",
    status = 500
  ) {
    this.errorCode = errorCode;
    this.message = message;
    this.status = status;
  }
  static fromError(error) {
    return new AppError(error.errorCode, error.message, error.status);
  }
}

class CannotDeleteError extends AppError {
  constructor(message = "Cannot delete") {
    super("CannotDelete", message, 409);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Requested resource was not found") {
    super("NotFound", message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", "Unauthorized", 401);
  }
}

class InsufficientPrivilegeError extends AppError {
  constructor(expectedRole, role) {
    super(
      "InsufficientPrivilege",
      `Your role '${role}' is below the required role: ${expectedRole}.`,
      401
    );
  }
}

class AuthError extends AppError {
  constructor(message = "Authentication failed") {
    super("AuthFailure", message);
  }
}

class AlreadyExistsError extends AppError {
  constructor(message = "Resource already exists") {
    super("AlreadyExists", message, 409);
  }
}

module.exports = {
  wrapAsync,
  AppError,
  NotFoundError,
  UnauthorizedError,
  InsufficientPrivilegeError,
  AuthError,
  AlreadyExistsError,
  CannotDeleteError,
};
