import SocketPacket from "../packet/SocketPacket";
import SocketPacketHeader from "../packet/SocketPacketHeader";

interface IncommingHeaderParserInterface {
    parse(packet: Buffer): SocketPacketHeader
}

export default IncommingHeaderParserInterface;