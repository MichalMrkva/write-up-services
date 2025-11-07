import { AppError } from "./app.js";

export class DatabaseError extends AppError {
  constructor(
    message = "Database Operation Failed",
    originalError = null,
    status = 500,
    code = "DB_OPERATION_FAILED"
  ) {
    super(message, status, code);
    this.originalError = originalError;
    if (originalError && originalError.code) {
      this.dbErrorCode = originalError.code;
    }
  }
}
