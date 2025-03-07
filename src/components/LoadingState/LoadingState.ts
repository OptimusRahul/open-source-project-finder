import { AccessibleBase } from '../base/AccessibleBase';

export class LoadingState extends AccessibleBase {
    static get observedAttributes() {
        return ['active'];
    }

    constructor() {
        super();
        this.setupA11y('status', 'Loading status');
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === 'active') {
            this.render();
        }
    }

    protected render() {
        const isActive = this.getAttribute('active') === 'true';

        const styles = `
            .loader {
                display: ${isActive ? 'flex' : 'none'};
                justify-content: center;
                padding: 2rem;
            }

            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--border-color);
                border-top-color: var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="loader" role="status" aria-label="Loading">
                <div class="spinner"></div>
            </div>
        `;
    }
}

customElements.define('loading-state', LoadingState); 