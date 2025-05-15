import Client from "../client/Client";
import ServerPacket from "../server/ServerPacket";

export default interface OutgoingPacketManagerInterface {
    dispatchToClient(client: Client, id: ServerPacket, ...data: unknown[]): Promise<void>;
    dispatchToAll(id: ServerPacket, ...data: unknown[]): Promise<void>;
}
