import BufferWriter from "../../../../src/core/domain/utils/BufferWriter";

class TestBufferWriter extends BufferWriter {
    public writeByte(value: number): void { super.writeByte(value); }
    public writeShort(value: number, littleEndian: boolean = true): void { super.writeShort(value, littleEndian); }
    public writeInt(value: number, littleEndian: boolean = true): void { super.writeInt(value, littleEndian); }
    public writeFloat32(value: number, littleEndian: boolean = true): void { super.writeFloat32(value, littleEndian); }
    public writeFloat64(value: number, littleEndian: boolean = true): void { super.writeFloat64(value, littleEndian); }
    public writeBoolean(value: boolean): void { super.writeBoolean(value); }
    public writeBuffer(value: Buffer): void { super.writeBuffer(value); }
    public writeString(value: string): void { super.writeString(value); }
    public assertBufferSize(value: number): void { super.assertBufferSize(value); }
}

describe("BufferWriter", () => {
    describe("constructor", () => {
        test("Initializes buffer correctly", () => {
            const buffer = Buffer.from([0x01, 0x02, 0x03]);
            const writer = new TestBufferWriter(buffer);
            expect(writer.buffer.equals(buffer)).toBe(true);
        });

        test("Initializes currentOffset correctly", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);
            expect(writer.currentOffset).toBe(0);
        });
    });

    describe("assertBufferSize", () => {
        test("Does not throw if buffer size is sufficient", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            expect(() => writer.assertBufferSize(4)).not.toThrow();
        });

        test("Throws if buffer size is insufficient", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            expect(() => writer.assertBufferSize(5)).toThrow("BufferOverflow: Not enough space in buffer to write data");
        });
    });

    describe("writeByte", () => {
        test("Writes correct value", () => {
            const buffer = Buffer.alloc(1);
            const writer = new TestBufferWriter(buffer);

            writer.writeByte(0x80);
            expect(buffer[0]).toBe(0x80);
        });

        test("Increments current offset after writing a byte", () => {
            const buffer = Buffer.alloc(1);
            const writer = new TestBufferWriter(buffer);
            writer.writeByte(0x80);
            expect(writer.currentOffset).toBe(1);
        });
    });

    describe("writeShort", () => {
        test("Writes correct little endian value", () => {
            const buffer = Buffer.alloc(2);
            const writer = new TestBufferWriter(buffer);

            writer.writeShort(-32768, true);
            expect(buffer.readInt16LE(0)).toBe(-32768);
        });

        test("Writes correct big endian value", () => {
            const buffer = Buffer.alloc(2);
            const writer = new TestBufferWriter(buffer);

            writer.writeShort(-32768, false);
            expect(buffer.readInt16BE(0)).toBe(-32768);
        });

        test("Adds 2 to current offset after writing a short", () => {
            const buffer = Buffer.alloc(2);
            const writer = new TestBufferWriter(buffer);
            writer.writeShort(-32768, true);
            expect(writer.currentOffset).toBe(2);
        });
    });

    describe("writeInt", () => {
        test("Writes correct little endian value", () => {

            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeInt(-2147483648, true);

            expect(buffer.readInt32LE(0)).toBe(-2147483648);
        });

        test("Writes correct big endian value", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeInt(-2147483648, false);

            expect(buffer.readInt32BE(0)).toBe(-2147483648);
        });

        test("Adds 4 to current offset after writing an int", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeInt(-2147483648, true);

            expect(writer.currentOffset).toBe(4);
        });
    });

    describe("writeFloat32", () => {
        test("Writes correct little endian value", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat32(-2147483648, true);
            expect(buffer.readFloatLE(0)).toBe(-2147483648);
        });

        test("Writes correct big endian value", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat32(-2147483648, false);
            expect(buffer.readFloatBE(0)).toBe(-2147483648);
        });

        test("Adds 4 to current offset after writing a float32", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat32(-2147483648, true);
            expect(writer.currentOffset).toBe(4);
        });
    });

    describe("writeFloat64", () => {
        test("Writes correct little endian value", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat64(-2147483648, true);
            expect(buffer.readDoubleLE(0)).toBe(-2147483648);
        });

        test("Writes correct big endian value", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat64(-2147483648, false);
            expect(buffer.readDoubleBE(0)).toBe(-2147483648);
        });

        test("Adds 8 to current offset after writing a float64", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            writer.writeFloat64(-2147483648, true);
            expect(writer.currentOffset).toBe(8);
        });
    });

    describe("writeBoolean", () => {
        test("Writes correct value", () => {
            const buffer = Buffer.alloc(1);
            const writer = new TestBufferWriter(buffer);

            writer.writeBoolean(true);
            expect(buffer[0]).toBe(1);
        });

        test("Increments current offset after writing a boolean", () => {
            const buffer = Buffer.alloc(1);
            const writer = new TestBufferWriter(buffer);

            writer.writeBoolean(true);
            expect(writer.currentOffset).toBe(1);
        });
    });

    describe("writeBuffer", () => {
        test("Writes correct value", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const expected = Buffer.concat([Buffer.from([0x04, 0x00, 0x00, 0x00]), data]);
            writer.writeBuffer(data);

            expect(buffer.equals(expected)).toBe(true);
        });

        test("Increments current offset after writing a buffer", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            writer.writeBuffer(data);

            expect(writer.currentOffset).toBe(8);
        });
    });

    describe("writeString", () => {
        test("Writes correct value", () => {
            const buffer = Buffer.alloc(9);
            const writer = new TestBufferWriter(buffer);
            const data = "Hello";

            const expected = Buffer.concat([Buffer.from([0x05, 0x00, 0x00, 0x00]), Buffer.from(data)]);
            writer.writeString(data);

            expect(buffer.equals(expected)).toBe(true);
        });
        test("Increments current offset after writing a string", () => {
            const buffer = Buffer.alloc(9);
            const writer = new TestBufferWriter(buffer);
            const data = "Hello";

            writer.writeString(data);

            expect(writer.currentOffset).toBe(9);
        });
    });

    describe("write", () => {
        test("write(Number) writes correct value", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            writer.write(-2147483648);
            expect(buffer.readFloatLE(0)).toBe(-2147483648);
        });

        test("write(Boolean) writes correct value", () => {
            const buffer = Buffer.alloc(1);
            const writer = new TestBufferWriter(buffer);
            writer.write(true);
            expect(buffer[0]).toBe(1);
        });

        test("write(Date) writes correct value", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);
            const date = new Date(0);
            const expected = Buffer.concat([Buffer.from([0x00, 0x00, 0x00, 0x00]), Buffer.from([0x00, 0x00, 0x00, 0x00])]);
            writer.write(date);

            expect(buffer.equals(expected)).toBe(true);
        });

        test("write(String) writes correct value", () => {
            const buffer = Buffer.alloc(9);
            const writer = new TestBufferWriter(buffer);
            const data = "Hello";

            const expected = Buffer.concat([Buffer.from([0x05, 0x00, 0x00, 0x00]), Buffer.from(data)]);
            writer.write(data);

            expect(buffer.equals(expected)).toBe(true);
        });

        test("write(Buffer) writes correct value", () => {
            const buffer = Buffer.alloc(8);
            const writer = new TestBufferWriter(buffer);

            const data = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            const expected = Buffer.concat([Buffer.from([0x04, 0x00, 0x00, 0x00]), data]);
            writer.write(data);

            expect(buffer.equals(expected)).toBe(true);
        });

        test("write throws error for unsupported type", () => {
            const buffer = Buffer.alloc(4);
            const writer = new TestBufferWriter(buffer);

            expect(() => writer.write({} as any)).toThrow("Unsupported type");
        });
    });
});
