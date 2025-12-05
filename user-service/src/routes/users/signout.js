import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { getUsersServiceSingleton } from "../../services/Users.js";
import { serverError } from "../../const/default-errors.js";
export const signout= async(req,res)=>
{
    console.log("Req dorazil do controlleru signout")
    const service= await getUsersServiceSingleton(); 
    
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const refreshToken = req.body.refreshToken
    

    console.log(service.signout)
    try{
        const dtOut=await service.signout({accessToken,refreshToken})
        res.status(200).json(dtOut);
    }
    catch(err)
    {   
        console.log("Signout controller error:",err)
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