import { initDB } from "./db/db-client.js";
import { runServer } from "./server.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const env = {
  app: {
    port: +process.env.PORT,
  },
  postgres: {
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: +process.env.POSTGRES_PORT,
  },
};

await initDB(
  env.postgres.user,
  env.postgres.host,
  env.postgres.database,
  env.postgres.password,
  env.postgres.port
);

runServer(env.app.port);
