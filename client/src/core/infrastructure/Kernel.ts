import { globSync } from "glob"
import types, { container } from "../../di";
import WebSocketClient from "./socket/WebSocketClient";

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
        const client = container.get<WebSocketClient>(types.Core.Infrastructure.Socket.WebSocketClient)
        if(client)
        {
            await client.connect();
        }
    }
}