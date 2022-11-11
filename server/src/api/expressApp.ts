import express, { Express } from "express";

export const expressApp: Express = express();

expressApp.get("/", (_req, res) => {
  res.send(`Pong! It's ${new Date().toLocaleString()}!`);
});
