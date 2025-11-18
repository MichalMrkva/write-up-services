export const registerSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    username: { type: "string" },
  },
  required: ["email", "password","username"],
  additionalProperties: false
};
