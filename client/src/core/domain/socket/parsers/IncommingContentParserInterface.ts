import EncryptionType from "../../crypt/EncryptionType";
import SocketPacket from "../packet/SocketPacket";

interface IncommingContentParserInterface {
    parse(encryption: EncryptionType, content: Buffer): Buffer;
}

export default IncommingContentParserInterface;