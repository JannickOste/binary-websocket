import EncryptionType from "../../../../src/core/domain/crypt/EncryptionType";
import SocketPacket from "../../../../src/core/domain/socket/packet/SocketPacket";

describe("SocketPacket", () => {    
    describe("constructor", () => {
        it("should set the id and encryption type correctly", () => {
            const packet = new SocketPacket(1, EncryptionType.NONE);
            const header = packet.buffer.subarray(0, packet.headerSize);

            const expectedHeader = Buffer.alloc(12);
            expectedHeader.writeUInt32LE(1, 0);
            expectedHeader.writeUInt32LE(4, 4);
            expectedHeader.write("none", 8);

            expect(header.compare(packet.buffer.subarray(0, header.byteLength))).toBe(0);
        });
    });
});
