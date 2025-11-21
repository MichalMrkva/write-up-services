export const uploadSchema = {
  type: "object",
  properties: {
    user_id:{
      type: "string",
      format: "uuid"
    },
  },
  required: ["user_id"],
  additionalProperties: false
};
