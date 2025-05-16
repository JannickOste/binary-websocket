import { bindingScopeValues, inject } from "inversify";
import AESInterface from "../../../domain/crypt/AESInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import types from "../../../../di";
import Client from "../../../domain/socket/client/Client";
import BufferWriter from "../../../domain/utils/BufferWriter";

@provide(types.Core.Infrastructure.Socket.Parser.OutgoingContentParserInterface, bindingScopeValues.Singleton)
export default class OutgoingContentParser { 

    constructor(
        @inject(types.Core.Infrastructure.Crypt.IAESInterface) private readonly aes: AESInterface,
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {}
    
    public parse(client: Client, packet: SocketPacket): Buffer 
    {
        let output = packet.buffer.subarray(0, packet.currentOffset)
        
        if(AES.ALLOWED_MODES.includes(packet.encryption))
        {
            const {data, iv, tag} = this.aes.encrypt(output, client.aesKey);
            const bufferLength = (data.byteLength+4)+(iv.byteLength+4)+(tag ? tag.byteLength+4 : 0)
            const writer = new BufferWriter(Buffer.alloc(bufferLength))
            writer.writeBuffer(iv);
            writer.writeBuffer(data);
            if(tag)
            {
                writer.writeBuffer(tag)
            }
            
            output = writer.buffer;
        }

        if(RSA.ALLOWED_MODES.includes(packet.encryption))
        {
            output = this.rsa.encrypt(output, client.rsaKey)
        }
        
        return output;
    }
}