export default class BufferWriter {
    private readonly dataview: DataView;

    public get buffer(): Buffer {
        return Buffer.from(this.dataview.buffer.slice(this.dataview.byteOffset, this.dataview.byteOffset + this.dataview.byteLength));
    }

    private offset: number = 0;
    public get currentOffset(): number { 
        return this.offset;
    }

    constructor(
        buffer: Buffer 
    ) {
        this.dataview = new DataView(buffer.buffer, buffer.byteOffset, buffer.length);
    }

    protected assertBufferSize(size: number): void { 

        if (this.offset + size > this.dataview.byteLength) {
            throw new Error("BufferOverflow: Not enough space in buffer to write data");
        }
    }

    protected writeByte(value: number): void 
    {
        this.assertBufferSize(1);
        this.dataview.setInt8(this.offset, value);
        this.offset++;
    }

    protected writeShort(value: number, littleEndian: boolean = true): void {
        this.assertBufferSize(2);

        this.dataview.setInt16(this.offset, value, littleEndian);
        this.offset += 2;
    }

    protected writeInt(value: number, littleEndian: boolean = true): void {
        this.assertBufferSize(4);
        
        this.dataview.setInt32(this.offset, value, littleEndian);
        this.offset += 4;
    }

    protected writeFloat32(value: number, littleEndian: boolean = true): void {
        this.assertBufferSize(4);

        this.dataview.setFloat32(this.offset, value, littleEndian);
        this.offset += 4;
    }

    protected writeFloat64(value: number, littleEndian: boolean = true): void {
        this.assertBufferSize(8);

        this.dataview.setFloat64(this.offset, value, littleEndian);
        this.offset += 8;
    }
    
    protected writeBoolean(value: boolean): void {
        this.assertBufferSize(1);

        this.dataview.setUint8(this.offset, value ? 1 : 0);
        this.offset++;
    }

    protected writeBuffer(value: Buffer): void 
    {
        this.assertBufferSize(value.byteLength + 4);

        this.writeInt(value.byteLength);
        for(const byte of value)
        {
            this.writeByte(byte);
        }
    }

    protected writeString(value: string): void {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);

        this.writeBuffer(Buffer.from(encoded.buffer))
    }

    public write<T>(value: T, littleEndian: boolean = true): void {
        if (typeof value === "number") return this.writeFloat32(value, littleEndian);
        if (typeof value === "boolean") return this.writeBoolean(value);
        if (typeof value === "string") return this.writeString(value);
        if (value instanceof Date) return this.writeFloat64(value.getTime(), littleEndian);
        if (value instanceof Buffer || value instanceof Uint8Array) return this.writeBuffer(Buffer.from(value));
    
        throw new Error(`Unsupported type for writing: ${typeof value}`);
    }
}
