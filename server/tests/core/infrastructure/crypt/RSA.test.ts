import { pki } from "node-forge";
import RSA from "../../../../src/core/infrastructure/crypt/RSA";

describe("RSA", () => {
    const testData = Buffer.from("Test data");

    beforeEach(() => {
        jest.resetModules(); 
    });

    describe("encrypt/decrypt", () => {
        it("should correctly handle the 'NONE' rsaType", () => {
            const rsaService = new RSA("NONE");  

            const encryptedData = rsaService.encrypt(testData, rsaService.publicKey);
            const decryptedData = rsaService.decrypt(encryptedData);

            expect(decryptedData.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should correctly handle the 'RSA-OAEP' rsaType", () => {
            const rsaService = new RSA("RSA-OAEP");  

            const encryptedData = rsaService.encrypt(testData, rsaService.publicKey);
            const decryptedData = rsaService.decrypt(encryptedData);

            expect(decryptedData.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should correctly handle the 'RSAES-PKCS1-V1_5' rsaType", () => {
            const rsaService = new RSA("RSAES-PKCS1-V1_5");  

            const encryptedData = rsaService.encrypt(testData, rsaService.publicKey);
            const decryptedData = rsaService.decrypt(encryptedData);

            expect(decryptedData.toString("hex")).toEqual(testData.toString("hex"));
        });

        it("should throw an error on unsupported encryption types", () => {
            const rsaService = new RSA("UNSUPPORTED" as pki.rsa.EncryptionScheme);  

            expect(() => rsaService.encrypt(testData, rsaService.publicKey)).toThrow();
        });

        it("should throw an error on unsupported decryption types", () => {
            const rsaService = new RSA("UNSUPPORTED" as pki.rsa.EncryptionScheme);  

            expect(() => rsaService.decrypt(testData)).toThrow();
        });
    });
});
