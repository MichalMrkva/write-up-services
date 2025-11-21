import { AppError } from "./app.js";

export class FileError extends AppError{
    constructor(
        code="FILE_FAILED",
        status=400,
        message="File failed"
    ){
        super(message, status, code);
    }

}