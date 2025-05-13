import { WebSocket } from "ws";

interface WebSocketClientInterface {
    socket: WebSocket;

    connect(): Promise<void>
    disconnect(): Promise<void> 
}

export default WebSocketClientInterface;