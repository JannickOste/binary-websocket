export default class BufferWriter {
    private offset: number = 0;
    public get currentOffset(): number { 
        return this.offset;
    }

    constructor(
        public readonly buffer: Buffer 
    ) {
    }

    protected assertWithinRange(size: number): void { 

        if (this.offset + size > this.buffer.byteLength) {
            throw new Error("BufferOverflow: Not enough space in buffer to write data");
        }
    }

    public writeByte(byte: number): void 
    {
        this.assertWithinRange(1);

        this.buffer[this.offset++] = (byte < 128 ? byte - 256 : byte);
    }

    public writeBoolean(value: boolean): void {
        this.writeByte(Number(value))
    }

    public writeShort(value: number, littleEndian: boolean = true): void {
        this.assertWithinRange(2);

        if(littleEndian) this.buffer.writeInt16LE(value, this.offset)
        else this.buffer.writeInt16BE(value, this.offset);

        this.offset += 2;
    }

    public writeUShort(value: number, littleEndian: boolean = true)
    {
        this.assertWithinRange(2)

        if(littleEndian) this.buffer.writeUint16LE(value, this.offset)
        else this.buffer.writeUint16BE(value, this.offset);

        this.offset += 2; 
    }

    public writeInt(value: number, littleEndian: boolean = true): void {
        this.assertWithinRange(4);

        if(littleEndian) this.buffer.writeInt16LE(value, this.offset)
        else this.buffer.writeUint16BE(value, this.offset);

        this.offset += 4; 
    }

    public writeUInt(value: number, littleEndian: boolean = true)
    {
        this.assertWithinRange(4);

        if(littleEndian) this.buffer.writeUint16LE(value, this.offset)
        else this.buffer.writeUint16BE(value, this.offset);

        this.offset += 4; 
    }

    public writeFloat(value: number, littleEndian: boolean = true): void {
        this.assertWithinRange(4);

        if(littleEndian) this.buffer.writeFloatLE(value, this.offset)
        else this.buffer.writeFloatBE(value, this.offset);

        this.offset += 4;
    }

    public writeDouble(value: number, littleEndian: boolean = true) 
    {
        this.assertWithinRange(8);

        if(littleEndian) this.buffer.writeDoubleLE(value, this.offset)
        else this.buffer.writeDoubleBE(value, this.offset)
    
        this.offset += 8; 
    }

    public writeDate(value: Date, littleEndian: boolean = true)
    {
        this.writeDouble(value.getTime(), littleEndian)
    }
    

    public writeBuffer(value: Buffer): void 
    {
        this.assertWithinRange(value.byteLength + 4);

        this.writeInt(value.byteLength);
        for(const byte of value)
        {
            this.writeByte(byte);
        }
    }

    public writeString(value: string): void {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);

        this.writeBuffer(Buffer.from(encoded.buffer))
    }

    public write<T>(value: T, littleEndian: boolean = true): void {
        if (typeof value === "number") return this.writeFloat(value, littleEndian);
        if (typeof value === "boolean") return this.writeBoolean(value);
        if (typeof value === "string") return this.writeString(value);
        if (value instanceof Date) return this.writeDate(value);
        if (value instanceof Buffer || value instanceof Uint8Array) return this.writeBuffer(Buffer.from(value));
    
        throw new Error(`Unsupported type for writing: ${typeof value}`);
    }
}
