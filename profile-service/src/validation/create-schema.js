export const createSchema = {
  type: "object",
  required: ["user_id"],
  additionalProperties: false,
  properties: {
    user_id: {
      type: "integer",
      minimum: 1
    },
    username: {
      type: "string",
      maxLength: 50
    },
    bio: {
      type: "string",
      maxLength: 255
    },
    img_url: {
      type: "string",
      maxLength: 255,
      format: "uri"
    },
    genre: {
      type: "string",
      maxLength: 255
    }
  }
};
