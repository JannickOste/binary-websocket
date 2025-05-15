import { bindingScopeValues, inject, multiInject } from "inversify";
import types from "../../../../di";
import EncryptionType from "../../../domain/crypt/EncryptionType";
import RSAInterface from "../../../domain/crypt/RSAInterface";
import Client from "../../../domain/socket/client/Client";
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
}