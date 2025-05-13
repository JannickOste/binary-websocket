import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import { provide } from "../../../domain/decorators/provide";
import Client from "../../../domain/socket/Client";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import ServerPacket from "../../../domain/socket/ServerPacket";
import SocketPacket from "../../../domain/socket/SocketPacket";
import { inject } from "inversify";
import RSAInterface from "../../../domain/crypt/RSAInterface";

@provide(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface, bindingScopeValues.Singleton)
export default class SendConfirmation extends SocketPacket implements OutgoingPacketBuilderInterface
{
    constructor(
    ){
        super(
            ServerPacket.SendConfirmation, 
            EncryptionType.AES256CBC
        );
    }

    async build(client: Client, ...data: unknown[]): Promise<SocketPacket> {
        this.write(client.confirmationCode);
        
        return this;
    }
    
}