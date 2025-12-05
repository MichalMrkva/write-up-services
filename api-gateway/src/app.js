import express from "express";
import proxy from "express-http-proxy";
import authMiddleware from "./authMiddleware.js";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());

app.use((req, res, next) => {
  console.info(`[${new Date().toISOString()}]:[${req.method}]:[${req.path}]`);
  next();
});
app.use(
  "/api/v1/user",
  proxy("user-service:3003", {
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

app.use(
  "/api/v1/profile",
  proxy("books-service:3002", {
    proxyReqPathResolver: function (req) {
      return req.originalUrl;
    },
  })
);

app.listen(port, () => {
  console.log("app running");
});
