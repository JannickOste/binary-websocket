import "reflect-metadata";
import { Container } from "inversify";
import crypto from "crypto";
import AES from "../../../../src/core/infrastructure/crypt/AES";

describe("AES Encryption and Decryption", () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
    container.bind<AES>("AES").to(AES).inRequestScope(); 
  });

  it("should correctly encrypt and decrypt with AES-256-CBC mode", () => {
    const key = crypto.randomBytes(32); 
    const data = Buffer.from("This is a test message");

    const aes = new AES(key, 'aes-256-cbc');
    const { data: encryptedData, iv: encryptionIv, tag } = aes.encrypt(data, key);

    const decryptedData = aes.decrypt(encryptedData, encryptionIv, tag);

    expect(decryptedData.toString()).toEqual(data.toString()); 
  });

  it("should correctly encrypt and decrypt with AES-256-ECB mode", () => {
    const key = crypto.randomBytes(32); 
    const data = Buffer.from("This is a test message");

    const aes = new AES(key, 'aes-256-ecb');
    const { data: encryptedData, iv: encryptionIv, tag } = aes.encrypt(data, key);

    const decryptedData = aes.decrypt(encryptedData, encryptionIv, tag);

    expect(decryptedData.toString()).toEqual(data.toString()); 
  });

  it("should correctly encrypt and decrypt with AES-256-GCM mode", () => {
    const key = crypto.randomBytes(32); 
    const data = Buffer.from("This is a test message");

    const aes = new AES(key, 'aes-256-gcm');
    const { data: encryptedData, iv: encryptionIv, tag } = aes.encrypt(data, key);

    const decryptedData = aes.decrypt(encryptedData, encryptionIv, tag);

    expect(decryptedData.toString()).toEqual(data.toString()); 
  });

  it("should throw an error for unsupported AES mode in encrypt", () => {
    expect(() => {
        new AES(crypto.randomBytes(32), 'aes-256-xyz' as any);
    }).toThrow("Unsupported AES mode. Supported modes are: aes-256-cbc, aes-256-ecb, aes-256-gcm");
  });

  it("should throw an error if GCM decryption is missing tag", () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const aes = new AES(key, 'aes-256-gcm');

    const encryptedData = aes.encrypt(Buffer.from("data"), key);
    expect(() => aes.decrypt(encryptedData.data, iv)).toThrow("Tag is required for GCM decryption");
  });

  it("should generate different encrypted data for different inputs", () => {
    const key = crypto.randomBytes(32);
    const aes = new AES(key, 'aes-256-cbc');

    const data1 = Buffer.from("Test message 1");
    const data2 = Buffer.from("Test message 2");

    const encryptedData1 = aes.encrypt(data1, key);
    const encryptedData2 = aes.encrypt(data2, key);

    expect(encryptedData1.data).not.toEqual(encryptedData2.data);
  });

  it("should work with AES-256-ECB with empty IV", () => {
    const key = crypto.randomBytes(32);
    const aes = new AES(key, 'aes-256-ecb');

    const data = Buffer.from("Test message");
    const encryptedData = aes.encrypt(data, key);

    const decryptedData = aes.decrypt(encryptedData.data, Buffer.alloc(0));

    expect(decryptedData.toString()).toEqual(data.toString());
  });
});
