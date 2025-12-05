export const signoutSchema = {
  type: "object",
  properties: {
    refreshToken: { type: "string" },
    accessToken:{type:"string"}
  },
  required: ["refreshToken","accessToken"],
  additionalProperties: false
};
