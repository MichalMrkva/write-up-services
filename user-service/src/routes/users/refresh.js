import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getUsersServiceSingleton } from "../../services/Users.js";
import { serverError } from "../../const/default-errors.js";
export const refresh= async(req,res)=>
{
    console.log("Req dorazil do controlleru refresh")
    const service= await getUsersServiceSingleton(); 
    
    const refreshToken = req.headers?.authorization?.split(" ")[1];
    
    

    console.log(service.refresh)
    try{
        const dtOut=await service.refresh({refreshToken})
        res.status(200).json(dtOut);
    }
    catch(err)
    {   
        console.log("refresh controller error:",err)
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