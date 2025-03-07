import { BaseComponent } from '../../core/BaseComponent';

export class Header extends BaseComponent {
    protected render(): void {
        const styles = `
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                background: var(--bg-card);
                border-radius: 8px;
                margin-bottom: 2rem;
            }

            .repo-count {
                color: var(--text-primary);
                font-size: 0.9rem;
            }

            .sort-select {
                padding: 0.5rem;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                color: var(--text-primary);
                cursor: pointer;
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="header">
                <span class="repo-count">0 repositories found</span>
                <select class="sort-select">
                    <option value="stars">Most Stars</option>
                    <option value="recent">Most Recent</option>
                    <option value="issues">Most Issues</option>
                </select>
            </div>
        `;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const select = this.shadow.querySelector('.sort-select');
        select?.addEventListener('change', (e) => {
            const value = (e.target as HTMLSelectElement).value;
            this.dispatchEvent(new CustomEvent('sort-changed', {
                detail: value,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('app-header', Header); 