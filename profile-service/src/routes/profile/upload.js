import { AuthError } from "../../errors/auth.js";
import { ValidationError } from "../../errors/validation.js";
import { DatabaseError } from "../../errors/database.js";
import { FileError } from "../../errors/file.js";
import { getProfileServiceSingleton } from "../../services/Profiles.js";
import { serverError } from "../../const/default-errors.js";
export const upload= async(req,res)=>
{
    console.log("Req dorazil do controlleru upload")
    console.log("req body",req.body)
    const service=await getProfileServiceSingleton();
    const dtoIn = {user_id: req.user.user_id , file:req.file };
    console.log(service.upload)
    try{
        const dtOut=await service.upload(dtoIn)
        res.status(201).json(dtOut);
    }
    catch(err)
    {
        console.log("Upload controller error:",err)
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
        else if(err instanceof FileError )
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