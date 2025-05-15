### Core Features
1. **Dependency Injection**:
   - Managed in `src/di.ts` using `inversify`.

2. **WebSocket Server**:
   - Implemented in `src/core/infrastructure/socket/WebSocketServer.ts`.
   - Handles client connections, disconnections, and message processing.
   - Uses `OutgoingPacketManagerInterface` and `IncommingPacketManagerInterface` for packet management.

3. **Packet Management**:
   - `OutgoingPacketManagerInterface` and `IncommingPacketManagerInterface` are used for handling outgoing and incoming packets, respectively.
   - Defined in `src/core/domain/socket/manager/`.

4. **Cryptography**:
   - AES and RSA encryption utilities are implemented in `src/core/infrastructure/crypt/`.

5. **Client Management**:
   - `Client` class manages individual WebSocket clients.

6. **Socket Packet Handling**:
   - `SocketPacket` defines the structure of packets exchanged between the server and clients.
   - `ServerPacket` defines server-specific packet types.

7. **Custom Decorators**:
   - `provide` decorator is used for dependency injection bindings.

8. **Kernel Initialization**:
   - `Kernel` initializes dependencies and starts the WebSocket server.

### Testing and Coverage
1. **Unit Testing**:
   - Configured with Jest in `jest.config.ts`.
   - Tests are located in the `tests/` directory.
