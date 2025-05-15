import { WebSocket } from "ws";
import crypto from "crypto";
import AESInterface from "../../../../../src/core/domain/crypt/AESInterface";
import types, { container } from "../../../../../src/di";
import Client from "../../../../../src/core/domain/socket/client/Client";

class MockAES implements AESInterface {
    key: Buffer = crypto.randomBytes(32);
    encrypt = jest.fn();
    decrypt = jest.fn();
    generateKey = jest.fn();
}

describe("Client", () => {
    let socket: WebSocket;
    let mockAES: AESInterface;
    let client: Client;

    beforeAll(() => {
        socket = {} as WebSocket;
        mockAES = new MockAES();

        jest.spyOn(container, "get").mockImplementation((key) => {
            if (key === types.Core.Infrastructure.Crypt.IAESInterface) {
                return mockAES;
            }
            throw new Error("Unexpected type");
        });

        client = new Client(socket, 1)
    });

    describe("constructor", () => {
        test("constructs properly and injects AES dependency", () => {
            expect(client.id).toBe(1);
    
            expect(client.socket).toBe(socket);
            expect(client.aes).toBe(mockAES);
        });
    });

    describe("confirationCode", () => {
        test("should be a buffer", () => {
            const code = client.confirmationCode;

            expect(code).toBeInstanceOf(Buffer);
        });

        test("should have a byteLength of 32", () => {
            const code = client.confirmationCode;

            expect(code.byteLength).toBe(32);
        });
    })

    describe("rsaKey", () => {
        test("throws if accessed before being set", () => {
            const client = new Client(socket, 1);
            expect(() => client.rsaKey).toThrow("No RSA Key set.");
        });

        test("returns correct value after being set", () => {
            const client = new Client(socket, 1);
            client.rsaKey = "my-rsa-key";
            expect(client.rsaKey).toBe("my-rsa-key");
        });
    });

    describe("aesKey", () => {
        test("throws if accessed before being set", () => {
            const client = new Client(socket, 1);
            expect(() => client.aesKey).toThrow("No AES Key set.");
        });

        test("returns correct value after being set", () => {
            const client = new Client(socket, 1);
            const key = crypto.randomBytes(32);
            client.aesKey = key;
            expect(client.aesKey).toBe(key);
        });
    });
});
