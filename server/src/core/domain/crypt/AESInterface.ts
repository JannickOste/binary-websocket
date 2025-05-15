import AESCypherData from "./AESCypherData";
import EncryptionType from "./EncryptionType";

interface AESInterface {
    key: Buffer;
    
    encrypt(data: Buffer, key: Buffer, mode?: EncryptionType): AESCypherData;
    decrypt(data: Buffer, iv: Buffer, mode?: EncryptionType, tag?: Buffer): Buffer;
}

export default AESInterface;