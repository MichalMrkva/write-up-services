import { logging } from "./middleware";
import router from "./routes/router";

export function runServer(port) {
  const app = express();

  app.use(logging);

  app.use(router);

  app.listen(port, () => {
    console.log("app running");
  });
}
