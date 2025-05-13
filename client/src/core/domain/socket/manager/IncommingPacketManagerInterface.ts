import Client from "../Client";

interface IncommingPacketManagerInterface {  
    processPacket(client: Client, data: Buffer): Promise<void>;
}

export default IncommingPacketManagerInterface;