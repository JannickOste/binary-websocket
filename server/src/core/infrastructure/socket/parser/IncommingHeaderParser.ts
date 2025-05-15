import SocketPacket from "../../../domain/socket/packet/SocketPacket";
import SocketPacketHeader from "../../../domain/socket/packet/SocketPacketHeader";
import BufferReader from "../../../domain/utils/BufferReader";

export default class IncommingHeaderParser 
{ 
    public parse(packet: SocketPacket): SocketPacketHeader
    {
        const reader = new BufferReader(packet.buffer);

        const id: number = reader.readNumber();
        const encryption = reader.readString()

        return new SocketPacketHeader(
            id, 
            encryption
        )
    }
}