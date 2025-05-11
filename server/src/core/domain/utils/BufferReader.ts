export default class BufferReader 
{
    private readonly dataview: DataView;
    public get buffer(): Buffer {
        return Buffer.from(this.dataview.buffer);
    }

    private offset: number = 0;

    
    constructor(
        buffer: Buffer
    ) {
        this.dataview = new DataView(Buffer.from(buffer).buffer);
    }


    protected readByte(): number 
    {
        const value = this.dataview.getInt8(this.offset);
        this.offset++;

        return value;
    }

    protected readShort(littleEndian: boolean = true): number {
        const value = this.dataview.getInt16(this.offset, littleEndian);
        this.offset += 2; 

        return value;
    }

    protected readInt(littleEndian: boolean = true): number {
        const value = this.dataview.getInt32(this.offset, littleEndian);
        this.offset += 4; 
        
        return value;
    }

    protected readFloat32(littleEndian: boolean = true): number {
        const value = this.dataview.getFloat32(this.offset, littleEndian);
        this.offset += 4;

        return value;
    }

    protected readBoolean(): boolean {
        const value = this.dataview.getUint8(this.offset);
        this.offset++;

        return value === 1;
    }

    protected readBuffer(): Buffer
    {
        const length = this.readInt();
        console.dir(length)
        const buffer = new Uint8Array(length)
        for(let index = 0; index < length; index++)
        {
            const currentByte = this.readByte();
            buffer[index] = currentByte;
        }

        return Buffer.from(buffer);
    }

    protected readString(): string {
        const decoder = new TextDecoder();
        
        return decoder.decode(this.readBuffer());
    }

    public read<T>(type: { new(...args: any[]): T } | Function): T {
        if (type === Number) return this.readFloat32() as T;
        if (type === String) return this.readString() as T;
        if (type === Boolean) return this.readBoolean() as T;
        if (type === Buffer) return this.readBuffer() as T;
    
        throw new Error("Unsupported type");
    }
}
