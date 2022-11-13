import http from "http";
import { AddressInfo } from "net";
import { logInformation } from "../utils";
import { expressApp } from "./expressApp";

const server = http.createServer(expressApp);

/**
 * Shuts down the server on a particular process signal,
 * logging that information before it does so.
 * @param signal The process signal that determined the shutdown.
 */
const shutdownOnSignal = (signal: NodeJS.Signals) => {
  logInformation(`${signal} signal received. Shutting down server.`);
  server.close(() => logInformation("Server has shut down."));
};

const SIGKILL: NodeJS.Signals = "SIGKILL";
const SIGINT: NodeJS.Signals = "SIGINT";
const SIGTERM: NodeJS.Signals = "SIGTERM";
const SIGHUP: NodeJS.Signals = "SIGHUP";
const SIGUSR1: NodeJS.Signals = "SIGUSR1";
const SIGUSR2: NodeJS.Signals = "SIGUSR2";

// add process signal handlers:
process.on(SIGTERM, () => shutdownOnSignal(SIGTERM));
process.on(SIGKILL, () => shutdownOnSignal(SIGKILL));
process.on(SIGINT, () => shutdownOnSignal(SIGINT));
process.on(SIGHUP, () => shutdownOnSignal(SIGHUP));
process.on(SIGUSR1, () => shutdownOnSignal(SIGUSR1));
process.on(SIGUSR2, () => shutdownOnSignal(SIGUSR2));

// close and restart the server on internal server errors:
server.on("error", (e) => {
  logInformation(`Error: ${e.name}: ${e.message}`);

  setTimeout(() => {
    server.close();
    listen();
  }, 1000);
});

const port = Number(process.env.PORT) || 8080;
const hostname = process.env.HOSTNAME ?? "localhost";

/**
 * Starts the HTTP server listening for connections.
 * @returns The server object.
 */
export const listen = () => {
  return server.listen(port, hostname, () => {
    const addr = server.address() as AddressInfo;
    logInformation(`Listening at ${addr.address}:${addr.port}`);
  });
};
