import Client from "../../../domain/socket/Client";
import ClientPacket from "../../../domain/socket/ClientPacket";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import BufferReader from "../../../domain/utils/BufferReader";

export default class SendRSAKey implements IncommingPacketProcessorInterface {
    id: number = ClientPacket.SendRSAKey;

    async process(client: Client, packetReader: BufferReader): Promise<void> {
        const key = packetReader.readString();

        client.rsaKey = key; 
    }
}