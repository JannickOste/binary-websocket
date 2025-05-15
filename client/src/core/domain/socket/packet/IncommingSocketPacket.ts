import SocketPacketHeader from "./SocketPacketHeader";

interface IncomingSocketPacket {
    header: SocketPacketHeader;
    content: Buffer;
}

export default IncomingSocketPacket;