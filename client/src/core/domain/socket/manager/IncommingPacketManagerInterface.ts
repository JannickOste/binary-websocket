import BufferReader from "../../utils/BufferReader";
import Client from "../Client";

interface IncommingPacketManagerInterface {  
    processPacket(data: Buffer): Promise<void>;
}

export default IncommingPacketManagerInterface;