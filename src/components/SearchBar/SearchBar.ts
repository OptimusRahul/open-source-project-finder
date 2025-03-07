import { AccessibleBase } from '../base/AccessibleBase';
import { EventBus } from '../../core/EventBus';
import { Logger } from '../../utils/logger';
import { Validators } from '../../utils/validators';

export class SearchBar extends AccessibleBase {
    private eventBus: EventBus;

    constructor() {
        super();
        this.eventBus = EventBus.getInstance();
        this.setupA11y('search', 'Search for programming languages');
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        const input = this.shadow.querySelector('input');
        const button = this.shadow.querySelector('button');

        input?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        button?.addEventListener('click', () => {
            this.handleSearch();
        });
    }

    private handleSearch() {
        const input = this.shadow.querySelector('input') as HTMLInputElement;
        const language = input.value.trim();

        if (!Validators.isValidLanguage(language)) {
            Logger.warn('Invalid language input:', language);
            return;
        }

        this.eventBus.publish('language-selected', language);
    }

    protected render() {
        const styles = `
            .search-container {
                position: relative;
                max-width: 800px;
                margin: 0 auto 3rem;
            }

            .search-input {
                width: 100%;
                padding: 1.25rem 1.5rem;
                font-size: 1.125rem;
                color: var(--text-primary);
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 1rem;
                box-shadow: var(--card-shadow);
                transition: all 0.3s ease;
            }

            .search-input:focus {
                outline: none;
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
            }

            .search-button {
                position: absolute;
                right: 0.5rem;
                top: 50%;
                transform: translateY(-50%);
                padding: 0.75rem 1.5rem;
                background: var(--accent);
                color: white;
                border: none;
                border-radius: 0.75rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .search-button:hover {
                background: #0891b2;
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="search-container">
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="Enter a programming language to find open source issues..."
                    aria-label="Search programming languages"
                >
                <button class="search-button">
                    Search
                </button>
            </div>
        `;
    }
}

customElements.define('search-bar', SearchBar); 