export const chapterCreateSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      maxLength: 100,
    },
    content: {
      type: "string",
      maxLength: 12000,
    },
  },
  required: ["name"],
  additionalProperties: false,
};

export const chapterPatchSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      maxLength: 100,
    },
    content: {
      type: "string",
      maxLength: 12000,
    },
  },
  required: [],
  minProperties: 1,
  additionalProperties: false,
};
