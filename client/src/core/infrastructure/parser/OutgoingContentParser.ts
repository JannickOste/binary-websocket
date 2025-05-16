import { bindingScopeValues, inject } from "inversify";
import SocketPacket from "../../domain/socket/packet/SocketPacket";
import BufferWriter from "../../domain/utils/BufferWriter";
import AES from "../crypt/AES";
import RSA from "../crypt/RSA";
import types from "../../../di";
import AESInterface from "../../domain/crypt/AESInterface";
import RSAInterface from "../../domain/crypt/RSAInterface";
import { provide } from "../../domain/decorators/provide";

@provide(types.Core.Infrastructure.Socket.Parser.OutgoingContentParserInterface, bindingScopeValues.Singleton)
export default class OutgoingContentParser { 

    constructor(
        @inject(types.Core.Infrastructure.Crypt.IAESInterface) private readonly aes: AESInterface,
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {}
    
    public parse(packet: SocketPacket): Buffer 
    {
        const body = packet.buffer.subarray(0, packet.currentOffset)
        
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

        return outgoingPacket.buffer.subarray(0, outgoingPacket.currentOffset)
    }
}