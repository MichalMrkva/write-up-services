import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../../../books-service/src/errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getAuthSingleton } from "../../repositories/auth-repository.js";
import { serverError } from "../../const/default-errors.js";
export const login= async(req,res)=>
{
    const service=getAuthSingleton;
    const dtoIn=req.body;
    try{
        const dtOut=await service.login(dtoIn)
        res.status(201).json(dtOut);
    }
    catch(err)
    {
        if( err instanceof ValidationError)
        {
            res.status(err.status).json({
                errors: err.errors,
                message: err.message,
                code: err.code,
            });
        }
        else if(err instanceof AuthError)
        {
            res.status(err.status).json({
                errors: err.errors,
                message: err.message,
                code: err.code,
            });
        }
        else if(err instanceof DatabaseError)
        {
            res.status(err.status).json({
                errors: err.errors,
                message: err.message,
                code: err.code,
            });
        }
        else{
            res.status(500).json(serverError);

        }

    }

}