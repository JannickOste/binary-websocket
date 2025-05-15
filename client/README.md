### Core Features
1. **Dependency Injection**:
   - Managed in `src/di.ts` using `inversify`.

2. **WebSocket Client**:
   - Implemented in `src/core/infrastructure/socket/WebSocketClient.ts`.
   - Handles server connections, disconnections, and message processing.
   - Uses `IncommingPacketManagerInterface` for processing incoming packets.

3. **Packet Management**:
   - `OutgoingPacketManagerInterface` and `IncommingPacketManagerInterface` are used for handling outgoing and incoming packets, respectively.
   - Defined in `src/core/domain/socket/manager/`.

4. **Cryptography**:
   - AES and RSA encryption utilities are implemented in `src/core/infrastructure/crypt/`.

5. **Client Management**:
   - `Client` class manages individual WebSocket client instances.

6. **Socket Packet Handling**:
   - `SocketPacket` defines the structure of packets exchanged between the client and server.
   - `ClientPacket` defines client-specific packet types.

7. **Custom Decorators**:
   - `provide` decorator is used for dependency injection bindings.

8. **Kernel Initialization**:
   - `Kernel` initializes dependencies and starts the WebSocket client.

### Additional Features
1. **Outgoing Packet Builders**:
   - Classes like `SendConfirmation` and `SendRSAKey` handle building and sending specific packets.

2. **Incoming Packet Processors**:
   - Classes like `SendAESKey` process specific incoming packets.
