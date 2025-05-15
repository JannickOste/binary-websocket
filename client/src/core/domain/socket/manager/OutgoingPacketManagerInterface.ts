import ClientPacket from "../client/ClientPacket";

export default interface OutgoingPacketManagerInterface {
    dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void>;
}
