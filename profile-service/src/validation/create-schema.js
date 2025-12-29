export const createSchema = {
  type: "object",
  required: ["userId", "email", "username"],
  additionalProperties: false,
  properties: {
    userId: {
      type: "string",
      format: "uuid",
    },
    email: {
      type: "string",
      maxLength: 50,
    },
    username: {
      type: "string",
      maxLength: 50,
    },
  },
};
