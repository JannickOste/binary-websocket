import Client from "./Client";
import SocketPacket from "./SocketPacket";

interface OutgoingPacketBuilderInterface {
    id: number;

    build(... data: unknown[]): Promise<SocketPacket>
}

export default OutgoingPacketBuilderInterface;