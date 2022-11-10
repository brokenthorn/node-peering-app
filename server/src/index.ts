import http from "http";
import { AddressInfo } from "net";
import { expressApp } from "./expressApp";
import { logInformation } from "./utils";

const port = Number(process.env.PORT) || 8080;
const hostname = process.env.HOSTNAME ?? "localhost";
const server = http.createServer(expressApp);

/**
 * Starts the HTTP server listening for connections.
 * @returns The server object.
 */
const listen = () => {
  return server.listen(port, hostname, () => {
    const addr = server.address() as AddressInfo;
    console.log(`ℹ️ Listening at ${addr.address}:${addr.port}`);
  });
};

/**
 * Shuts down the server on a particular process signal,
 * logging that information before it does so.
 * @param signal The process signal that determined the shutdown.
 */
const shutdownOnSignal = (signal: NodeJS.Signals) => {
  logInformation(`ℹ️ ${signal} signal received. Shutting down server.`);
  server.close(() => logInformation("Server has shut down."));
};

// add process signal handlers:
process.on("SIGTERM", () => shutdownOnSignal("SIGTERM"));
process.on("SIGINT", () => shutdownOnSignal("SIGINT"));
process.on("SIGHUP", () => shutdownOnSignal("SIGHUP"));
process.on("SIGUSR1", () => shutdownOnSignal("SIGUSR1"));
process.on("SIGUSR2", () => shutdownOnSignal("SIGUSR2"));

// close and restart the server on internal server errors:
server.on("error", (e) => {
  logInformation(`Error: ${e.name}: ${e.message}`);

  setTimeout(() => {
    server.close();
    listen();
  }, 1000);
});

// log each request:
server.on("request", (req, res) => {
  logInformation(
    `${req.method ?? "???"}: ${req.url} by ${req.socket.remoteAddress}`
  );
});

listen();
