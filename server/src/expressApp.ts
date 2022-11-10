import dotenv from "dotenv";
import express, { Express } from "express";

dotenv.config();

const expressApp: Express = express();

expressApp.get("/", (_req, res) => {
  res.send(`Pong! It's ${new Date().toLocaleString()}!`);
});

export { expressApp };
