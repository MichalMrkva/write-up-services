import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getUsersServiceSingleton } from "../../services/Users.js";
import { serverError } from "../../const/default-errors.js";
export const getBlacklist= async(req,res)=>
{
    console.log("Req dorazil do controlleru getBlacklist")
    const service= await getUsersServiceSingleton();     
    const dtoIn=res.query    

    console.log(service.getBlacklist)
    try{
        const dtOut=await service.getBlacklist(dtoIn)
        res.status(200).json(dtOut);
    }
    catch(err)
    {   
        console.log("getBlacklist controller error:",err)
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