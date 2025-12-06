import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getProfileServiceSingleton } from "../../services/Profiles.js";
import { serverError } from "../../const/default-errors.js";
export const update= async(req,res)=>
{
    console.log("Req dorazil do controlleru update")
    const service=await getProfileServiceSingleton();
    const dtoIn={ ...req.body, userId:req.user.userId};
    console.log(service.update)
    try{
        const dtOut=await service.update(dtoIn)
        res.status(201).json(dtOut);
    }
    catch(err)
    {
        console.log("Update controller error:",err)
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