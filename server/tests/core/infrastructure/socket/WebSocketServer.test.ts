import WebSocket from 'ws';
import WebSocketServer from '../../../../src/core/infrastructure/socket/WebSocketServer';
import Client from '../../../../src/core/domain/socket/client/Client';
import types, { container } from '../../../../src/di';
import ServerPacket from '../../../../src/core/domain/socket/server/ServerPacket';

const mockOutgoingPacketManager = {
    dispatchToClient: jest.fn(),
    dispatchToAll: jest.fn(),
};

const mockIncommingPacketManager = {
    processPacket: jest.fn()
};

jest.mock('ws', () => {
    const mockServer = {
        on: jest.fn(),
    };
    return {
        Server: jest.fn(() => mockServer),
    };
});

const mockAES = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
};


describe('WebSocketServer', () => {
    let wsServer: WebSocketServer;
    let mockSocket: WebSocket;

    beforeAll(() => {

        if (!container.isBound(types.Core.Infrastructure.Crypt.IAESInterface)) {
            container.bind(types.Core.Infrastructure.Crypt.IAESInterface).toConstantValue(mockAES);
        } 
    })

    beforeEach(() => {
        jest.clearAllMocks();

        wsServer = new WebSocketServer(
            1234,
            mockOutgoingPacketManager,
            mockIncommingPacketManager
        );

        mockSocket = {
            on: jest.fn(),
            binaryType: '',
        } as unknown as WebSocket;
    });

    describe("onClientConnect", () => {
        it("Should set socket to binary", async() => {

            await (wsServer as any).onClientConnect(mockSocket);

            expect(mockSocket.binaryType).toBe('arraybuffer');
        })

        it("Should add client to client stack", async() => {
            await (wsServer as any).onClientConnect(mockSocket);

            const client = WebSocketServer.clients.get(mockSocket);

            expect(client).toBeDefined();
        });

        it("Should add an event to handle incomming data('message')", async() =>{

            await (wsServer as any).onClientConnect(mockSocket);

            expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
        })

        it("Should add an event to handle client disconnection(close)", async() => {
        
            await (wsServer as any).onClientConnect(mockSocket);
        
            expect(mockSocket.on).toHaveBeenCalledWith('close', expect.any(Function));
        })

        it("Should send an RSA packet", async() => {
            const mockDispatch = jest.fn();
            mockOutgoingPacketManager.dispatchToClient = mockDispatch;
        
         
            await (wsServer as any).onClientConnect(mockSocket);
        
            const client = WebSocketServer.clients.get(mockSocket);
            expect(mockDispatch).toHaveBeenCalledWith(client, ServerPacket.SendRSAKey);
        })
    });

    describe("onClientDisconnect", () => {
        it('should remove the client on disconnect', () => {
            const mockClient = new Client(mockSocket, 1);
            WebSocketServer.clients.set(mockSocket, mockClient);
        
            (wsServer as any).onClientDisconnect(mockSocket);
        
            expect(WebSocketServer.clients.has(mockSocket)).toBe(false);
        });
    });

    describe('onPacketReceive', () => {
        it('should call processPacket with Buffer if client exists', async () => {
            const mockClient = new Client(mockSocket, 1);
            WebSocketServer.clients.set(mockSocket, mockClient);
    
            const data = new Uint8Array([1, 2, 3]).buffer;
    
            await (wsServer as any).onPacketReceive(mockSocket, data);
    
            expect(mockIncommingPacketManager.processPacket).toHaveBeenCalledWith(
                mockClient,
                Buffer.from(data)
            );
        });

        it('should throw an error if invalid data has been received', async () => {
            const mockClient = new Client(mockSocket, 1);
            WebSocketServer.clients.set(mockSocket, mockClient);
        
            const data = Buffer.from("123");
        
            await expect((wsServer as any).onPacketReceive(mockSocket, data))
                .rejects
                .toThrow();
        });

        it('should not call processPacket if client is not found', async () => {
            const mockBuffer = Buffer.from([1, 2, 3]);

            await (wsServer as any).onPacketReceive(mockSocket, mockBuffer);

            expect(mockIncommingPacketManager.processPacket).not.toHaveBeenCalled();
        });
    });

    describe('listen', () => {
        it('should initialize WebSocket.Server with correct config and bind connection handler', async () => {
            const mockOn = jest.fn();
            (WebSocket.Server as unknown as jest.Mock).mockImplementation(() => ({
                on: mockOn,
            }));

            await wsServer.listen();

            expect(WebSocket.Server).toHaveBeenCalledWith({
                port: wsServer['PORT'], 
                maxPayload: 4096, 
            });

            expect(mockOn).toHaveBeenCalledWith('connection', expect.any(Function));
        });

        it('should throw an error if WebSocket.Server creation fails', async () => {
            (WebSocket.Server as unknown as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Port in use');
            });

            await expect(wsServer.listen()).rejects.toThrow('Port in use');
        });
    });

    describe("destroy", () => {
        it('should close the WebSocket server if running', async () => {
            const closeMock = jest.fn();
            (wsServer as any).server = { close: closeMock } as unknown as WebSocket.Server;
        
            await wsServer.destroy();
        
            expect(closeMock).toHaveBeenCalled();
        });
    
        it('should skip closing if server is undefined', async () => {
            (wsServer as any).server = undefined;
        
            await expect(wsServer.destroy()).resolves.not.toThrow();
        });
    });
});
