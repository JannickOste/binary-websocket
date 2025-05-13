import { bindingScopeValues, inject, LazyServiceIdentifier } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/socket/ClientPacket";
import BufferReader from "../../../domain/utils/BufferReader";
import types from "../../../../di";
import OutgoingPacketManager from "../../../infrastructure/socket/manager/OutgoingPacketManager";
import AESInterface from "../../../domain/crypt/AESInterface";

@provide(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface, bindingScopeValues.Singleton)
export default class SendAESKey implements IncommingPacketProcessorInterface {
    id = ClientPacket.SendAESKey;
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface)
        private readonly aes: AESInterface,
    ) {
    }

    async process(packetReader: BufferReader): Promise<void> {
        this.aes.serverKey = packetReader.readBuffer();
        
        return await OutgoingPacketManager.Singleton.dispatchToServer(ClientPacket.SendAESKey)
    }
}
