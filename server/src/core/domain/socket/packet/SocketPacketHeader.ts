export default class SocketPacketHeader 
{ 
    constructor(
        public readonly id: number, 
        public readonly encryption: string,
        public readonly headerSize: number
    ) {}
}