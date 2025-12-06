export const updateSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    bio: {
      type: "string",
      maxLength: 1000,
    },
    genre: {
      type: "string",
      maxLength: 255,
    },
    userId: {
      type: "string",
      format: "uuid",
    },
  },
  required: ["id", "userId"],
  additionalProperties: false,
};
