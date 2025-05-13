interface RSAInterface {
    publicKey:string;
    
    encrypt(data: Buffer, publicKeyPem: string): Buffer;
    decrypt(encryptedData: Buffer): Buffer;
}

export default RSAInterface;