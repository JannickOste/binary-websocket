interface AESCypherData {
    data: Buffer,
    iv: Buffer,
    tag?: Buffer
}

export default AESCypherData;