import { bindingScopeValues, inject } from "inversify";
import types, { container } from "../../../di";
import { provide } from "../../domain/decorators/provide";
import IncommingPacketManagerInterface from "../../domain/socket/manager/IncommingPacketManagerInterface";
import Client from "../../domain/socket/Client";
import { unmanaged } from "inversify";
import { WebSocket } from "ws";
import BufferReader from "../../domain/utils/BufferReader";
import WebSocketClientInterface from "../../domain/socket/WebSocketClientInterface";

@provide(types.Core.Infrastructure.Socket.WebSocketClient, bindingScopeValues.Singleton)
export default class WebSocketClient implements WebSocketClientInterface {
    private _socket: WebSocket | undefined;
    public get socket(): WebSocket 
    {
        if(!this._socket)
        {
            throw new Error("Socket not initialized.")
        }

        return this._socket;
    }
    
    constructor(
        @inject(types.Core.Infrastructure.Socket.Manager.IncommingPacketManager) private readonly packetProcessor: IncommingPacketManagerInterface
    ) {
    }

    public async connect(): Promise<void> {
        let count = 0;
        do {
            this._socket = new WebSocket("ws://localhost:8080")

            this._socket.binaryType = "arraybuffer";
            this._socket.on("message", this.onPacketReceived.bind(this));
            if(this.socket.OPEN)
            {
                console.log("Connected to server")
                break;
            }

            console.log("Failed to connect to server")
        } while(count++ < 3)
    }

    public async disconnect(): Promise<void> {
        if(!this._socket)
        {
            throw new Error("Client not connected")
        }
        
        this.socket.close();
    }

    private async onPacketReceived(event: MessageEvent): Promise<void> { 
        if (event instanceof ArrayBuffer) {
            const buffer = Buffer.from(event)

            await this.packetProcessor.processPacket(
                buffer
            )
        } 
    }
}
