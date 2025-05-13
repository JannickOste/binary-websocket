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
            }
        },
        Presentation: {}
    }
}

export default types;