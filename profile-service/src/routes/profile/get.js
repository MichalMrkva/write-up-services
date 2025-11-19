import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getProfileServiceSingleton } from "../../services/Profiles.js";
import { serverError } from "../../const/default-errors.js";
export const get= async(req,res)=>
{
    console.log("Req dorazil do controlleru get")
    const service=await getProfileServiceSingleton();
    const dtoIn=req.query;
    console.log(service.get)
    try{
        const dtOut=await service.get(dtoIn)
        res.status(201).json(dtOut);
    }
    catch(err)
    {
        console.log("Create controller error:",err)
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