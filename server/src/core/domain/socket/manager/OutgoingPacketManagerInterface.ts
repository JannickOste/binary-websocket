import Client from "../Client";
import ServerPacket from "../ServerPacket";

export default interface OutgoingPacketManagerInterface {
    dispatchToClient(client: Client, id: ServerPacket, ...data: unknown[]): Promise<void>;
    dispatchToAll(id: ServerPacket, ...data: unknown[]): Promise<void>;
}
