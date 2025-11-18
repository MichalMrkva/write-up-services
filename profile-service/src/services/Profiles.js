import { ajv } from "../validation/ajv.js";
import { createSchema } from "../validation/create-schema.js";

import { getProfileRepoSingleton } from "../repositories/profile-repository.js";
import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import dotenv from "dotenv";

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
    ajv.addSchema(createSchema, "create");
  }

  
  async create(dtoIn)
  {
    const validate=ajv.getShema("create")
    const isValid=ajv.validate(dtoIn)
    if(!isValid) throw new ValidationError(validate.errors);
    console.log("Validace prošla");

    const result=await this.#repo.create(dtoIn);



  }
}
