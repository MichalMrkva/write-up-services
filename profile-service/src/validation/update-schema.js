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
    genres: {
      type: "array",
      items: {
        type: "string"
      }
    },
    img_url: {
      type: "string",
      maxLength: 255,
      format: "uri"
    },
    user_id:{
      type: "string",
      format: "uuid"
    },
  },
  required: ["id","user_id"],
  additionalProperties: false
};
