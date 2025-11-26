export const bookCreateSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      maxLength: 100,
    },
    genre: {
      type: "string",
      maxLength: 20,
    },
    description: {
      type: "string",
      maxLength: 500,
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export const bookPatchSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      maxLength: 100,
    },
    genre: {
      type: "string",
      maxLength: 20,
    },
    description: {
      type: "string",
      maxLength: 500,
    },
  },
  required: [],
  minProperties: 1,
  additionalProperties: false,
};
