import { WebSocket } from "ws";
import AES from "../../infrastructure/crypt/AES";
import AESInterface from "../crypt/AESInterface";
import types, { container } from "../../../di";

export default class Client 
{
    private _rsaKey: undefined | string;
    public get rsaKey(): string {
        if(!this._rsaKey)
        {
            throw new Error("No RSA Key set.")
        }

        return this._rsaKey;
    }

    public set rsaKey(value: string) {
        this._rsaKey = value;
    }

    private _aesKey: Buffer | undefined;
    public get aesKey(): Buffer {
        if(!this._aesKey)
            {
                throw new Error("No AES Key set.")
            }
    
        return this._aesKey;
    }

    public set aesKey(value: Buffer) {
        this._aesKey = value;
    }

    public readonly aes: AESInterface;

    constructor(
        public socket: WebSocket,
        public id: number, 
    ) {
        this.aes = container.get<AESInterface>(types.Core.Infrastructure.Crypt.IAESInterface)
    }
}
