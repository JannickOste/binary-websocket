import EncryptionType from "../../../../src/core/domain/crypt/EncryptionType";
import RSA from "../../../../src/core/infrastructure/crypt/RSA";

describe("RSA", () => {
    const testData = Buffer.from("Test data");
    let rsaService: RSA;
    let publicKey: string;

    beforeEach(() => {
        rsaService = new RSA();
        publicKey = rsaService.publicKey;
    });

    describe("encrypt", () => {
        it("should return raw data for 'none' rsaType", () => {
            const encrypted = rsaService.encrypt(testData, publicKey, EncryptionType.NONE);
            expect(encrypted.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should encrypt with 'RSA-OAEP'", () => {
            const encrypted = rsaService.encrypt(testData, publicKey, EncryptionType.RSAOAEP);
            expect(Buffer.isBuffer(encrypted)).toBe(true);
            expect(encrypted.equals(testData)).toBe(false); 
        });

        it("should encrypt with 'RSAES-PKCS1-V1_5'", () => {
            const encrypted = rsaService.encrypt(testData, publicKey, EncryptionType.RSAESPKCS);
            expect(Buffer.isBuffer(encrypted)).toBe(true);
            expect(encrypted.equals(testData)).toBe(false);
        });

        it("should throw error on unsupported encryption type", () => {
            expect(() =>
                rsaService.encrypt(testData, publicKey, EncryptionType.AES256CBC)
            ).toThrow("Unknown RSA Encryption type");
        });
    });

    describe("decrypt", () => {
        it("should return raw data for 'none' rsaType", () => {
            const decrypted = rsaService.decrypt(testData, EncryptionType.NONE);
            expect(decrypted.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should decrypt 'RSA-OAEP' correctly", () => {
            const encrypted = rsaService.encrypt(testData, publicKey, EncryptionType.RSAOAEP);
            const decrypted = rsaService.decrypt(encrypted, EncryptionType.RSAOAEP);
            expect(decrypted.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should decrypt 'RSAES-PKCS1-V1_5' correctly", () => {
            const encrypted = rsaService.encrypt(testData, publicKey, EncryptionType.RSAESPKCS);
            const decrypted = rsaService.decrypt(encrypted, EncryptionType.RSAESPKCS);
            expect(decrypted.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should throw error on unsupported decryption type", () => {
            expect(() =>
                rsaService.decrypt(testData, "INVALID_TYPE" as any)
            ).toThrow("Unknown RSA Decryption type");
        });
    });
});
