export default class BufferReader {
    private offset: number = 0;


    constructor(
        public readonly buffer: Buffer
    ) {

    }

    private assertWithinRange(byteLength: number) {
        if (this.offset + byteLength > this.buffer.byteLength) {
            throw new Error("BufferOverflow: Outside of buffer range");
        }
    }

    public readByte(): number {
        this.assertWithinRange(1);

        const byte = this.buffer[this.offset++];

        return byte < 128 ? byte
            : byte - 256;
    }

    public readUByte(): number {
        this.assertWithinRange(1);

        const byte = this.buffer[this.offset++];

        return byte;
    }

    public readBoolean(): boolean {
        this.assertWithinRange(1);

        const byte = this.buffer[this.offset++];

        if (![0, 1].includes(byte)) {
            throw new Error("BufferError: Failed to read byte, invalid value received");
        }

        return byte === 1;
    }

    public readShort(littleEndian: boolean = true): number {
        this.assertWithinRange(2);

        const short = littleEndian ? this.buffer.readInt16LE(this.offset)
            : this.buffer.readInt16BE(this.offset);

        this.offset += 2;

        return short;
    }

    public readUShort(littleEndian: boolean = true): number {
        this.assertWithinRange(2);

        const ushort = littleEndian ? this.buffer.readUInt16LE(this.offset)
            : this.buffer.readUInt16BE(this.offset);

        this.offset += 2;

        return ushort;
    }

    public readInt(littleEndian: boolean = true): number {
        this.assertWithinRange(4);

        const int = littleEndian ? this.buffer.readInt32LE(this.offset)
            : this.buffer.readInt32BE(this.offset);

        this.offset += 4;

        return int;
    }

    public readUInt(littleEndian: boolean = true): number {
        this.assertWithinRange(4);

        const uint = littleEndian ? this.buffer.readUInt32LE(this.offset)
            : this.buffer.readUInt32BE(this.offset);

        this.offset += 4;

        return uint;
    }

    public readFloat(littleEndien: boolean = true): number {
        this.assertWithinRange(4);

        const float32 = littleEndien ? this.buffer.readFloatLE(this.offset)
            : this.buffer.readFloatBE(this.offset);

        this.offset += 4;

        return float32;
    }


    public readBuffer(): Buffer {
        const length = this.readInt();

        const buffer = new Uint8Array(length)
        for (let index = 0; index < length; index++) {
            const currentByte = this.readByte();
            buffer[index] = currentByte;
        }

        return Buffer.from(buffer);
    }

    public readString(encoding: BufferEncoding = "utf-8"): string {
        const decoder = new TextDecoder(encoding);

        return decoder.decode(this.readBuffer());
    }

    public readNumber(littleEndian: boolean = true): number {
        return this.readFloat(littleEndian);
    }
}
