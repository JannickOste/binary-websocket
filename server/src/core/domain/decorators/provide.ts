import "reflect-metadata";

import { injectable, BindingScope } from "inversify";
import { container } from "../../../di";

export const provide = (serviceIdentifier: symbol, scope?: BindingScope) => {
    return (target: any): void => {
        injectable(scope)(target);

        container.bind(serviceIdentifier).to(target)
    }
}