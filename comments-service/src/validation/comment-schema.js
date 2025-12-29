export const commentCreateSchema = {
  type: "object",
  properties: {
    text: {
      type: "string",
      minLength: 5,
      maxLength: 500,
    },
  },
  required: ["text"],
  additionalProperties: false,
};

export const commentPatchSchema = {
  type: "object",
  properties: {
    text: {
      type: "string",
      minLength: 5,
      maxLength: 500,
    },
  },
  required: [],
  minProperties: 1,
  additionalProperties: false,
};