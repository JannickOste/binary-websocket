import { bindingScopeValues } from "inversify";
import { inject } from "inversify";
import IncommingContentParserInterface from "../../domain/socket/parsers/IncommingContentParserInterface";
import RSAInterface from "../../domain/crypt/RSAInterface";
import types from "../../../di";
import EncryptionType from "../../domain/crypt/EncryptionType";
import BufferReader from "../../domain/utils/BufferReader";
import AES from "../crypt/AES";
import RSA from "../crypt/RSA";
import AESInterface from "../../domain/crypt/AESInterface";
import { provide } from "../../domain/decorators/provide";

@provide(types.Core.Infrastructure.Socket.Parser.IncommingContentParserInterface, bindingScopeValues.Singleton)
export default class IncommingContentParser implements IncommingContentParserInterface
{
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IAESInterface) private readonly aes: AESInterface,
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {}

    public parse(encryption: EncryptionType, content: Buffer): Buffer {
        let packetContent = content;

        if(encryption !== EncryptionType.NONE)
        {
            const packetContentReader = new BufferReader(packetContent);
            if(AES.ALLOWED_MODES.includes(encryption))
            {
                const iv = packetContentReader.readBuffer();
                const data = packetContentReader.readBuffer();
                const tag = encryption === EncryptionType.AES256GCM ? packetContentReader.readBuffer() : undefined;

                packetContent = this.aes.decrypt(data, iv, tag);
            }

            if(RSA.ALLOWED_MODES.includes(encryption))
            {
                packetContent = this.rsa.decrypt(packetContent);
            }
        }

        return packetContent;
    } 
}