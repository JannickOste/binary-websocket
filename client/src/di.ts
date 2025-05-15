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
                Services: {
                    IncommingSocketPacketService: Symbol.for("Core/Domain/Socket/Services/IncommingSocketPacketService"),
                    OutgoingSocketPacketService: Symbol.for("Core/Domain/Socket/Services/OutgoingSocketPacketService"),
                },
                Parser: {
                    IncommingHeaderParserInterface: Symbol.for("Core/Domain/Socket/Parser/IncommingHeaderParserInterface"),
                    IncommingContentParserInterface: Symbol.for("Core/Domain/Socket/Parser/IncommingContentParserInterface")
                },
                OutgoingPacketBuilderInterface: Symbol.for("Core/Domain/Socket/OutgoingPacketBuilderInterface"),
                IncommingPacketProcessorInterface: Symbol.for("Core/Domain/Socket/IncommingPacketProcessorInterface"),
                WebSocketClient: Symbol.for("Core/Domain/Socket/WebSocketClient")
            },
        },
        Presentation: {}
    },
    Crypt: {
        SeverAESKey: Symbol.for("Crypt/ServerAESKey"),
        SeverRSAKey: Symbol.for("Crypt/ServerAESKey"),
    }
}

export default types;