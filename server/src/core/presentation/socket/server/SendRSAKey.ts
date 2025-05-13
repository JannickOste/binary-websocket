import EncryptionType from "../../../domain/crypt/EncryptionType";
import Client from "../../../domain/socket/Client";
import OutgoingPacketBuilderInterface from "../../../domain/socket/OutgoingPacketBuilderInterface";
import ServerPacket from "../../../domain/socket/ServerPacket";
import SocketPacket from "../../../domain/socket/SocketPacket";

export default class SendRSAKey extends SocketPacket implements OutgoingPacketBuilderInterface
{
    constructor(){
        super(
            ServerPacket.SendRSAKey, 
            EncryptionType.NONE
        );
    }

    async build(client: Client, ...data: unknown[]): Promise<SocketPacket> {
        
        return this;
    }
    
}