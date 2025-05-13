import { WebSocket } from "ws";

export default class Client {

    constructor(
        public socket: WebSocket,
        public id: number, 
    ) {

    }
}
