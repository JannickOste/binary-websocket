import BufferWriter from "../../../../src/core/domain/utils/BufferWriter";

describe('BufferWriter', () => {
    let buffer: Buffer;
    let writer: BufferWriter;

    beforeEach(() => {
        buffer = Buffer.alloc(64);
        writer = new BufferWriter(buffer);
    });

    describe("constructor", () => {
        it('should initialize with the correct buffer', () => {
            expect(writer.buffer).toBe(buffer);
        });
    })

    describe('writeByte', () => {
        it('should write a byte to the buffer', () => {
            writer.writeByte(127);
            expect(buffer[0]).toBe(127);

        });

        it("should increment the offset", () => {
            writer.writeByte(127);

            expect(writer.currentOffset).toBe(1);
        })

        it("should throw an error if the value is outside of range", () => {
            expect(() => writer.writeByte(128)).toThrow();
        })

        it('should throw an error when buffer overflows', () => {
            const writer = new BufferWriter(Buffer.from([]));

            expect(() => writer.writeByte(256)).toThrow();
        });
    });

    describe('writeUByte', () => {
        it('should write an unsigned byte to the buffer', () => {
            writer.writeUByte(255);
            expect(buffer[0]).toBe(255);
        });

        it("should increment the offset", () => {
            writer.writeUByte(127);

            expect(writer.currentOffset).toBe(1);
        })

        it('should throw an error when buffer overflows', () => {
            const writer = new BufferWriter(Buffer.from([]))
            expect(() => writer.writeUByte(256)).toThrow()
        });
    });

    describe('writeBoolean', () => {
        it('should write true as 1', () => {
            writer.writeBoolean(true);
            expect(buffer[0]).toBe(1);

        });

        it('should write false as 0', () => {
            writer.writeBoolean(false);
            expect(buffer[1]).toBe(0);
        });
    });

    describe('writeShort', () => {
        it('should write the correct little endian value', () => {
            writer.writeShort(1234, true);

            expect(buffer.readInt16LE(0)).toBe(1234);
        });

        it('should write the correct big endian value', () => {
            writer.writeShort(1234, false);

            expect(buffer.readInt16BE(0)).toBe(1234);
        });

        it('should make an addition of 2 to the offset', () => {
            writer.writeShort(1234);

            expect(writer.currentOffset).toBe(2);
        });

        it('should throw an error if the value is outside of range', () => {
            expect(() => writer.writeShort(-32769)).toThrow()
            expect(() => writer.writeShort(32768)).toThrow()
        });
    });

    describe('writeUShort', () => {
        it('should write the correct little endian value', () => {
            writer.writeUShort(1234, true);

            expect(buffer.readUInt16LE(0)).toBe(1234);
        });

        it('should write the correct big endian value', () => {
            writer.writeUShort(1234, false);

            expect(buffer.readUInt16BE(0)).toBe(1234);
        });

        it('should make an addition of 2 to the offset', () => {
            writer.writeUShort(1234);

            expect(writer.currentOffset).toBe(2);
        });

        it('should throw an error if the value is outside of range', () => {
            expect(() => writer.writeUShort(-1)).toThrow()
            expect(() => writer.writeUShort(65536)).toThrow()
        });
    });

    describe('writeInt', () => {
        it('should write the correct little endian value', () => {
            writer.writeInt(1234, true);

            expect(buffer.readInt32LE(0)).toBe(1234);
        });

        it('should write the correct big endian value', () => {
            writer.writeInt(1234, false);

            expect(buffer.readInt32BE(0)).toBe(1234);
        });

        it('should make an addition of 4 to the offset', () => {
            writer.writeInt(1234);

            expect(writer.currentOffset).toBe(4);
        });

        it('should throw an error if the value is outside of range', () => {
            expect(() => writer.writeInt(-2147483649)).toThrow()
            expect(() => writer.writeInt(2147483648)).toThrow()
        });
    });

    describe('writeUInt', () => {
        it('should write the correct little endian value', () => {
            writer.writeUInt(1234, true);

            expect(buffer.readUint32LE(0)).toBe(1234);
        });

        it('should write the correct big endian value', () => {
            writer.writeUInt(1234, false);

            expect(buffer.readUint32BE(0)).toBe(1234);
        });

        it('should make an addition of 4 to the offset', () => {
            writer.writeUInt(1234);

            expect(writer.currentOffset).toBe(4);
        });

        it('should throw an error if the value is outside of range', () => {
            expect(() => writer.writeUInt(-1)).toThrow()
            expect(() => writer.writeUInt(4294967296)).toThrow()
        });
    });

    describe('writeFloat', () => {
        it('should write the correct little endian value', () => {
            writer.writeFloat(1234, true);

            expect(buffer.readFloatLE(0)).toBeCloseTo(1234);
        });

        it('should write the correct big endian value', () => {
            writer.writeFloat(1234, false);

            expect(buffer.readFloatBE(0)).toBeCloseTo(1234);
        });

        it('should make an addition of 4 to the offset', () => {
            writer.writeFloat(1234);

            expect(writer.currentOffset).toBe(4);
        });
    });

    describe('writeDouble', () => {
        it('should write the correct little endian value', () => {
            writer.writeDouble(1234.56789, true);
            expect(buffer.readDoubleLE(0)).toBeCloseTo(1234.56789);
        });
    
        it('should write the correct big endian value', () => {
            writer.writeDouble(1234.56789, false);
            expect(buffer.readDoubleBE(0)).toBeCloseTo(1234.56789);
        });
    
        it('should make an addition of 8 to the offset', () => {
            writer.writeDouble(1234.56789);
            expect(writer.currentOffset).toBe(8);
        });
    });

    describe('writeDate', () => {
        it('should write a date to the buffer as a double', () => {
            const date = new Date('2025-01-01T00:00:00Z');
            writer.writeDate(date, true);
            expect(buffer.readDoubleLE(0)).toBe(date.getTime());
            expect(writer.currentOffset).toBe(8);
        });
    });

    describe('writeBuffer', () => {
        it('should write the length of the buffer first as an int', () => {
            const smallBuffer = Buffer.from([1, 2, 3, 4]);
            writer.writeBuffer(smallBuffer);
    
            expect(buffer.readInt32LE(0)).toBe(smallBuffer.length);
        });
    
        it('should write the data after the length of the buffer', () => {
            const smallBuffer = Buffer.from([1, 2, 3, 4]);
            writer.writeBuffer(smallBuffer);
    
            expect(buffer.subarray(4, 8).toString('hex')).toBe(smallBuffer.toString('hex'));
        });
    
        it('should throw an error if the buffer exceeds available space', () => {
            const writer = new BufferWriter(Buffer.alloc(4));
            const smallBuffer = Buffer.from([1, 2, 3, 4]);
    
            expect(() => writer.writeBuffer(smallBuffer)).toThrow();
        });
    });

    describe('writeString', () => {
        it('should write a string to the buffer', () => {
            writer.writeString('hello');
            expect(buffer.subarray(4, 9).toString('utf-8')).toBe('hello');
            expect(writer.currentOffset).toBe(9);
        });

        it('should support different encodings', () => {
            writer.writeString('hello', 'latin1');
            expect(buffer.subarray(4, 9).toString('latin1')).toBe('hello');
        });
    });
});