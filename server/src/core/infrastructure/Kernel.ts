import { globSync } from "glob"
import types, { container } from "../../di";
import WebSocketServer from "./socket/WebSocketServer";

export default class Kernel 
{
    public async init(): Promise<void> 
    {
        console.log("Loading dependencies...")
        for(const file of globSync(`{src,dist}/**/*.${__filename.endsWith("ts") ? "ts" : "js"}`, {absolute: true}))
        {
            const _ = require(file)
        }
    }

    public async start(): Promise<void> 
    {
        const server = container.get<WebSocketServer>(types.Core.Infrastructure.Socket.WebSocketServer)
        if(server)
        {
            console.log("Starting server...");  

            await server.listen();
            
            console.log("Server started!");
        }
    }
}