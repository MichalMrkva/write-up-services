import dotenv from "dotenv";

export let JWT_SECRET;

export const setup = () => {
  dotenv.config({ quiet: true });
  JWT_SECRET = process.env.JWT_SECRET;
};
