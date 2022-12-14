import http from "http";
import { AddressInfo } from "net";
import { logInformation } from "../utils";
import { expressApp } from "./expressApp";

const server = http.createServer(expressApp);
const port = Number(process.env.PORT) || 8080;
const hostname = process.env.HOSTNAME ?? "localhost";

/**
 * Starts the HTTP server listening for connections on the interface
 * and port defined by the `HOSTNAME` and `PORT` environment variables
 * or `localhost:8080` if the variables are not defined.
 * @returns The http server object.
 */
export const listen = () => {
  return server.listen(port, hostname, () => {
    const addr = server.address() as AddressInfo;
    logInformation(`Listening at ${addr.address}:${addr.port}`);
  });
};

// close and restart the server on internal server errors:
server.on("error", (e) => {
  logInformation(`Error: ${e.name}: ${e.message}`);
  logInformation("Restarting server.");

  setTimeout(() => {
    server.close(() => listen());
  }, 3000);
});

const SIGKILL: NodeJS.Signals = "SIGKILL";
const SIGINT: NodeJS.Signals = "SIGINT";
const SIGTERM: NodeJS.Signals = "SIGTERM";
const SIGHUP: NodeJS.Signals = "SIGHUP";
const SIGUSR1: NodeJS.Signals = "SIGUSR1";
const SIGUSR2: NodeJS.Signals = "SIGUSR2";

/**
 * Shuts down the server on a particular process signal,
 * logging that information before it does so.
 * @param signal The process signal that determined the shutdown.
 */
const shutdownServerOnSignal = (signal: NodeJS.Signals) => {
  logInformation(`${signal} signal received. Shutting down server.`);
  server.close(() => logInformation("Server has shut down."));
};

// add process signal handlers:
process.on(SIGTERM, () => shutdownServerOnSignal(SIGTERM));
process.on(SIGKILL, () => shutdownServerOnSignal(SIGKILL));
process.on(SIGINT, () => shutdownServerOnSignal(SIGINT));
process.on(SIGHUP, () => shutdownServerOnSignal(SIGHUP));
process.on(SIGUSR1, () => shutdownServerOnSignal(SIGUSR1));
process.on(SIGUSR2, () => shutdownServerOnSignal(SIGUSR2));
