import express, { Express } from "express";
import { logInformation } from "../utils";
import { walletRouter } from "./walletRouter";

/** Express application instance serving our API. */
export const expressApp: Express = express();

// log all requests:
expressApp.all("/", (req, res, next) => {
  logInformation(`${req.method} ${req.path} by ${req.ip}`);
  next();
});

// ping-pong!
expressApp.get("/", (_req, res) => {
  res.type("html");
  res.send(`<html lang="en">
  <head><title>Node Peering App</title></head>
  <body style="color: white; background-color: black; font-size: 2em;">
    <code>PONG: ${new Date().toISOString()}</code>
  </body>
</html>`);
});

expressApp.use("/wallet", walletRouter);
