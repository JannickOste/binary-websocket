import { bindingScopeValues } from "inversify";
import { provide } from "../../domain/decorators/provide";
import types from "../../../di";
import IncommingHeaderParserInterface from "../../domain/socket/parsers/IncommingHeaderParserInterface";
import SocketPacketHeader from "../../domain/socket/packet/SocketPacketHeader";
import BufferReader from "../../domain/utils/BufferReader";

@provide(types.Core.Infrastructure.Socket.Parser.IncommingHeaderParserInterface, bindingScopeValues.Singleton)
export default class IncommingHeaderParser implements IncommingHeaderParserInterface
{ 
    public parse(buffer: Buffer): SocketPacketHeader
    {
        const reader = new BufferReader(buffer);

        const id: number = reader.readInt();
        const encryption = reader.readString()

        return new SocketPacketHeader(
            id, 
            encryption
        )
    }
}