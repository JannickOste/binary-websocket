import { bindingScopeValues, inject } from "inversify";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import Client from "../../../domain/socket/Client";
import ClientPacket from "../../../domain/socket/ClientPacket";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import BufferReader from "../../../domain/utils/BufferReader";
import types from "../../../../di";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import { provide } from "../../../domain/decorators/provide";
import SocketPacket from "../../../domain/socket/packet/SocketPacket";

@provide(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface, bindingScopeValues.Singleton)
export default class SendRSAKey extends SocketPacket implements OutgoingPacketBuilderInterface {
    id: number = ClientPacket.SendRSAKey;

    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    )
    {
        super(
            ClientPacket.SendRSAKey,
            EncryptionType.NONE
        );
    }

    async build(...data: unknown[]): Promise<SocketPacket> {
        this.writeString(this.rsa.publicKey);

        return this;
    }
}