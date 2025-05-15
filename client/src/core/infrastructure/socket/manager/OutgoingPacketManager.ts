import { bindingScopeValues, inject, multiInject } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import ServerPacket from "../../../domain/socket/server/ServerPacket";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import Client from "../../../domain/socket/client/Client";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import types, { container } from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/socket/client/ClientPacket";
import AESInterface from "../../../domain/crypt/AESInterface";
import WebSocketClient from "../WebSocketClient";
import WebSocketClientInterface from "../../../domain/socket/WebSocketClientInterface";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import OutgoingPacketServiceInterface from "../../../domain/socket/services/OutgoingPacketServiceInterface";

@provide(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager, bindingScopeValues.Singleton)
export default class OutgoingPacketManager implements OutgoingPacketManagerInterface {
    private readonly outgoingPacketBuilderMap: Map<ClientPacket, OutgoingPacketBuilderInterface> = new Map();

    // Needs better solution, temp fix for circulair dependency when wanting to inject in IncommingPackets to dispatch outgoing.
    public static get Singleton(): OutgoingPacketManagerInterface 
    {
        return container.get<OutgoingPacketManagerInterface>(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager)
    }

    constructor(
        @multiInject(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface) packetBuilders: OutgoingPacketBuilderInterface[],
        @inject(types.Core.Infrastructure.Socket.WebSocketClient) private readonly client: WebSocketClientInterface,
        @inject(types.Core.Infrastructure.Socket.Services.OutgoingSocketPacketService) private readonly packetService: OutgoingPacketServiceInterface
    ) {
        packetBuilders.forEach(handler => this.outgoingPacketBuilderMap.set(handler.id, handler));
    }

    public async dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void> {
        const packetBuilder = this.outgoingPacketBuilderMap.get(id);
        let packet: SocketPacket | undefined = undefined;
        if(packetBuilder)
        {
            packet = await packetBuilder.build(
                ... data
            );
        }

        if(packet)
        {
            const payload = this.packetService.parseBufferFromPacket(packet)
            return this.client.socket.send(payload);
        } 
        
        console.log(`Packet handler with id: ${id} not found`)
    }
}
