import BufferReader from "../utils/BufferReader";
import Client from "./client/Client";

interface IncommingPacketProcessorInterface {
    id: number;
    
    process(client: Client, packetReader: BufferReader): Promise<void>
}

export default IncommingPacketProcessorInterface; 
