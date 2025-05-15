import Client from "../client/Client";
import IncommingSocketPacket from "../packet/IncommingSocketPacket";

interface IncommingPacketServiceInterface {
    parsePacket(client: Client, packet: Buffer): IncommingSocketPacket
}

export default IncommingPacketServiceInterface;