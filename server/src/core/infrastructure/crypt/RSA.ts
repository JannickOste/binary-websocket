import forge from "node-forge";
import RSAInterface from "../../domain/crypt/RSAInterface";
import { provide } from "../../domain/decorators/provide";
import types from "../../../di";
import { bindingScopeValues } from "inversify";
import { unmanaged } from "inversify";
import EncryptionType from "../../domain/crypt/EncryptionType";

@provide(types.Core.Infrastructure.Crypt.IRSAInterface, bindingScopeValues.Singleton)
export default class RSA implements RSAInterface {
    private readonly keyPair: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(2048);

    public static readonly ALLOWED_MODES = ["RSA-OAEP", "RSAES-PKCS1-V1_5"]

    public get publicKey(): string {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.keyPair.publicKey);
    }

    encrypt(data: Buffer, publicKeyPem: string, rsaType = EncryptionType.RSAOAEP): Buffer {
        const buffer = forge.util.createBuffer(data);
        let encrypted: forge.Bytes | undefined;

        switch(rsaType) {
            case "none":
                encrypted = buffer.bytes();
                break;

                case "RSA-OAEP":
                case "RSAES-PKCS1-V1_5":
                    const publicKeyToUse = forge.pki.publicKeyFromPem(publicKeyPem)
    
                    encrypted = publicKeyToUse.encrypt(buffer.bytes(), rsaType);
                    break;

            default:
                throw new Error("Unknown RSA Encryption type");
        }

        return Buffer.from(encrypted, 'binary');
    }

    decrypt(encryptedData: Buffer, rsaType: EncryptionType = EncryptionType.RSAOAEP): Buffer {
        const buffer = forge.util.createBuffer(encryptedData.toString('binary'));
        let decrypted: forge.Bytes | undefined;

        switch(rsaType) {
            case "none":
                return encryptedData;

            case "RSA-OAEP":
            case "RSAES-PKCS1-V1_5":
                decrypted = this.keyPair.privateKey.decrypt(buffer.bytes(), rsaType);
                break;

            default:
                throw new Error("Unknown RSA Decryption type");
        }

        return Buffer.from(decrypted, 'binary');
    }
}
