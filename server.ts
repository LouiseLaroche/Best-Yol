import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import * as http from "http";
const cors = require("cors");

dotenv.config();

const app: Express = express();
// to be changed for production
app.use(cors());

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind + "\n ➜ Local: http://localhost:" + port);
});

server.listen(port);
