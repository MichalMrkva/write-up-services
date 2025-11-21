import { ajv } from "../validation/ajv.js";
import { createSchema } from "../validation/create-schema.js";
import { updateSchema } from "../validation/update-schema.js";
import { uploadSchema } from "../validation/upload-schema.js";
import { getProfileRepoSingleton } from "../repositories/profile-repository.js";
import { ValidationError } from "../errors/validation.js";
import { AuthError } from "../errors/auth.js";
import dotenv from "dotenv";
import addFormats from "ajv-formats";
import { supabase } from "../db/supabase-client.js";
import { FileError } from "../errors/file.js";


dotenv.config();

let serviceSingleton;

export const getProfileServiceSingleton = async () => {
  if (!serviceSingleton) {
    const repo = await getProfileRepoSingleton(); 
    serviceSingleton = new ProfileService(repo);  
  }
  return serviceSingleton;
};

class ProfileService {
  #repo;

  constructor(repo) {
    this.#repo = repo; 
    addFormats(ajv);
    ajv.addSchema(createSchema, "create");
    ajv.addSchema(updateSchema, "update");
    ajv.addSchema(uploadSchema, "upload");
  }

  
  async create(dtoIn)
  {
    const validate=ajv.getSchema("create")
    const isValid=validate(dtoIn)
    if(!isValid) throw new ValidationError(validate.errors);
    console.log("Validace prošla");

    const result=await this.#repo.create(dtoIn);
    return result;



  }
  async get(dtoIn)
  {
    const result=await this.#repo.get(dtoIn);
    return result;

  }
  async update(dtoIn)
  {
    const validate=ajv.getSchema("update")
    const isValid=validate(dtoIn)
    if(!isValid) throw new ValidationError(validate.errors);
    console.log("Validace prošla");

    const auth=await this.#repo.get(dtoIn.id);
    if(dtoIn.userid!==auth.user_id)
    {
      throw new AuthError("You are not owner of this account")
    }

    const result=await this.#repo.update(dtoIn);    
    return result;
  }
  async upload(dtoIn) {
    const { file, user_id } = dtoIn;
    const validate = ajv.getSchema("upload");
    const isValid = validate({ user_id });
    if (!isValid) throw new ValidationError(validate.errors);
    console.log("Bylo validováno")
    

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE = 50 * 1024 * 1024;

    if (!file) {
      console.error("Upload error: File is missing");
      throw new FileError("File is missing");
    } 

    if (file.size > MAX_SIZE) {
      console.error(`Upload error: File is too big. Size: ${file.size} bytes, Max: ${MAX_SIZE} bytes`);
      throw new FileError("File is too big");
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      console.error(`Upload error: Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
      throw new FileError("Invalid file type");
    }


    const ext = file.originalname.split(".").pop();
    const fileName = `user-${user_id}-${Date.now()}.${ext}`;
    const bucketName = "avatars";

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

    if (error) throw new FileError(error.message);
    const uri=process.env.SUPABASE_URL+"/storage/v1/object/public/avatars/"+data.path
    console.log("Cesta k souboru:",uri);
    return uri;
  }

}
