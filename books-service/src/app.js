import express from "express";

const app = express();
const port = 3001;

app.use((req, res, next) => {
  console.info(`[${new Date().toISOString()}]:[${req.method}]:[${req.path}]`);
  next();
});

app.get("/api/v1/books", (req, res) => {
  res.send([
    { name: "Karel Krelštejn", tag: "nuda" },
    { name: "Petr Petrštejn", tag: "zabava" },
  ]);
});

app.listen(port, () => {
  console.log("app running");
});
