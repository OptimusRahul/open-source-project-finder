type EventCallback = (data: any) => void;

export class EventBus {
    private static instance: EventBus;
    private listeners: Map<string, EventCallback[]> = new Map();

    private constructor() {}

    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    subscribe(event: string, callback: EventCallback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    publish(event: string, data?: any): void {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    unsubscribe(event: string, callback: EventCallback): void {
        const callbacks = this.listeners.get(event) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
} 