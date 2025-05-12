import "reflect-metadata";
import { Container, bindingScopeValues } from "inversify";

describe("provide decorator", () => {
    let testContainer: Container;
    const serviceSymbol = Symbol("TestService");
    // Bit weird, but import must happen after mock (beforeEach -> Mock -> Import)
    const importPath = "../../../../src/core/domain/decorators/provide"

    beforeEach(() => {
        jest.resetModules();
        testContainer = new Container();

        jest.doMock("../../../../src/di", () => ({
            container: testContainer
        }));
    });

    it("should bind a class to the container with the provided identifier", async () => {
        const { provide } = await import(importPath);

        @provide(serviceSymbol)
        class TestService {}

        expect(() => testContainer.get<TestService>(serviceSymbol)).not.toThrow();
    });

    it("should apply the injectable decorator", async() => {
        const { provide } = await import(importPath);

        @provide(serviceSymbol)
        class InjectableService {}

        const metadataKeys = Reflect.getMetadataKeys(InjectableService);
        expect(metadataKeys).toContain("@inversifyjs/core/classIsInjectableFlagReflectKey");
    });

    it("should support custom scope if provided", async () => {
        const { provide } = await import(importPath);
    
        @provide(serviceSymbol, bindingScopeValues.Singleton)
        class ScopedService {
            public id = Math.random();
        }
    
        const instance1 = testContainer.get<ScopedService>(serviceSymbol);
        const instance2 = testContainer.get<ScopedService>(serviceSymbol);
    
        expect(instance1).toBe(instance2);
    });
});
