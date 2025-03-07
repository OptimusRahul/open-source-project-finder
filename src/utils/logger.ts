export class Logger {
    static info(message: string, ...args: any[]) {
        console.info(`[INFO] ${message}`, ...args);
    }

    static error(message: string, error?: Error) {
        console.error(`[ERROR] ${message}`, error);
    }

    static warn(message: string, ...args: any[]) {
        console.warn(`[WARN] ${message}`, ...args);
    }
} 