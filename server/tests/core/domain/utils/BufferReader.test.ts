import BufferReader from "../../../../src/core/domain/utils/BufferReader";

class TestBufferReader extends BufferReader {
    public readByte() { return super.readByte(); }
    public readShort(le?: boolean) { return super.readShort(le); }
    public readInt(le?: boolean) { return super.readInt(le); }
    public readFloat32(le?: boolean) { return super.readFloat32(le); }
    public readBoolean() { return super.readBoolean(); }
    public readBuffer() { return super.readBuffer(); }
    public readString() { return super.readString(); }
}

describe('BufferReader', () => {
    test('constructor initializes buffer correctly', () => {
        const buffer = Buffer.from([0x01, 0x02, 0x03]);
        const reader = new TestBufferReader(buffer);
        
        expect(reader.buffer.equals(buffer)).toBe(true);

    });

    test('readByte returns correct value', () => {
        const buffer = Buffer.from([0x80, 0x7F]);
        const reader = new TestBufferReader(buffer);

        expect(reader.readByte()).toBe(-128);
        expect(reader.readByte()).toBe(127);
    });

    test("readShort returns correct little endian value", () => {
        const buffer = Buffer.from([0x00, 0x80, 0xFF, 0x7F]);
        const reader = new TestBufferReader(buffer);
        const littleEndian = true;

        const [min, max] = [reader.readShort(littleEndian), reader.readShort(littleEndian)];

        expect(min).toBe(-32768);
        expect(max).toBe(32767);
    });

    test("readShort returns correct big endian value", () => {
        const buffer = Buffer.from([0x80, 0x00,
            0x7F, 0xFF]);
        const reader = new TestBufferReader(buffer);
        const littleEndian = false;

        const [min, max] = [reader.readShort(littleEndian), reader.readShort(littleEndian)];

        expect(min).toBe(-32768);
        expect(max).toBe(32767);
    });

    test("readInt returns correct little endian value", () => {
        const buffer = Buffer.from([0x00, 0x00, 0x00, 0x80,
            0xFF, 0xFF, 0xFF, 0x7F]);

        const reader = new TestBufferReader(buffer);
        const littleEndian = true;

        const [min, max] = [reader.readInt(littleEndian), reader.readInt(littleEndian)];

        expect(min).toBe(-2147483648);
        expect(max).toBe(2147483647);
    });

    test("readInt returns correct big endian value", () => {
        const buffer = Buffer.from([0x80, 0x00, 0x00, 0x00,
            0x7F, 0xFF, 0xFF, 0xFF]);

        const reader = new TestBufferReader(buffer);
        const littleEndian = false;

        const [min, max] = [reader.readInt(littleEndian), reader.readInt(littleEndian)];

        expect(min).toBe(-2147483648);
        expect(max).toBe(2147483647);
    });

    test("readFloat32 returns correct little endian value", () => {
        const buffer = Buffer.from([
            0x00, 0x00, 0x80, 0xBF,
            0x00, 0x00, 0x80, 0x3F
        ]);

        const reader = new TestBufferReader(buffer);
        const littleEndian = true;

        const [min, max] = [reader.readFloat32(littleEndian), reader.readFloat32(littleEndian)];

        expect(min).toBe(-1.0);
        expect(max).toBe(1.0);
    });

    test("readFloat32 returns correct big endian value", () => {
        const buffer = Buffer.from([
            0xBF, 0x80, 0x00, 0x00,
            0x3F, 0x80, 0x00, 0x00
        ]);

        const reader = new TestBufferReader(buffer);
        const littleEndian = false;

        const [min, max] = [reader.readFloat32(littleEndian), reader.readFloat32(littleEndian)];

        expect(min).toBeCloseTo(-1.0);
        expect(max).toBeCloseTo(1.0);
    });

    test("readBoolean returns correct value", () => {
        const buffer = Buffer.from([0x00, 0x01]);
        const reader = new TestBufferReader(buffer);

        expect(reader.readBoolean()).toBe(false);
        expect(reader.readBoolean()).toBe(true);
    });

    test("readBuffer returns correct value", () => {
        const buffer = Buffer.from([
            0x03, 0x00, 0x00, 0x00,
            0x61, 0x62, 0x63       
        ]);
    
        const reader = new TestBufferReader(buffer);
        const result = reader.readBuffer();
    
        expect(result.equals(Buffer.from('abc'))).toBe(true);
    });

    test("readString returns correct value", () => {
        const buffer = Buffer.from([
            0x03, 0x00, 0x00, 0x00,
            0x61, 0x62, 0x63       
        ]);
    
        const reader = new TestBufferReader(buffer);
        const result = reader.readString();
    
        expect(result).toBe('abc');
    });

    test("read(Number) returns correct value", () => {
        const buffer = Buffer.from([
            0x00, 0x00, 0x80, 0xBF
        ]);

        const reader = new TestBufferReader(buffer);
        const result = reader.read(Number);

        expect(result).toBe(-1);
    });

    test("read(String) returns correct value", () => {
        const buffer = Buffer.from([
            0x03, 0x00, 0x00, 0x00,
            0x61, 0x62, 0x63       
        ]);
    
        const reader = new TestBufferReader(buffer);
        const result = reader.read(String);
    
        expect(result).toBe('abc');
    });

    test("read(Boolean) returns correct value", () => {
        const buffer = Buffer.from([0x00, 0x01]);
        const reader = new TestBufferReader(buffer);

        expect(reader.read(Boolean)).toBe(false);
        expect(reader.read(Boolean)).toBe(true);
    });

    test("read(Buffer) returns correct value", () => {
        const buffer = Buffer.from([
            0x03, 0x00, 0x00, 0x00,
            0x61, 0x62, 0x63       
        ]);
    
        const reader = new TestBufferReader(buffer);
        const result = reader.read(Buffer);
    
        expect(result.equals(Buffer.from('abc'))).toBe(true);
    });

    test("read() throws error for unknown type", () => {
        const buffer = Buffer.from([0x00, 0x01]);
        const reader = new TestBufferReader(buffer);

        expect(() => reader.read(Object)).toThrow("Unsupported type");
    });
});