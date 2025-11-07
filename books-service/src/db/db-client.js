import { Client } from "pg";

let client;

export async function initDB(user, host, database, password, port) {
  client = new Client({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
  });

  try {
    await client.connect();
  } catch (err) {
    console.error("Error connecting to database", err);
    throw err;
  }
}

export function getDbClient() {
  if (client) {
    return client;
  } else {
    throw new Error("DB Client not ready");
  }
}
