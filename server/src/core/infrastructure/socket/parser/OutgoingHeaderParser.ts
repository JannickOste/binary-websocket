import { bindingScopeValues, inject } from "inversify";
import { provide } from "../../../domain/decorators/provide";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import BufferWriter from "../../../domain/utils/BufferWriter";
import types from "../../../../di";

@provide(types.Core.Infrastructure.Socket.Parser.OutgoingHeaderParserInterface, bindingScopeValues.Singleton)
export default class OutgoingHeaderParser { 
    public parse(packet: SocketPacket): Buffer 
    {
        const headerData = new BufferWriter(Buffer.alloc(2048));
        headerData.writeInt(packet.id);
        headerData.writeString(packet.encryption);

        return headerData.buffer.subarray(0, headerData.currentOffset);
    }
}