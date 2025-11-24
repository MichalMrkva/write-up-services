export const updateSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid"
    },
    bio: {
      type: "string",
      maxLength: 1000
    },
    genre: {
      type: "string",
      maxLength:255
    },
    user_id:{
      type: "string",
      format: "uuid"
    },
  },
  required: ["id","user_id"],
  additionalProperties: false
};
