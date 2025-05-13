# EncryptedSocket

EncryptedSocket is a TypeScript-based project designed to facilitate secure communication between a client and a server using encrypted sockets. This repository contains both the client and server implementations, along with configuration files for testing and building the project.

## Features

- **Secure Communication**: Implements encrypted socket communication for secure data transfer.
- **TypeScript Support**: Fully written in TypeScript for type safety and modern JavaScript features.
- **Testing**: Configured with Jest for unit testing and code coverage.
- **Modular Design**: Organized into client and server directories for clear separation of concerns.
- **Automated Encryption** Create a SocketPacket builder, specify your encryption protocol in the constructor, and you're done — dispatch handles the rest automatically.

## Client/Server Getting started: 

At the current time there is no support for none-dev builds, if you wish to get started:

1. Change your root directory to either the client/server root directory. 
2. Install the node modules using `npm install i` 
3. Start the development build of the project using: `npm run start:dev` and you are ready to go! 

## Handshake procedure: 

When a client connects to the server, the server first sends its RSA public key. The client responds with its own RSA key. Using the client’s RSA key, the server encrypts and sends its AES key, and the client does the same using the server’s RSA key. A unique confirmation code is then exchanged using AES encryption. If successful, the connection is established and ready for future feature implementation.