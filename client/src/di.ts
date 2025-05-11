import 'reflect-metadata';
import { Container } from "inversify";

export const container = new Container();

const types = {
    Core: {
        Domain: {
        },
        Infrastructure: {
        },
        Presentation: {}
    }
}

export default types;