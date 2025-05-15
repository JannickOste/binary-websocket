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

@provide(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager, bindingScopeValues.Singleton)
export default class OutgoingPacketManager implements OutgoingPacketManagerInterface {
    private readonly serverPacketHandlerMap: Map<ServerPacket, OutgoingPacketBuilderInterface> = new Map();
    
    // Needs better solution, temp fix for circulair dependency when wanting to inject in IncommingPackets to dispatch outgoing.
    public static get Singleton(): OutgoingPacketManagerInterface 
    {
        return container.get<OutgoingPacketManagerInterface>(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager)
    }

    constructor(
        @multiInject(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface) packetBuilders: OutgoingPacketBuilderInterface[],
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {
        packetBuilders.forEach(handler => this.serverPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToClient(client: Client, id: ServerPacket, ... data: unknown[]): Promise<void> {
        const packetHandler = this.serverPacketHandlerMap.get(id);
        if(packetHandler)
        {
            let packet = await packetHandler.build(
                client,
                data
            );

            const body = packet.buffer.subarray(packet.headerSize, packet.currentOffset)
            if(AES.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);

                const cypherData = client.aes.encrypt(body, client.aesKey);
                encryptedPacket.writeBuffer(cypherData.iv);
                encryptedPacket.writeBuffer(cypherData.data);

                packet = encryptedPacket;
            }

            if(RSA.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);
                const encryptedData = this.rsa.encrypt(body, client.rsaKey);
                encryptedPacket.writeBuffer(encryptedData);


                console.log(`Original length: ${body.byteLength} to ${encryptedData.byteLength}`)
                console.log(`Packet size original: ${packet.currentOffset} to ${encryptedPacket.currentOffset}`)
                packet = encryptedPacket;
            }

            return client.socket.send(packet.buffer.subarray(0, packet.currentOffset));
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
