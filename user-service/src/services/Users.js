import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ajv } from "../validation/ajv.js";
import { registerSchema } from "../validation/register-schema.js";
import { loginSchema } from "../validation/login-schema.js";
import { getAuthRepoSingleton } from "../repositories/auth-repository.js";
import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";
import dotenv from "dotenv";

dotenv.config();

let serviceSingleton;

export const getUsersServiceSingleton = async () => {
  if (!serviceSingleton) {
    const repo = await getAuthRepoSingleton(); 
    serviceSingleton = new UsersService(repo);  
  }
  return serviceSingleton;
};

class UsersService {
  #repo;

  constructor(repo) {
    this.#repo = repo;  
    ajv.addSchema(registerSchema, "register");
    ajv.addSchema(loginSchema, "login");
  }

  async register(dtoIn) {
    const validate = ajv.getSchema("register");
    const isValid = validate(dtoIn);
    if (!isValid) throw new ValidationError(validate.errors);

    console.log("Validace prošla");
    const re = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9])(?!.*\s).*$/;
    if (!re.test(dtoIn.password)) {
      throw new ValidationError([
        { message: "Weak password: must have 10+ chars, upper/lowercase, number, special char, no spaces." },
      ]);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dtoIn.password, saltRounds);

    const userDoc = {
      email: dtoIn.email,
      password_hash: hashedPassword,
    };

    const result = await this.#repo.register(userDoc);
    return result;
  }

  async login(dtoIn) {
    const validate = ajv.getSchema("login");
    const isValid = validate(dtoIn);
    if (!isValid) throw new ValidationError(validate.errors);
    console.log("Validace prošla");

    const user = await this.#repo.login(dtoIn.email); 
    const isMatch = await bcrypt.compare(dtoIn.password, user.password_hash);
    if (!isMatch) throw new AuthError("Invalid password", "PasswordNotMatch");

    const token = jwt.sign(
      { userId: user.id },
      {email:user.email},
      {username:user.username},
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return token;
  }
}
