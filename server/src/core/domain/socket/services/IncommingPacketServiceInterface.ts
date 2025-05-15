import Client from "../client/Client";
import IncommingSocketPacket from "../packet/IncommingSocketPacket";
import SocketPacket from "../packet/SocketPacket";

interface IncommingPacketServiceInterface {
    parsePacket(client: Client, packet: SocketPacket): IncommingSocketPacket
}

export default IncommingPacketServiceInterface;