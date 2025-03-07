import { AccessibleBase } from '../base/AccessibleBase';

export class SidebarComponent extends AccessibleBase {
    private languages = [
        { name: 'JavaScript', icon: '��' },
        { name: 'Python', icon: '🐍' },
        { name: 'Java', icon: '☕' },
        { name: 'TypeScript', icon: '💙' },
        { name: 'Go', icon: '🔵' },
        { name: 'Rust', icon: '⚙️' },
        { name: 'C++', icon: '⚡' },
        { name: 'Ruby', icon: '💎' },
        { name: 'PHP', icon: '🐘' },
        { name: 'Swift', icon: '🦅' }
    ];

    constructor() {
        super();
        this.setupA11y('nav', 'Language Selection');
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    protected render() {
        const styles = `
            :host {
                display: block;
            }
            
            .sidebar {
                background: var(--bg-secondary);
                border-radius: 12px;
                padding: 24px;
                position: sticky;
                top: 24px;
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 32px;
            }
            
            .logo-circle {
                width: 24px;
                height: 24px;
                background: var(--accent-blue);
                border-radius: 50%;
            }
            
            .filters-title {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
                color: var(--text-secondary);
                font-size: 14px;
            }
            
            .language-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .language-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .language-item:hover {
                background: var(--hover-bg);
            }
            
            .language-item.active {
                background: var(--active-bg);
            }
        `;

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="sidebar">
                <div class="logo">
                    <div class="logo-circle"></div>
                    <span>Open Source Journey</span>
                </div>
                
                <div class="filters-title">
                    <span>⚡</span>
                    <span>Filters</span>
                </div>
                
                <div class="language-list">
                    <div class="language-item active" data-language="javascript">
                        <span>💛</span>
                        <span>JavaScript</span>
                    </div>
                    <div class="language-item" data-language="python">
                        <span>🐍</span>
                        <span>Python</span>
                    </div>
                    <div class="language-item" data-language="java">
                        <span>☕</span>
                        <span>Java</span>
                    </div>
                    <div class="language-item" data-language="typescript">
                        <span>💙</span>
                        <span>TypeScript</span>
                    </div>
                    <div class="language-item" data-language="go">
                        <span>🔵</span>
                        <span>Go</span>
                    </div>
                    <div class="language-item" data-language="rust">
                        <span>⚙️</span>
                        <span>Rust</span>
                    </div>
                    <div class="language-item" data-language="c++">
                        <span>⚡</span>
                        <span>C++</span>
                    </div>
                    <div class="language-item" data-language="ruby">
                        <span>💎</span>
                        <span>Ruby</span>
                    </div>
                </div>
            </div>
        `;
    }

    private setupEventListeners() {
        const items = this.querySelectorAll('.language-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const language = item.getAttribute('data-language');
                this.dispatchEvent(new CustomEvent('language-selected', {
                    detail: language,
                    bubbles: true
                }));
            });
        });
    }
}

customElements.define('app-sidebar', SidebarComponent); 