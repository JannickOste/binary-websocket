import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import SocketPacketHeader from "../../../domain/socket/packet/SocketPacketHeader";
import BufferReader from "../../../domain/utils/BufferReader";
import IncommingContentParserInterface from "../../../domain/socket/parser/IncommingContentParserInterface";
import Client from "../../../domain/socket/client/Client";
import RSA from "../../crypt/RSA";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import AES from "../../crypt/AES";
import { inject } from "inversify";
import RSAInterface from "../../../domain/crypt/RSAInterface";

@provide(types.Core.Infrastructure.Socket.Parser.IncommingContentParserInterface, bindingScopeValues.Singleton)
export default class IncommingContentParser implements IncommingContentParserInterface
{
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {}

    public parse(client: Client, encryption: EncryptionType, content: Buffer): Buffer {
        let packetContent = content;

        if(encryption !== EncryptionType.NONE)
        {
            const packetContentReader = new BufferReader(packetContent);
            if(AES.ALLOWED_MODES.includes(encryption))
            {
                const iv = packetContentReader.readBuffer();
                const data = packetContentReader.readBuffer();
                const tag = encryption === EncryptionType.AES256GCM ? packetContentReader.readBuffer() : undefined;

                packetContent = client.aes.decrypt(data, iv, encryption, tag);
            }

            if(RSA.ALLOWED_MODES.includes(encryption))
            {
                const data = packetContentReader.readBuffer();

                packetContent = this.rsa.decrypt(data);
            }
        }

        return packetContent;
    } 
}