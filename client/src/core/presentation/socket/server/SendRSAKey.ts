import { bindingScopeValues, inject, LazyServiceIdentifier } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/socket/client/ClientPacket";
import BufferReader from "../../../domain/utils/BufferReader";
import types from "../../../../di";
import OutgoingPacketManager from "../../../infrastructure/socket/manager/OutgoingPacketManager";

@provide(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface, bindingScopeValues.Singleton)
export default class SendRSAKey implements IncommingPacketProcessorInterface {
    id = ClientPacket.SendRSAKey;
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface)
        private readonly rsa: RSAInterface,
    ) {
    }

    async process(packetReader: BufferReader): Promise<void> {
        this.rsa.publicServerKey = packetReader.readString();
        
        OutgoingPacketManager.Singleton.dispatchToServer(ClientPacket.SendRSAKey)
    }
}
