import Client from "./client/Client";
import SocketPacket from "./SocketPacket";

interface OutgoingPacketBuilderInterface {
    id: number;

    build(client: Client, ... data: unknown[]): Promise<SocketPacket>
}

export default OutgoingPacketBuilderInterface;