enum EncryptionType {
    NONE = 'NONE',
    AES256GCM = "aes-256-gcm",
    AES256CBC = "aes-256-cbc",
    AES256ECB = "aes-256-cbc",
    RSAOAEP = "RSA-OAEP",
    RSAESPKCS = "RSAES-PKCS1-V1_5"
}

export default EncryptionType;