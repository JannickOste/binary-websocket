import ClientPacket from "../ClientPacket";

export default interface OutgoingPacketManagerInterface {
    dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void>;
}
