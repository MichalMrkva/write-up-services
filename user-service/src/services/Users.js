import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ajv } from "../validation/ajv.js";
import { registerSchema } from "../validation/register-schema.js";
import { loginSchema } from "../validation/login-schema.js";
import { signoutSchema } from "../validation/signout-schema.js";
import { refreshSchema } from "../validation/refresh-schema.js";
import { getAuthRepoSingleton } from "../repositories/auth-repository.js";
import { AuthError } from "../errors/auth.js";
import { ValidationError } from "../errors/validation.js";

import dotenv from "dotenv";
dotenv.config({ quiet: true });

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
    ajv.addSchema(signoutSchema, "signout");
    ajv.addSchema(refreshSchema, "refresh");
  }

  async register(dtoIn) {
    const validate = ajv.getSchema("register");
    if (!validate(dtoIn)) throw new ValidationError(validate.errors);

    const validUsernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validUsernameRegex.test(dtoIn.username)) {
      throw new ValidationError([
        {
          message: "Username should only have basic characters",
        },
      ]);
    }

    const strongPwRegex =
      /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9])(?!.*\s).*$/;

    if (!strongPwRegex.test(dtoIn.password)) {
      throw new ValidationError([
        {
          message:
            "Weak password: must have 10+ chars, upper/lowercase, number, special char, no spaces.",
        },
      ]);
    }

    const hashed = await bcrypt.hash(dtoIn.password, 10);

    const userDoc = {
      email: dtoIn.email,
      password_hash: hashed,
      username: dtoIn.username,
    };

    return await this.#repo.register(userDoc);
  }

  async login(dtoIn) {
    const validate = ajv.getSchema("login");
    if (!validate(dtoIn)) throw new ValidationError(validate.errors);

    const user = await this.#repo.login(dtoIn.email);
    const isMatch = await bcrypt.compare(dtoIn.password, user.password_hash);
    if (!isMatch) throw new AuthError("Invalid password", "PasswordNotMatch");
    const existingRefreshToken = await this.#repo.getToken(
      undefined,
      dtoIn.email
    );

    const authorId = await this.getProfileId(user.id);
    let accessToken;
    let refreshToken;
    if (!authorId) {
      accessToken = jwt.sign(
        { userId: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
    } else {
      accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          username: user.username,
          authorId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
    }
    if (existingRefreshToken.refresh_token) {
      refreshToken = existingRefreshToken.refresh_token;
    } else {
      refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );
    }

    await this.#repo.saveToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
      username: user.username,
      authorId,
    };
  }

  async signout(dtoIn) {
    const validate = ajv.getSchema("signout");
    if (!validate(dtoIn)) throw new ValidationError(validate.errors);

    const accessToken = dtoIn.accessToken;
    if (!accessToken)
      throw new AuthError("Missing access token", "MissingToken");

    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch {
      throw new AuthError("Invalid access token", "InvalidToken");
    }

    const userId = payload.userId;

    await this.#repo.blacklistAccessToken(accessToken);
    console.log("Access token blacklisted for user:", userId);

    await this.#repo.signout(userId);
    console.log("Refresh token deleted for user:", userId);

    return { message: "Signout success" };
  }

  async refresh(dtoIn) {
    const validate = ajv.getSchema("refresh");
    if (!validate(dtoIn)) throw new ValidationError(validate.errors);

    const token = dtoIn.refreshToken;
    if (!token) throw new AuthError("Missing refresh token", "MissingToken");

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new AuthError("Invalid refresh token", "InvalidToken");
    }

    const userId = payload.userId;
    const user = await this.#repo.getToken(userId, undefined);
    if (!user || user.refresh_token !== token) {
      throw new AuthError("Incorrect refresh token", "IncorrectToken");
    }

    const authorId = await this.getProfileId(userId);

    const newAccessToken = jwt.sign(
      { userId, email: user.email, username: user.username, authorId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  }

  async getProfileId(userId) {
    const PROFILE_SERVICE_URL =
      "http://profile-service-test:3002/api/v1/profile";

    const res = await fetch(`${PROFILE_SERVICE_URL}?userId=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Profile service error:", res.status, await res.text());
      return null;
    }

    const profile = await res.json();
    return profile?.id || null;
  }
  async getBlacklist(dtoIn) {
    return await this.#repo.isAccessTokenBlacklisted(dtoIn.token);
  }
}

export default UsersService;
