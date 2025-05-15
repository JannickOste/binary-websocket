import "reflect-metadata";
import { Container } from "inversify";
import crypto from "crypto";
import AES from "../../../../src/core/infrastructure/crypt/AES";
import EncryptionType from "../../../../src/core/domain/crypt/EncryptionType";

describe("AES", () => {
  let container: Container;
  let key: Buffer;
  let data: Buffer;
  let aes: AES;

  beforeAll(() => {
    container = new Container();
    container.bind<AES>("AES").to(AES).inRequestScope();

    key = crypto.randomBytes(32);
    data = Buffer.from("This is a test message");
    aes = new AES(key);
  });

  describe("constructor", () => {
      describe("Should throw an error if the key length isnt 32bit", () => {
          expect(() => new AES(crypto.randomBytes(0))).toThrow();
      })
  })

  describe("encrypt", () => {
    it("should correctly encrypt with AES-256-CBC mode", () => {
      const result = aes.encrypt(data, key, EncryptionType.AES256CBC);

      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.iv).toBeInstanceOf(Buffer);
    });

    it("should correctly encrypt with AES-256-ECB mode", () => {
      const result = aes.encrypt(data, key, EncryptionType.AES256ECB);

      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.iv.equals(Buffer.alloc(0))).toBe(true);
    });

    it("should correctly encrypt with AES-256-GCM mode", () => {
      const result = aes.encrypt(data, key, EncryptionType.AES256GCM);

      expect(result.data).toBeInstanceOf(Buffer);
      expect(result.iv).toBeInstanceOf(Buffer);
      expect(result.tag).toBeInstanceOf(Buffer);
    });

    it("should generate different encrypted data for different inputs", () => {
      const data1 = Buffer.from("Test message 1");
      const data2 = Buffer.from("Test message 2");

      const encryptedData1 = aes.encrypt(data1, key, EncryptionType.AES256CBC);
      const encryptedData2 = aes.encrypt(data2, key, EncryptionType.AES256CBC);

      expect(encryptedData1.data).not.toEqual(encryptedData2.data);
    });

    it("should throw an error for unsupported AES mode", () => {
      expect(() =>
        aes.encrypt(data, key, 'aes-256-xyz' as EncryptionType)
      ).toThrow("Unsupported AES mode");
    });
  });

  describe("decrypt", () => {
    it("should correctly decrypt AES-256-CBC", () => {
      const { data: encryptedData, iv, tag } = aes.encrypt(data, key, EncryptionType.AES256CBC);
      const decrypted = aes.decrypt(encryptedData, iv, EncryptionType.AES256CBC, tag);

      expect(decrypted.toString()).toEqual(data.toString());
    });

    it("should correctly decrypt AES-256-ECB", () => {
      const { data: encryptedData, iv, tag } = aes.encrypt(data, key, EncryptionType.AES256ECB);
      const decrypted = aes.decrypt(encryptedData, iv, EncryptionType.AES256ECB, tag);

      expect(decrypted.toString()).toEqual(data.toString());
    });

    it("should correctly decrypt AES-256-GCM", () => {
      const { data: encryptedData, iv, tag } = aes.encrypt(data, key, EncryptionType.AES256GCM);
      const decrypted = aes.decrypt(encryptedData, iv, EncryptionType.AES256GCM, tag);

      expect(decrypted.toString()).toEqual(data.toString());
    });

    it("should throw an error if GCM decryption is missing tag", () => {
      const { data: encryptedData, iv } = aes.encrypt(data, key, EncryptionType.AES256GCM);

      expect(() => aes.decrypt(encryptedData, iv, EncryptionType.AES256GCM)).toThrow("Tag is required for GCM decryption");
    });

    it("should work with AES-256-ECB and empty IV", () => {
      const { data: encryptedData, iv, tag } = aes.encrypt(data, key, EncryptionType.AES256ECB);
      const decrypted = aes.decrypt(encryptedData, iv, EncryptionType.AES256ECB, tag);

      expect(decrypted.toString()).toEqual(data.toString());
    });

    it("should throw an error for unsupported AES mode", () => {
      expect(() =>
        aes.decrypt(data, key, 'aes-256-xyz' as EncryptionType)
      ).toThrow("Unsupported AES mode");
    });
  });
});
