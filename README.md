# Binary WebSocket

This project is a WebSocket-based client-server application written in TypeScript. It consists of two main components: a **client** and a **server**. The client connects to the server, and they communicate using custom packet handlers, enabling efficient and structured communication over WebSockets.

## Project Structure

```
.gitignore
client/
	package.json
	src/
		App.ts
		Client.ts
		index.ts
		Packet.ts
		packets/
			server/
				Handshake.ts
			ServerPacket.ts
			ClientPacket.ts
			IPacketHandler.ts
	tsconfig.json
server/
	package.json
	src/
		Client.ts
		index.ts
		Packet.ts
		packets/
			client/
				Handshake.ts
			ClientPacket.ts
			IPacketHandler.ts
			server/
				Handshake.ts
			ServerPacket.ts
		Server.ts
	tsconfig.json
```

## Client

The client-side code is located in the `client` directory. The entry point for the client application is `index.ts`. The client connects to the server and handles communication using packets.

### Key Files

- **App.ts**: Contains the main application logic for the client. It is responsible for initiating the WebSocket connection and handling incoming messages.
- **Client.ts**: Defines the `Client` class, which represents a connected client and provides methods to handle communication.
- **Packet.ts**: Contains the `Packet` class, which is responsible for packaging and unpackaging data sent over WebSocket.
- **Handshake.ts**: A packet handler used by the client to handle the handshake communication with the server.

## Server

The server-side code is located in the `server` directory. The entry point for the server application is `index.ts`. The server listens for incoming connections from clients and manages communication.

### Key Files

- **Server.ts**: Contains the main server logic, responsible for managing client connections and receiving/sending packets.
- **Client.ts**: Defines the `Client` class, representing a connected client on the server side.
- **Packet.ts**: Contains the `Packet` class, which is responsible for handling incoming and outgoing data packets.
- **Handshake.ts**: A packet handler used by the server to handle the handshake communication with the client.

## Packet Handling

Both the client and server utilize custom packet handlers to process incoming packets. Packet handlers are defined in the `packets` directory and provide a structured way to handle different types of communication.

### Client Packet Handlers

- **Handshake.ts**: This handler processes handshake packets sent by the server, ensuring proper connection setup between the client and the server.

### Server Packet Handlers

- **Handshake.ts**: This handler processes handshake packets from the client. It is used to establish a connection when a new client connects to the server.

## Configuration

Both the client and server have TypeScript configuration files (`tsconfig.json`), which define the TypeScript compilation settings.

- **client/tsconfig.json**: TypeScript configuration for the client.
- **server/tsconfig.json**: TypeScript configuration for the server.

These configuration files include settings for transpiling TypeScript into JavaScript and handling module resolution.
