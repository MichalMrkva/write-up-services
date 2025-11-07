const registerSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    authorProfile: { type: "boolean" }
  },
  required: ["email", "password", "authorProfile"],
  additionalProperties: false
};
module.exports = registerSchema;