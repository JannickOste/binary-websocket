import IncommingSocketPacket from "../packet/IncommingSocketPacket";

interface IncommingPacketServiceInterface {
    parsePacket(packet: Buffer): IncommingSocketPacket
}

export default IncommingPacketServiceInterface;