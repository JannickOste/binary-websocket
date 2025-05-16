import { bindingScopeValues, inject, multiInject } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import ServerPacket from "../../../domain/socket/server/ServerPacket";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import Client from "../../../domain/socket/client/Client";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import WebSocketServer from "../WebSocketServer";
import types, { container } from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import OutgoingPacketService from "../services/OutgoingPacketService";

@provide(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager, bindingScopeValues.Singleton)
export default class OutgoingPacketManager implements OutgoingPacketManagerInterface {
    private readonly packetBuildersMap: Map<ServerPacket, OutgoingPacketBuilderInterface> = new Map();
    
    // Needs better solution, temp fix for circulair dependency when wanting to inject in IncommingPackets to dispatch outgoing.
    public static get Singleton(): OutgoingPacketManagerInterface 
    {
        return container.get<OutgoingPacketManagerInterface>(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager)
    }

    constructor(
        @multiInject(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface) packetBuilders: OutgoingPacketBuilderInterface[],
        @inject(types.Core.Infrastructure.Socket.Services.OutgoingSocketPacketService) private readonly packetService: OutgoingPacketService
    ) {
        packetBuilders.forEach(handler => this.packetBuildersMap.set(handler.id, handler));
    }

    public async dispatchToClient(client: Client, id: ServerPacket, ... data: unknown[]): Promise<void> {
         const packetBuilder = this.packetBuildersMap.get(id);
        let packet: SocketPacket | undefined = undefined;
        if(packetBuilder)
        {
            packet = await packetBuilder.build(
                client, ... data
            );
        }

        if(packet)
        {
            const payload = this.packetService.parseBufferFromPacket(client, packet)
            
            return client.socket.send(payload);
        } 
        
        console.log(`Packet handler with id: ${id} not found`)
    }

    public async dispatchToAll(id: ServerPacket, ... data: unknown[]): Promise<void> {
        for(const [, client] of WebSocketServer.clients.entries())
        {
            await this.dispatchToClient(client, id, ... data);
        }
    }
}
