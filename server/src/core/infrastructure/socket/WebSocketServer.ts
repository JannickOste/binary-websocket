import WebSocket from 'ws';
import { provide } from '../../domain/decorators/provide';
import Client from '../../domain/socket/client/Client';
import ServerPacket from '../../domain/socket/server/ServerPacket';
import { bindingScopeValues, inject, unmanaged } from 'inversify';
import types from '../../../di';
import OutgoingPacketManagerInterface from '../../domain/socket/manager/OutgoingPacketManagerInterface';
import IncommingPacketManagerInterface from '../../domain/socket/manager/IncommingPacketManagerInterface';
import SocketPacket from '../../domain/socket/packet/SocketPacket';

@provide(types.Core.Infrastructure.Socket.WebSocketServer, bindingScopeValues.Singleton)
export default class WebSocketServer  {
    private server: WebSocket.Server | undefined;
    public static readonly clients: Map<WebSocket, Client> = new Map();    
    
    private lastId = 0;

    constructor(
        @unmanaged() private readonly PORT: number = 8080,
        @inject(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager) private readonly outgoingPacketManager: OutgoingPacketManagerInterface,
        @inject(types.Core.Infrastructure.Socket.Manager.IncommingPacketManager) private readonly incommingPacketManager: IncommingPacketManagerInterface
    ) {

    }

    private async onClientConnect(socket: WebSocket): Promise<void> {
        socket.binaryType = 'arraybuffer';
        const client = new Client(socket, this.lastId++);
        
        WebSocketServer.clients.set(socket, client);
        
        socket.on('message', this.onPacketReceive.bind(this, socket));
        socket.on('close', this.onClientDisconnect.bind(this, socket));

        await this.outgoingPacketManager.dispatchToClient(
            client,
            ServerPacket.SendRSAKey
        )
    }

    private async onPacketReceive(socket: WebSocket, data: WebSocket.Data): Promise<void> {
        const client = WebSocketServer.clients.get(socket);
        if(client)
        {
            if(data instanceof ArrayBuffer)
            {
                return await this.incommingPacketManager.processPacket(
                    client, 
                    Buffer.from(data)
                )
            }

            throw new Error("ServerError: Invalid packet received.");
        }
    }

    private onClientDisconnect(socket: WebSocket): void {
        WebSocketServer.clients.delete(socket);
    }

    public async listen(): Promise<void>
    {
        this.server = new WebSocket.Server({ port: this.PORT, maxPayload: SocketPacket.MAX_PACKET_SIZE, });
        this.server.on('connection', this.onClientConnect.bind(this));
    }

    public async destroy(): Promise<void>
    {
        this.server?.close();
    }
}
