import EncryptionType from "../../crypt/EncryptionType";
import BufferWriter from "../../utils/BufferWriter";


export default class SocketPacket extends BufferWriter 
{
    public static readonly MAX_PACKET_SIZE = 4096;
    public static readonly MAX_PAYLOAD_SIZE = SocketPacket.MAX_PACKET_SIZE;
    public readonly headerSize: number = -1
    public static HEADER_SIZE = 12;

    constructor(
        public readonly id: number,
        public readonly encryption: EncryptionType,

    ) {
        super(Buffer.alloc(SocketPacket.MAX_PACKET_SIZE));

        this.writeInt(SocketPacket.HEADER_SIZE+encryption.length) // Temp header size not being properly written
        this.writeInt(id);
        this.writeString(encryption);

        this.headerSize = this.currentOffset;
        this.buffer.writeInt32LE(this.headerSize)
    }
}