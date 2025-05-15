import BufferReader from "../../utils/BufferReader";
import Client from "../client/Client";

interface IncommingPacketManagerInterface {  
    processPacket(data: Buffer): Promise<void>;
}

export default IncommingPacketManagerInterface;