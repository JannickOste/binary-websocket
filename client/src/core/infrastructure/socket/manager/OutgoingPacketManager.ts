import { bindingScopeValues, inject, multiInject } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import ServerPacket from "../../../domain/socket/ServerPacket";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import Client from "../../../domain/socket/Client";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import types, { container } from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/socket/ClientPacket";
import AESInterface from "../../../domain/crypt/AESInterface";
import WebSocketClient from "../WebSocketClient";
import WebSocketClientInterface from "../../../domain/socket/WebSocketClientInterface";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";

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
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface,
        @inject(types.Core.Infrastructure.Crypt.IAESInterface) private readonly aes: AESInterface,
        @inject(types.Core.Infrastructure.Socket.WebSocketClient) private readonly client: WebSocketClientInterface
    ) {
        packetBuilders.forEach(handler => this.outgoingPacketBuilderMap.set(handler.id, handler));
    }

    public async dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void> {
        const packetHandler = this.outgoingPacketBuilderMap.get(id);
        if(packetHandler)
        {
            let packet = await packetHandler.build(
                ... data
            );

            const body = packet.buffer.subarray(packet.headerSize, packet.currentOffset)
            if(AES.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);

                const cypherData = this.aes.encrypt(body, this.aes.serverKey);
                encryptedPacket.write(cypherData.iv);
                encryptedPacket.write(cypherData.data);

                packet = encryptedPacket;
            }

            if(RSA.ALLOWED_MODES.includes(packet.encryption))
            {
                const encryptedPacket = new SocketPacket(packet.id, packet.encryption);
                encryptedPacket.write(this.rsa.encrypt(body, this.rsa.publicServerKey))

                packet = encryptedPacket;
            }

            return this.client.socket.send(packet.buffer.subarray(0, packet.currentOffset));
        } 
        
        console.log(`Packet handler with id: ${id} not found`)
    }
}
