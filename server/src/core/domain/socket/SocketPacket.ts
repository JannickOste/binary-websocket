import EncryptionType from "../crypt/EncryptionType";
import BufferWriter from "../utils/BufferWriter";

export default class SocketPacket extends BufferWriter 
{
    public static readonly HEADER_SIZE = 8;
    public static readonly MAX_PACKET_SIZE = 4096;
    public static readonly MAX_PAYLOAD_SIZE = SocketPacket.MAX_PACKET_SIZE - SocketPacket.HEADER_SIZE;

    constructor(
        id: number,
        encryption: EncryptionType,
    ) {
        super(Buffer.alloc(SocketPacket.MAX_PACKET_SIZE));

        this.writeInt(id);
        this.writeByte(encryption);
    }
}