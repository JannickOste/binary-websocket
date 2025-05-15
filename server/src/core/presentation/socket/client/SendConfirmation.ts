import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import { provide } from "../../../domain/decorators/provide";
import Client from "../../../domain/socket/client/Client";
import ClientPacket from "../../../domain/socket/client/ClientPacket";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import BufferReader from "../../../domain/utils/BufferReader";

@provide(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface, bindingScopeValues.Singleton)
export default class SendConfirmation implements IncommingPacketProcessorInterface {
    id: number = ClientPacket.SendConfirmation;

    async process(client: Client, packetReader: BufferReader): Promise<void> {
        const confirmationCode = packetReader.readBuffer();

        if(Buffer.compare(confirmationCode, client.confirmationCode) !== 0)
        {
            return client.socket.terminate();
        }

        console.log(`${client.id} RSA/AES key sync was succesfull`)
    }
}