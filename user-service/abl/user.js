const loginSchema = require("../schema/loginSchema");
const registerSchema = require("../schema/registerSchema");
const dao = require("../dao/auth");
const Ajv = require("ajv");
const ajv = new Ajv();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

class Auth {

    async register(dtoIn) {
        try {
            this.validate(dtoIn, registerSchema);

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(dtoIn.password, saltRounds);

            const re = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sA-Za-z0-9])(?!.*\s).*$/;
            if (!re.test(dtoIn.password)) {
                throw { 
                    code: "weakPassword", 
                    message: "Password must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character. Spaces are not allowed." 
                };
            }

            const userDoc = {
                email: dtoIn.email,
                passwordHash: hashedPassword,
                name: dtoIn.name,
                createdAt: new Date()
            };

            const result = await dao.register(userDoc);
            if(result.error)
            {
                throw{
                    code:result.code,
                    message:result.message
                }
            }
            return result;

        } catch (err) {
            console.error("Error in register:", err);
            throw err;
        }
    }

    async login(dtoIn) {
        try {
            this.validate(dtoIn, loginSchema);

            const userFound = await dao.findByEmail(dtoIn.email);
            if (!userFound) {
                throw { code: "UserNotFound", message: "User with this email does not exist." };
            }

            const isMatch = await bcrypt.compare(dtoIn.password, userFound.passwordHash);
            if (!isMatch) {
                throw { success: false, error: "You have wrong password", code: "PasswordNotMatch" };
            }

            const token = jwt.sign(
                { userId: userFound._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            return token;

        } catch (err) {
            console.error("Error in login:", err);
            throw err;
        }
    }

    validate(dtoIn, schema) {
        const valid = ajv.validate(schema, dtoIn);
        if (!valid) {
            throw { code: "dtoInIsNotValid", validationError: ajv.errors };
        }
    }
}

module.exports = new Auth();