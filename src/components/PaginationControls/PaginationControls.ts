import { AccessibleBase } from '../base/AccessibleBase';
import { EventBus } from '../../core/EventBus';

export class PaginationControls extends AccessibleBase {
    private currentPage = 1;
    private totalPages = 1;
    private eventBus: EventBus;

    constructor() {
        super();
        this.eventBus = EventBus.getInstance();
        this.setupA11y('navigation', 'Page navigation');
    }

    static get observedAttributes() {
        return ['current-page', 'total-pages'];
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === 'current-page') {
            this.currentPage = parseInt(newValue, 10);
        } else if (name === 'total-pages') {
            this.totalPages = parseInt(newValue, 10);
        }
        this.render();
    }

    private handlePageChange(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.eventBus.publish('page-changed', page);
            this.render();
        }
    }

    protected render() {
        const styles = `
            .pagination {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin: 2rem 0;
            }

            button {
                padding: 0.5rem 1rem;
                border: 1px solid var(--border-color);
                background: var(--surface);
                color: var(--text-primary);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }

            button:hover:not(:disabled) {
                background: var(--primary-color);
                color: white;
            }

            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .current {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="pagination">
                <button 
                    onclick="this.getRootNode().host.handlePageChange(${this.currentPage - 1})"
                    disabled="${this.currentPage === 1}"
                    aria-label="Previous page">
                    ←
                </button>

                ${this.generatePageButtons()}

                <button 
                    onclick="this.getRootNode().host.handlePageChange(${this.currentPage + 1})"
                    disabled="${this.currentPage === this.totalPages}"
                    aria-label="Next page">
                    →
                </button>
            </div>
        `;
    }

    private generatePageButtons() {
        const pages = [];
        const maxVisiblePages = 5;

        let start = Math.max(1, this.currentPage - 2);
        let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(`
                <button 
                    onclick="this.getRootNode().host.handlePageChange(${i})"
                    class="${i === this.currentPage ? 'current' : ''}"
                    aria-label="Page ${i}"
                    aria-current="${i === this.currentPage ? 'page' : 'false'}">
                    ${i}
                </button>
            `);
        }

        return pages.join('');
    }
}

customElements.define('pagination-controls', PaginationControls); 