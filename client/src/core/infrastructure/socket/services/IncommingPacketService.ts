import { bindingScopeValues, inject } from "inversify";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import IncommingSocketPacket from "../../../domain/socket/packet/IncommingSocketPacket";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import IncommingPacketServiceInterface from "../../../domain/socket/services/IncommingPacketServiceInterface";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import ServerPacket from "../../../domain/socket/ServerPacket";
import IncommingHeaderParserInterface from "../../../domain/socket/parsers/IncommingHeaderParserInterface";
import IncommingContentParserInterface from "../../../domain/socket/parsers/IncommingContentParserInterface";

@provide(types.Core.Infrastructure.Socket.Services.IncommingSocketPacketService, bindingScopeValues.Singleton)
export default class IncommingPacketService implements IncommingPacketServiceInterface { 

    constructor(
        @inject(types.Core.Infrastructure.Socket.Parser.IncommingHeaderParserInterface) private readonly headerParser: IncommingHeaderParserInterface,
        @inject(types.Core.Infrastructure.Socket.Parser.IncommingContentParserInterface) private readonly contentParser: IncommingContentParserInterface
    ) {}

    public parsePacket(packet: Buffer): IncommingSocketPacket
    {
        const header = this.headerParser.parse(packet);
        if(!Object.values(ServerPacket).includes(header.id))
        {
            throw new Error("Invalid client packet received");
        }

        if(!Object.values(EncryptionType).includes(header.encryption as EncryptionType))
        {
            throw new Error("Invalid encryption type received from client");
        }

        const packetPayload = packet.subarray(header.headerSize);
        const packetContent =  this.contentParser.parse(header.encryption as EncryptionType, packetPayload);
        return {
            header: header,
            content: packetContent
        }
    }
}