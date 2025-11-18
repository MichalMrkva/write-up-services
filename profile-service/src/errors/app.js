export class AppError extends Error {
  constructor(message, status = 500, code = "GENERIC_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
