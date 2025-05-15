import BufferReader from "../../../../src/core/domain/utils/BufferReader";

describe('BufferReader', () => {
    describe("constructor", () => {
        test('initializes buffer correctly', () => {
            const buffer = Buffer.from([0x01, 0x02, 0x03]);
            const reader = new BufferReader(buffer);
            expect(reader.buffer.equals(buffer)).toBe(true);
        });
    });

    describe("readByte", () => {
        test('returns correct signed value for negative byte', () => {
            const buffer = Buffer.from([0x80]);
            const reader = new BufferReader(buffer);
            expect(reader.readByte()).toBe(-128);
        });

        test('returns correct signed value for positive byte', () => {
            const buffer = Buffer.from([0x7F]);
            const reader = new BufferReader(buffer);
            expect(reader.readByte()).toBe(127);
        });

        test('returns correct signed value for zero', () => {
            const buffer = Buffer.from([0x00]);
            const reader = new BufferReader(buffer);
            expect(reader.readByte()).toBe(0);
        });

        test('throws BufferOverflow error if buffer is empty', () => {
            const buffer = Buffer.from([]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readByte()).toThrow();
        });
    });

    describe("readUByte", () => {
        test('returns correct value', () => {
            const buffer = Buffer.from([0x80]);
            const reader = new BufferReader(buffer);
            expect(reader.readUByte()).toBe(128);
        });

        test('returns correct signed value for zero', () => {
            const buffer = Buffer.from([0x00]);
            const reader = new BufferReader(buffer);
            expect(reader.readUByte()).toBe(0);
        });

        test('throws BufferOverflow error if buffer is empty', () => {
            const buffer = Buffer.from([]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readUByte()).toThrow();
        });
    });

    describe("readShort", () => {
        test("returns correct little endian value", () => {
            const buffer = Buffer.from([0x00, 0x80, 0xFF, 0x7F]);
            const reader = new BufferReader(buffer);
            const littleEndian = true;
            const [min, max] = [reader.readShort(littleEndian), reader.readShort(littleEndian)];
            expect(min).toBe(-32768);
            expect(max).toBe(32767);
        });

        test("returns correct big endian value", () => {
            const buffer = Buffer.from([0x80, 0x00, 0x7F, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = false;
            const [min, max] = [reader.readShort(littleEndian), reader.readShort(littleEndian)];
            expect(min).toBe(-32768);
            expect(max).toBe(32767);
        });

        test("throws BufferOverflow error if buffer is too small", () => {
            const buffer = Buffer.from([0x01]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readShort()).toThrow();
        });
    });

    describe("readUShort", () => {
        test("returns correct little endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0xFF, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = true;
            const [min, max] = [reader.readUShort(littleEndian), reader.readUShort(littleEndian)];
            expect(min).toBe(0);
            expect(max).toBe(65535);
        });
    
        test("returns correct big endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0xFF, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = false;
            const [min, max] = [reader.readUShort(littleEndian), reader.readUShort(littleEndian)];
            expect(min).toBe(0);
            expect(max).toBe(65535);
        });
    
        test("throws BufferOverflow error if buffer is too small", () => {
            const buffer = Buffer.from([0x01]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readUShort()).toThrow();
        });
    });    

    describe("readInt", () => {
        test("returns correct little endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x00, 0x80, 0xFF, 0xFF, 0xFF, 0x7F]);
            const reader = new BufferReader(buffer);
            const littleEndian = true;
            const [min, max] = [reader.readInt(littleEndian), reader.readInt(littleEndian)];
            expect(min).toBe(-2147483648);
            expect(max).toBe(2147483647);
        });

        test("returns correct big endian value", () => {
            const buffer = Buffer.from([0x80, 0x00, 0x00, 0x00, 0x7F, 0xFF, 0xFF, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = false;
            const [min, max] = [reader.readInt(littleEndian), reader.readInt(littleEndian)];
            expect(min).toBe(-2147483648);
            expect(max).toBe(2147483647);
        });
    });

    describe("readUInt", () => {
        test("returns correct little endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = true;
            const [min, max] = [reader.readUInt(littleEndian), reader.readUInt(littleEndian)];
            expect(min).toBe(0);
            expect(max).toBe(4294967295);
        });
    
        test("returns correct big endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF]);
            const reader = new BufferReader(buffer);
            const littleEndian = false;
            const [min, max] = [reader.readUInt(littleEndian), reader.readUInt(littleEndian)];
            expect(min).toBe(0);
            expect(max).toBe(4294967295);
        });
    
        test("throws BufferOverflow error if buffer is too small", () => {
            const buffer = Buffer.from([0x01, 0x02, 0x03]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readUInt()).toThrow();
        });
    });
    

    describe("readFloat", () => {
        test("returns correct little endian value", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x80, 0xBF, 0x00, 0x00, 0x80, 0x3F]);
            const reader = new BufferReader(buffer);
            const littleEndian = true;
            const [min, max] = [reader.readFloat(littleEndian), reader.readFloat(littleEndian)];
            expect(min).toBe(-1.0);
            expect(max).toBe(1.0);
        });

        test("returns correct big endian value", () => {
            const buffer = Buffer.from([0xBF, 0x80, 0x00, 0x00, 0x3F, 0x80, 0x00, 0x00]);
            const reader = new BufferReader(buffer);
            const littleEndian = false;
            const [min, max] = [reader.readFloat(littleEndian), reader.readFloat(littleEndian)];
            expect(min).toBeCloseTo(-1.0);
            expect(max).toBeCloseTo(1.0);
        });

        test("throws BufferOverflow error if buffer is too small", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x80]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readFloat()).toThrow();
        });
    });

    describe("readBoolean", () => {
        test("returns correct value", () => {
            const buffer = Buffer.from([0x00, 0x01]);
            const reader = new BufferReader(buffer);
            expect(reader.readBoolean()).toBe(false);
            expect(reader.readBoolean()).toBe(true);
        });

        test("throws error for invalid value", () => {
            const buffer = Buffer.from([0x02]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readBoolean()).toThrow("BufferError: Failed to read byte, invalid value received");
        });
    });

    describe("readBuffer", () => {
        test("returns correct buffer", () => {
            const buffer = Buffer.from([0x03, 0x00, 0x00, 0x00, 0x61, 0x62, 0x63]);
            const reader = new BufferReader(buffer);
            const result = reader.readBuffer();
            expect(result.equals(Buffer.from('abc'))).toBe(true);
        });

        test("throws BufferOverflow error if buffer length is too short", () => {
            const buffer = Buffer.from([0x01]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readBuffer()).toThrow();
        });
    });

    describe("readString", () => {
        test("returns correct string", () => {
            const buffer = Buffer.from([0x03, 0x00, 0x00, 0x00, 0x61, 0x62, 0x63]);
            const reader = new BufferReader(buffer);
            const result = reader.readString();
            expect(result).toBe('abc');
        });

        test("throws BufferOverflow error if buffer length is too short", () => {
            const buffer = Buffer.from([0x02, 0x00]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readString()).toThrow();
        });
    });

    describe("readNumber", () => {
        test("returns correct number for little endian", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x80, 0x3F]); // 1.0 as little endian
            const reader = new BufferReader(buffer);
            const result = reader.readNumber(true);
            expect(result).toBe(1.0);
        });

        test("returns correct number for big endian", () => {
            const buffer = Buffer.from([0x3F, 0x80, 0x00, 0x00]); // 1.0 as big endian
            const reader = new BufferReader(buffer);
            const result = reader.readNumber(false);
            expect(result).toBe(1.0);
        });

        test("throws BufferOverflow error if buffer is too short", () => {
            const buffer = Buffer.from([0x00, 0x00]);
            const reader = new BufferReader(buffer);
            expect(() => reader.readNumber()).toThrow();
        });
    });

    describe("read<castType>(<type>)", () => {
        test("returns correct value for Number", () => {
            const buffer = Buffer.from([0x00, 0x00, 0x80, 0xBF]); // -1 in float32
            const reader = new BufferReader(buffer);
            const result = reader.read(Number);
            expect(result).toBe(-1);
        });

        test("returns correct value for String", () => {
            const buffer = Buffer.from([0x03, 0x00, 0x00, 0x00, 0x61, 0x62, 0x63]);
            const reader = new BufferReader(buffer);
            const result = reader.read(String);
            expect(result).toBe('abc');
        });

        test("returns correct value for Boolean", () => {
            const buffer = Buffer.from([0x00, 0x01]);
            const reader = new BufferReader(buffer);
            expect(reader.read(Boolean)).toBe(false);
            expect(reader.read(Boolean)).toBe(true);
        });

        test("returns correct value for Buffer", () => {
            const buffer = Buffer.from([0x03, 0x00, 0x00, 0x00, 0x61, 0x62, 0x63]);
            const reader = new BufferReader(buffer);
            const result = reader.read(Buffer);
            expect(result.equals(Buffer.from('abc'))).toBe(true);
        });

        test("throws error for unknown type", () => {
            const buffer = Buffer.from([0x00, 0x01]);
            const reader = new BufferReader(buffer);
            expect(() => reader.read(Object)).toThrow("Unsupported type");
        });
    });
});