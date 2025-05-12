import forge from "node-forge";
import RSAInterface from "../../domain/crypt/RSAInterface";
import { provide } from "../../domain/decorators/provide";
import types from "../../../di";
import { bindingScopeValues } from "inversify";

@provide(types.Core.Infrastructure.Crypt.IRSAInterface, bindingScopeValues.Singleton)
export default class RSA implements RSAInterface {
    private readonly rsaType: forge.pki.rsa.EncryptionScheme | undefined = "RSA-OAEP";
    private readonly keyPair: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(4096)

    public get publicKey(): string {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.keyPair.publicKey);
    }

    constructor(
    ){
        const noneTypes: (forge.pki.rsa.EncryptionScheme | undefined)[] = ["RAW", "NONE"]

        this.rsaType = noneTypes.includes(this.rsaType) ? undefined : this.rsaType;
    }
    

    encrypt(data: Buffer, publicKeyPem: string): Buffer {
        const publicKeyToUse = publicKeyPem 
            ? forge.pki.publicKeyFromPem(publicKeyPem) 
            : this.keyPair.publicKey;
    
        const buffer = forge.util.createBuffer(data);
        const encrypted = publicKeyToUse.encrypt(buffer.bytes(), this.rsaType);
    
        return Buffer.from(encrypted, 'binary');
    }
    
    decrypt(encryptedData: Buffer): Buffer {
        const buffer = forge.util.createBuffer(encryptedData.toString('binary'));
        const decrypted = this.keyPair.privateKey.decrypt(buffer.bytes(), this.rsaType);
    
        return Buffer.from(decrypted, 'binary');
    }
}

