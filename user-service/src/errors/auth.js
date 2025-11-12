import { AppError } from "./app.js";

export class AuthError extends AppError
{
    constructor(
        message = "Auth Failed",
        originalError = null,
        status = 400,
        code = "AUTH_FAILED"
    )
    {
    super(message, status, code);
    this.originalError = originalError;
    if (originalError && originalError.code) {
      this.dbErrorCode = originalError.code;
    }
  }
}