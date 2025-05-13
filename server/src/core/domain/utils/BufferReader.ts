export default class BufferReader 
{
    private readonly dataview: DataView;

    public get buffer(): Buffer {
        return Buffer.from(this.dataview.buffer.slice(this.dataview.byteOffset, this.dataview.byteOffset + this.dataview.byteLength));
    }

    private offset: number = 0;

    
    constructor(
        buffer: Buffer
    ) {
        this.dataview = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    


    public readByte(): number 
    {
        const value = this.dataview.getInt8(this.offset);
        this.offset++;

        return value;
    }

    public readShort(littleEndian: boolean = true): number {
        const value = this.dataview.getInt16(this.offset, littleEndian);
        this.offset += 2; 

        return value;
    }

    public readInt(littleEndian: boolean = true): number {
        const value = this.dataview.getInt32(this.offset, littleEndian);
        this.offset += 4; 
        
        return value;
    }

    public readFloat32(littleEndian: boolean = true): number {
        const value = this.dataview.getFloat32(this.offset, littleEndian);
        this.offset += 4;

        return value;
    }

    public readBoolean(): boolean {
        const value = this.dataview.getUint8(this.offset);
        this.offset++;

        return value === 1;
    }

    public readBuffer(): Buffer
    {
        const length = this.readInt();

        const buffer = new Uint8Array(length)
        for(let index = 0; index < length; index++)
        {
            const currentByte = this.readByte();
            buffer[index] = currentByte;
        }

        return Buffer.from(buffer);
    }

    public readString(): string {
        const decoder = new TextDecoder();
        
        return decoder.decode(this.readBuffer());
    }

    public readNumber(littleEndian: boolean = true): number {
        return this.readFloat32(littleEndian);
    }

    public read<T>(type?: { new(...args: any[]): T } | Function): T {
        const resolvedType = type ?? Number;
        if (type === Number) return this.readFloat32() as T;
        if (type === String) return this.readString() as T;
        if (type === Boolean) return this.readBoolean() as T;
        if (type === Buffer) return this.readBuffer() as T;
    
        throw new Error("Unsupported type");
    }
}
