import BufferReader from "../utils/BufferReader";
import Client from "./Client";

interface IncommingPacketProcessorInterface {
    id: number;
    
    process(client: Client, packetReader: BufferReader): Promise<void>
}

export default IncommingPacketProcessorInterface; 
