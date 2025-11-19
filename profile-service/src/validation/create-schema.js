export const createSchema = {
  type: "object",
  required: ["user_id", "email", "username"],
  additionalProperties: false,
  properties: {
    user_id: {
      type: "string",
      format: "uuid"
    },
    email: {
      type: "string",
      maxLength: 50
    },
    username: {
      type: "string",
      maxLength: 50
    }
  }
};
