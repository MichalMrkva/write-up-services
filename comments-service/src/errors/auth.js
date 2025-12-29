import { AppError } from "./app.js";

export class AuthError extends AppError {
  constructor(
    error,
    message = "Auth Failed",
    status = 401,
    code = "AUTH_FAILED"
  ) {
    super(message, status, code);
    this.error = error;
  }
}
