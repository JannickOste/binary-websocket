import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import SocketPacketHeader from "../../../domain/socket/packet/SocketPacketHeader";
import BufferReader from "../../../domain/utils/BufferReader";

@provide(types.Core.Infrastructure.Socket.Parser.IncommingHeaderParserInterface, bindingScopeValues.Singleton)
export default class IncommingHeaderParser implements IncommingHeaderParser
{ 
    public parse(packet: SocketPacket): SocketPacketHeader
    {
        const reader = new BufferReader(packet.buffer);

        const headerSize = reader.readNumber();
        const id: number = reader.readNumber();
        const encryption = reader.readString()

        return new SocketPacketHeader(
            id, 
            encryption,
            headerSize
        )
    }
}