import EncryptionType from "../../../../src/core/domain/crypt/EncryptionType";
import SocketPacket from "../../../../src/core/domain/socket/SocketPacket";

describe("SocketPacket", () => {    
    describe("constructor", () => {
        it("should set the id and encryption type correctly", () => {
            const packet = new SocketPacket(1, 1);
            const header = packet.buffer.subarray(0, SocketPacket.HEADER_SIZE);
            const oneBuffer = Buffer.from([1, 0, 0, 0]);
            
            expect(header.subarray(0, 4).equals(oneBuffer)).toBe(true);
            expect(header.subarray(4, 8).equals(oneBuffer)).toBe(true);
        });
    });
});