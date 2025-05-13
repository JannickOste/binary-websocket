import Kernel from "./core/infrastructure/Kernel"

(async(): Promise<void> => {
    const kernel = new Kernel();

    await kernel.init();
    await kernel.start();
})()