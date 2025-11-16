import express from "express";
import proxy from "express-http-proxy";
import authMiddleware from "./authMiddleware";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.info(`[${new Date().toISOString()}]:[${req.method}]:[${req.path}]`);
  next();
});
app.use(
  "/api/v1/users",
  proxy("user-service:3002", {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  })
);
app.use(authMiddleware);


app.use(
  "/api/v1/books",
  proxy("books-service:3001", {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  })
);



app.listen(port, () => {
  console.log("app running");
});
