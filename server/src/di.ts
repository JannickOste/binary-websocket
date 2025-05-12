import 'reflect-metadata';
import { Container } from "inversify";

export const container = new Container();

const types = {
    Core: {
        Domain: {
        },
        Infrastructure: {
            Crypt: {
                IRSAInterface: Symbol.for("Core/Infrastructure/Crypt/IRSInterface")
            }
        },
        Presentation: {}
    }
}

export default types;