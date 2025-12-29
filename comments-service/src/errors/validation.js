import { AppError } from "./app.js";

export class ValidationError extends AppError {
  constructor(
    errors,
    message = "Validation Failed",
    status = 400,
    code = "VALIDATION_FAILED"
  ) {
    super(message, status, code);
    this.errors = errors;
  }
}
