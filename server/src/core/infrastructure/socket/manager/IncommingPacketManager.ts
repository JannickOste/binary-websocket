import { bindingScopeValues, inject, multiInject } from "inversify";
import types from "../../../../di";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import Client from "../../../domain/socket/client/Client";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import IncommingPacketManagerInterface from "../../../domain/socket/manager/IncommingPacketManagerInterface";
import BufferReader from "../../../domain/utils/BufferReader";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import { provide } from "../../../domain/decorators/provide";

@provide(types.Core.Infrastructure.Socket.Manager.IncommingPacketManager, bindingScopeValues.Singleton)
export default class IncommingPacketManager implements IncommingPacketManagerInterface
{

    private readonly clientPacketHandlerMap: Map<number, IncommingPacketProcessorInterface> = new Map();

    constructor(
        @multiInject(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface) private readonly packetProcessors: IncommingPacketProcessorInterface[],
        @inject(types.Core.Infrastructure.Crypt.IRSAInterface) private readonly rsa: RSAInterface
    ) {
        this.packetProcessors.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));

    }


    public async processPacket(
        client: Client,
        data: Buffer
    ) {
        let packetReader = new BufferReader(data);
        const headerSize = packetReader.readInt()
        const id = packetReader.readInt()
        const encryption = packetReader.readString()
        if(!Object.values(EncryptionType).includes(encryption as EncryptionType))
        {
            client.socket.terminate();
            throw new Error("Invalid encryption type received")
        }



        console.log(`Packet received with id: ${id}, encryption: ${encryption}`)   
        const encryptionType: EncryptionType = encryption as EncryptionType;
        if(encryptionType !== EncryptionType.NONE)
        {
            if(AES.ALLOWED_MODES.includes(encryption))
            {
                const iv = packetReader.readBuffer();
                const data = packetReader.readBuffer();
                const tag = encryption === EncryptionType.AES256GCM ? packetReader.readBuffer() : undefined;

                packetReader = new BufferReader(client.aes.decrypt(data, iv, encryptionType, tag));
            }

            if(RSA.ALLOWED_MODES.includes(encryptionType))
            {
                const data = packetReader.readBuffer();

                packetReader = new BufferReader(this.rsa.decrypt(data))
            }
        }
         
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if (packetHandler) {
            packetHandler.process(client, packetReader);
            return;
        } 

        client.socket.close();
    }
}