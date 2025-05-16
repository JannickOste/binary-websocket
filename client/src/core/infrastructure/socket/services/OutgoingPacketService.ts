import { multiInject, inject, bindingScopeValues } from "inversify";
import AESInterface from "../../../domain/crypt/AESInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import WebSocketClientInterface from "../../../domain/socket/WebSocketClientInterface";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import OutgoingHeaderParser from "../../parser/OutgoingHeaderParser";
import OutgoingContentParser from "../../parser/OutgoingContentParser";
import BufferWriter from "../../../domain/utils/BufferWriter";

@provide(types.Core.Infrastructure.Socket.Services.OutgoingSocketPacketService, bindingScopeValues.Singleton)
export default class OutgoingPacketService implements OutgoingPacketService { 
    constructor(
        @inject(types.Core.Infrastructure.Socket.Parser.OutgoingContentParserInterface) private readonly content: OutgoingContentParser,
        @inject(types.Core.Infrastructure.Socket.Parser.OutgoingHeaderParserInterface) private readonly header: OutgoingHeaderParser,
        @inject(types.Core.Infrastructure.Socket.WebSocketClient) private readonly client: WebSocketClientInterface
    ) {
    }

    public parseBufferFromPacket(packet: SocketPacket): Buffer {
        const headerBuffer = this.header.parse(packet)
        const bodyBuffer = this.content.parse(packet)
        
        const outgoingPacket = new BufferWriter(Buffer.alloc(headerBuffer.byteLength+bodyBuffer.byteLength+8))
        outgoingPacket.writeBuffer(headerBuffer)
        outgoingPacket.writeBuffer(bodyBuffer)
        return  outgoingPacket.buffer.subarray(0, outgoingPacket.currentOffset);
    }
}