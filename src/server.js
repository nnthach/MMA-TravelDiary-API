import express from "express";

const app = express();
const hostname = "localhost";
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World 1</h1>");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
