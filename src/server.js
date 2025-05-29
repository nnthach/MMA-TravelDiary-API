// import express from "express";
const express = require("express"); // Using CommonJS syntax for compatibility

const app = express();
const hostname = "localhost";
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
