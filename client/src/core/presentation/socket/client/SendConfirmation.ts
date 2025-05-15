import { bindingScopeValues, inject } from "inversify";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import Client from "../../../domain/socket/client/Client";
import ClientPacket from "../../../domain/socket/client/ClientPacket";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import BufferReader from "../../../domain/utils/BufferReader";
import types from "../../../../di";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import AESInterface from "../../../domain/crypt/AESInterface";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";

@provide(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface, bindingScopeValues.Singleton)
export default class SendConfirmation extends SocketPacket implements OutgoingPacketBuilderInterface {
    id: number = ClientPacket.SendConfirmation;

    constructor(
    )
    {
        super(
            ClientPacket.SendConfirmation,
            EncryptionType.AES256CBC
        );
    }

    async build(code: Buffer): Promise<SocketPacket> 
    {
        this.writeBuffer(code);

        return this;
    }
}