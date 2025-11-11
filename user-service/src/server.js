import { logging } from "./middleware.js";
import router from "./routes/router.js";
import express from "express";

export function runServer(port) {
  const app = express();

  app.use(express.json());

  app.use(logging);

  app.use(router);

  app.listen(port, () => {
    console.log("app running on port:", port);
  });
}
