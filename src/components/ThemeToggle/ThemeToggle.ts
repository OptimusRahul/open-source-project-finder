import { AccessibleBase } from '../base/AccessibleBase';
import { EventBus } from '../../core/EventBus';
import { Theme } from '../../types/common';

export class ThemeToggle extends AccessibleBase {
    private currentTheme: Theme = 'light';
    private eventBus: EventBus;

    constructor() {
        super();
        this.eventBus = EventBus.getInstance();
        this.setupA11y('button', 'Toggle theme');
    }

    connectedCallback() {
        this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.render();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.eventBus.publish('theme-changed', this.currentTheme);
            this.render();
        });
    }

    protected render() {
        const styles = `
            button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                color: var(--text-primary);
                font-size: 1.5rem;
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <button aria-label="Toggle theme">
                ${this.currentTheme === 'light' ? '🌙' : '☀️'}
            </button>
        `;
    }
}

customElements.define('theme-toggle', ThemeToggle); 