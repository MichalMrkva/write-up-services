export const refreshSchema = {
  type: "object",
  properties: {
    refreshToken: { type: "string" }
  },
  required: ["refreshToken"],
  additionalProperties: false
};
