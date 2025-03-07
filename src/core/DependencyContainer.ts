export class DependencyContainer {
    private static instance: DependencyContainer;
    private container: Map<string, any> = new Map();

    private constructor() {}

    static getInstance(): DependencyContainer {
        if (!DependencyContainer.instance) {
            DependencyContainer.instance = new DependencyContainer();
        }
        return DependencyContainer.instance;
    }

    register<T>(token: string, implementation: T): void {
        this.container.set(token, implementation);
    }

    resolve<T>(token: string): T {
        const implementation = this.container.get(token);
        if (!implementation) {
            throw new Error(`No implementation found for ${token}`);
        }
        return implementation;
    }
} 