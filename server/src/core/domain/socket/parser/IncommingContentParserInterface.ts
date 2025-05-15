import EncryptionType from "../../crypt/EncryptionType";
import Client from "../client/Client";
import SocketPacket from "../packet/SocketPacket";

interface IncommingContentParserInterface {
    parse(client: Client, encryption: EncryptionType, content: Buffer): Buffer;
}

export default IncommingContentParserInterface;