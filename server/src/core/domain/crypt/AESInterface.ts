import AESCypherData from "./AESCypherData";

interface AESInterface {
    encrypt(data: Buffer, key: Buffer): AESCypherData;
    decrypt(data: Buffer, iv: Buffer, tag?: Buffer): Buffer;
}

export default AESInterface;