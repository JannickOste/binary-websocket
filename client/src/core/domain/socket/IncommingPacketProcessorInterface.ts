import BufferReader from "../utils/BufferReader";

interface IncommingPacketProcessorInterface {
    id: number;
    
    process(packetReader: BufferReader): Promise<void>
}

export default IncommingPacketProcessorInterface; 
