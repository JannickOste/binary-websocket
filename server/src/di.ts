import 'reflect-metadata';
import { Container } from "inversify";

export const container = new Container();

const types = {
    Core: {
        Domain: {
        },
        Infrastructure: {
            Crypt: {
                IRSAInterface: Symbol.for("Core/Infrastructure/Crypt/IRSInterface"),
                IAESInterface: Symbol.for("Core/Infrastructure/Crypt/IAESInterface"),
            },
            Socket: {
                Manager: { 
                    IncommingPacketManager: Symbol.for("Core/Domain/Socket/Manager/IncommingPacketManager"),
                    OutgoingPacketManager: Symbol.for("Core/Domain/Socket/Manager/OutgoingPacketManager"),
                },
                Parser: {
                    IncommingHeaderParserInterface: Symbol.for("Core/Domain/Socket/Parser/IncommingHeaderParserInterface")
                }
                OutgoingPacketBuilderInterface: Symbol.for("Core/Domain/Socket/OutgoingPacketBuilderInterface"),
                IncommingPacketProcessorInterface: Symbol.for("Core/Domain/Socket/IncommingPacketProcessorInterface"),
                WebSocketServer: Symbol.for("Core/Domain/Socket/WebSocketServer")
            },
        },
        Presentation: {}
    }
}

export default types;