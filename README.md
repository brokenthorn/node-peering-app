# Node Peering App

Node Peering App is a demo/learning project I wrote to get a feel for how it is
to write API servers with `Node.js` as well as clients.

The _app_ consists of a `server` and a `client` project, both written in TypeScript
(mainly because I come from .NET and C#.)

The server is written with Express.
All data is kept in memory, so everything is lost if the server is restarted.
I don't know if it's worth adding other persistence mechanisms.
The scope of the project was to get a feel for web APIs in Node.js and the general
development process.

The client is a command line application which accepts commands interactively and
executes them, communicating with the server.

Both the client and the server use WebSockets to bidirectionally communicate in realtime,
mostly for sending events like money received and for sending user messages to other clients.
The server uses the `ws` library to implement the WebSocket server.

## Scope

I'm putting this code out there so that maybe it helps someone looking for the same
things I did when I started writing it, although I would recommend that you try to
write something yourself as that is probably the <del>only</del> best way to learn.

## How to run

The server and client need to be built then run. You need Node to be installed and
all dependencies to be installed for each project.

Telling you how to run Node apps is outside the scope of this small project, but basically
once you have everything installed, just open a terminal for each project, navigate to
their folders and run `npm run build` and `npm start`, or just run `npm run dev` to run
in development mode.
