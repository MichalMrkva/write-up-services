import { ajv } from "../validation/ajv.js";
import { createSchema } from "../validation/create-schema.js";
import { updateSchema } from "../validation/update-schema.js";
import { getProfileRepoSingleton } from "../repositories/profile-repository.js";
import { ValidationError } from "../errors/validation.js";
import { AuthError } from "../errors/auth.js";
import dotenv from "dotenv";
import addFormats from "ajv-formats";


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
    const validate=ajv.getShema("update")
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
}
