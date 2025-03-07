export abstract class BaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    protected abstract render(): void;

    protected adoptStyles(styles: string): void {
        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(styles);
        this.shadow.adoptedStyleSheets = [styleSheet];
    }

    protected dispatch<T>(eventName: string, detail?: T): void {
        this.dispatchEvent(new CustomEvent(eventName, {
            detail,
            bubbles: true,
            composed: true
        }));
    }
} 