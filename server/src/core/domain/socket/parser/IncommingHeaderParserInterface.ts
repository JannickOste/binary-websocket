import SocketPacket from "../packet/SocketPacket";
import SocketPacketHeader from "../packet/SocketPacketHeader";

interface IncommingHeaderParserInterface {
    parse(packet: SocketPacket): SocketPacketHeader
}

export default IncommingHeaderParserInterface;