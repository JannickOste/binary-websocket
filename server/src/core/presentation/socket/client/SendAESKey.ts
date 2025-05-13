import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import Client from "../../../domain/socket/Client";
import ClientPacket from "../../../domain/socket/ClientPacket";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import BufferReader from "../../../domain/utils/BufferReader";

@provide(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface, bindingScopeValues.Singleton)
export default class SendAESKey implements IncommingPacketProcessorInterface {
    id: number = ClientPacket.SendAESKey;

    async process(client: Client, packetReader: BufferReader): Promise<void> {
        const key = packetReader.readBuffer();

        client.aesKey = key; 
    }
}