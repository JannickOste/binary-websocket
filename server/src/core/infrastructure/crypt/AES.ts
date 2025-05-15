import crypto from "crypto";
import { bindingScopeValues, unmanaged } from "inversify";
import AESInterface from "../../domain/crypt/AESInterface";
import AESCypherData from "../../domain/crypt/AESCypherData";
import { provide } from "../../domain/decorators/provide";
import types from "../../../di";
import EncryptionType from "../../domain/crypt/EncryptionType";

@provide(types.Core.Infrastructure.Crypt.IAESInterface, bindingScopeValues.Request)
class AES implements AESInterface {
    private static readonly KEY_SIZE = 32; 
    private static readonly IV_SIZE = 16;

    public static readonly ALLOWED_MODES = ['aes-256-cbc', 'aes-256-ecb', 'aes-256-gcm'];

    constructor(
        @unmanaged() public readonly key: Buffer = crypto.randomBytes(AES.KEY_SIZE)
    ) {        
        if (this.key.length !== AES.KEY_SIZE) throw new Error(`Key must be ${AES.KEY_SIZE} bytes`);
    }

    encrypt(data: Buffer, key: Buffer, mode: EncryptionType = EncryptionType.AES256CBC): AESCypherData {
        const iv = crypto.randomBytes(AES.IV_SIZE); 
        let cipher;
        let encrypted;
        
        switch (mode) {
            case 'aes-256-cbc':
                cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

                encrypted = cipher.update(data);
                encrypted = Buffer.concat([encrypted, cipher.final()]);

                return { data: encrypted, iv: iv };

            case 'aes-256-ecb':
                cipher = crypto.createCipheriv("aes-256-ecb", key, Buffer.alloc(0));

                encrypted = cipher.update(data);
                encrypted = Buffer.concat([encrypted, cipher.final()]);

                return { data: encrypted, iv: Buffer.alloc(0) }; 

            case 'aes-256-gcm':
                cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

                encrypted = cipher.update(data);
                encrypted = Buffer.concat([encrypted, cipher.final()]);

                return { data: encrypted, iv: iv, tag: cipher.getAuthTag() };

            default:
                throw new Error("Unsupported AES mode");
        }
    }

    decrypt(data: Buffer, iv: Buffer, mode: EncryptionType = EncryptionType.AES256CBC, tag?: Buffer): Buffer {
        let decipher;
        let decrypted;

        switch (mode) {
            case 'aes-256-cbc':
                decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);

                decrypted = decipher.update(data);
                decrypted = Buffer.concat([decrypted, decipher.final()]);

                return decrypted;

            case 'aes-256-ecb':
                decipher = crypto.createDecipheriv("aes-256-ecb", this.key, Buffer.alloc(0));

                decrypted = decipher.update(data);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                
                return decrypted;

            case 'aes-256-gcm':
                if (!tag) throw new Error("Tag is required for GCM decryption");

                decipher = crypto.createDecipheriv("aes-256-gcm", this.key, iv);
                decipher.setAuthTag(tag);

                decrypted = decipher.update(data);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                
                return decrypted;

            default:
                throw new Error("Unsupported AES mode");
        }
    }
}

export default AES;
