import { bindingScopeValues, inject, multiInject } from "inversify";
import types from "../../../../di";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import Client from "../../../domain/socket/Client";
import IncommingPacketProcessorInterface from "../../../domain/socket/IncommingPacketProcessorInterface";
import OutgoingPacketManagerInterface from "../../../domain/socket/manager/OutgoingPacketManagerInterface";
import IncommingPacketManagerInterface from "../../../domain/socket/manager/IncommingPacketManagerInterface";
import BufferReader from "../../../domain/utils/BufferReader";
import AES from "../../crypt/AES";
import RSA from "../../crypt/RSA";
import { provide } from "../../../domain/decorators/provide";
import AESInterface from "../../../domain/crypt/AESInterface";
import IncommingPacketServiceInterface from "../../../domain/socket/services/IncommingPacketServiceInterface";

@provide(types.Core.Infrastructure.Socket.Manager.IncommingPacketManager, bindingScopeValues.Singleton)
export default class IncommingPacketManager implements IncommingPacketManagerInterface
{

    private readonly clientPacketHandlerMap: Map<number, IncommingPacketProcessorInterface> = new Map();

    constructor(
        @multiInject(types.Core.Infrastructure.Socket.IncommingPacketProcessorInterface) private readonly packetProcessors: IncommingPacketProcessorInterface[],
        @inject(types.Core.Infrastructure.Socket.Services.IncommingSocketPacketService) private readonly packetService: IncommingPacketServiceInterface
    ) {
        this.packetProcessors.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));

    }


    public async processPacket(
        data: Buffer
    ) {
        const packet = this.packetService.parsePacket(data);
        const packetHandler = this.clientPacketHandlerMap.get(packet.header.id);
        if (packetHandler) {
            packetHandler.process(new BufferReader(packet.content));
            return;
        } 
    }
    // public async processPacket(
    //     data: Buffer
    // ) {
    //     let packetReader = new BufferReader(data);
    //     const headerSize = packetReader.readInt();
    //     const id = packetReader.readInt()
    //     const encryption = packetReader.readString();

    //     if(encryption !== EncryptionType.NONE)
    //     {
    //         if(AES.ALLOWED_MODES.includes(encryption))
    //         {
    //             console.log("Decrypting RSA Packet")
    //             const iv = packetReader.readBuffer();
    //             const data = packetReader.readBuffer();
    //             const tag = encryption === EncryptionType.AES256GCM ? packetReader.readBuffer() : undefined;

    //             packetReader = new BufferReader(this.aes.decrypt(data, iv, tag));
    //         }

    //         if(RSA.ALLOWED_MODES.includes(encryption))
    //         {
    //             console.log("Decrypting RSA Packet")
    //             const data = packetReader.readBuffer();
    //             console.dir(packetReader.buffer)
    //             const decryptedData = this.rsa.decrypt(data);

    //             console.log(`${data.byteLength} => ${decryptedData.byteLength}`)

    //             packetReader = new BufferReader(decryptedData)
    //         }
    //     }
        
    //     console.log(`Packet received with id: ${id}, encryption: ${encryption}`)    
    //     const packetHandler = this.clientPacketHandlerMap.get(id);
    //     if (packetHandler) {
    //         packetHandler.process( packetReader);
    //         return;
    //     } 

    //     console.log("Failed to parse packet.");
    // }
}