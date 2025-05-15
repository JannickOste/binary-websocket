import Client from "../client/Client";

interface IncommingPacketManagerInterface {  
    processPacket(client: Client, data: Buffer): Promise<void>;
}

export default IncommingPacketManagerInterface;