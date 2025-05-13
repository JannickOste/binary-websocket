import { bindingScopeValues, inject, multiInject } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import ServerPacket from "../../../domain/socket/ServerPacket";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import Client from "../../../domain/socket/Client";
import SocketPacket from "../../../domain/socket/SocketPacket";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import WebSocketServer from "../WebSocketServer";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";

@provide(types.Core.Infrastructure.Socket.Manager.OutgoingPacketManager, bindingScopeValues.Singleton)
export default class OutgoingPacketManager implements OutgoingPacketManagerInterface {
    private readonly serverPacketHandlerMap: Map<ServerPacket, OutgoingPacketBuilderInterface> = new Map();

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

            const body = packet.buffer.subarray(SocketPacket.HEADER_SIZE)
            if(AES.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);

                const cypherData = client.aes.encrypt(body, client.aesKey);
                encryptedPacket.write(cypherData.iv);
                encryptedPacket.write(cypherData.data);

                packet = encryptedPacket;
            }

            if(RSA.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);
                encryptedPacket.write(this.rsa.encrypt(body, client.rsaKey))

                packet = encryptedPacket;
            }

            return client.socket.send(packet.buffer);
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
