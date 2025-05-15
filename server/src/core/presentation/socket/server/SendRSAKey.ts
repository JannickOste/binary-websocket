import { bindingScopeValues } from "inversify";
import types from "../../../../di";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import { provide } from "../../../domain/decorators/provide";
import Client from "../../../domain/socket/client/Client";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import ServerPacket from "../../../domain/socket/server/ServerPacket";
import SocketPacket from "../../../domain/socket/SocketPacket";
import { inject } from "inversify";
import RSAInterface from "../../../domain/crypt/RSAInterface";

@provide(types.Core.Infrastructure.Socket.OutgoingPacketBuilderInterface, bindingScopeValues.Singleton)
export default class SendRSAKey extends SocketPacket implements OutgoingPacketBuilderInterface
{
    constructor(
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsaInterface: RSAInterface
    ){
        super(
            ServerPacket.SendRSAKey, 
            EncryptionType.NONE
        );
    }

    async build(client: Client, ...data: unknown[]): Promise<SocketPacket> {
        this.write(this.rsaInterface.publicKey);
        
        return this;
    }
    
}