export class Validators {
    static isValidLanguage(language: string): boolean {
        return /^[a-zA-Z0-9+#]+$/.test(language);
    }

    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
} 