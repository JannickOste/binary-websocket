import { bindingScopeValues, inject, LazyServiceIdentifier } from "inversify";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/socket/client/ClientPacket";
import BufferReader from "../../../domain/utils/BufferReader";
import types from "../../../../di";
import OutgoingPacketManager from "../../../infrastructure/socket/manager/OutgoingPacketManager";
import AESInterface from "../../../domain/crypt/AESInterface";
import ServerPacket from "../../../domain/socket/server/ServerPacket";

@provide(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface, bindingScopeValues.Singleton)
export default class SendConfirmation implements IncommingPacketProcessorInterface {
    id = ServerPacket.SendConfirmation;

    async process(packetReader: BufferReader): Promise<void> {
        const confirmationCode = packetReader.readBuffer();

        return await OutgoingPacketManager.Singleton.dispatchToServer(
            ClientPacket.SendConfirmation,
            confirmationCode
        )
    }
}
