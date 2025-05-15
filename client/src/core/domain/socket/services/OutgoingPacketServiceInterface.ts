import SocketPacket from "../packet/SocketPacket";

interface OutgoingPacketServiceInterface {
    parseBufferFromPacket(packet: SocketPacket): Buffer
}

export default OutgoingPacketServiceInterface;