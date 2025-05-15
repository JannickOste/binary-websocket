import { multiInject, inject, bindingScopeValues } from "inversify";
import AESInterface from "../../../domain/crypt/AESInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import WebSocketClientInterface from "../../../domain/socket/WebSocketClientInterface";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";

@provide(types.Core.Infrastructure.Socket.Services.OutgoingSocketPacketService, bindingScopeValues.Singleton)
export default class OutgoingPacketService implements OutgoingPacketService { 
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface,
        @inject(types.Core.Infrastructure.Crypt.IAESInterface) private readonly aes: AESInterface,
        @inject(types.Core.Infrastructure.Socket.WebSocketClient) private readonly client: WebSocketClientInterface
    ) {
    }

    public parseBufferFromPacket(packet: SocketPacket): Buffer {
        const body = packet.buffer.subarray(packet.headerSize, packet.currentOffset)
        let outgoingPacket = packet;
        if(AES.ALLOWED_MODES.includes(packet.encryption))
        {
            const encryptedPacket = new SocketPacket(packet.id, packet.encryption);
            const cypherData = this.aes.encrypt(body, this.aes.serverKey);
            encryptedPacket.writeBuffer(cypherData.iv);
            encryptedPacket.writeBuffer(cypherData.data);
            outgoingPacket = encryptedPacket;
        }

        if(RSA.ALLOWED_MODES.includes(packet.encryption))
        {
            const encryptedPacket = new SocketPacket(packet.id, packet.encryption);
            encryptedPacket.writeBuffer(this.rsa.encrypt(body, this.rsa.publicServerKey))
            outgoingPacket = encryptedPacket;
        }

        return  outgoingPacket.buffer;
    }
}