import { AccessibleBase } from '../base/AccessibleBase';
import { GitHubIssue } from '../../types/github';
import { Logger } from '../../utils/logger';

export class IssueCard extends AccessibleBase {
    private _issue: GitHubIssue | null = null;

    static get observedAttributes() {
        return ['data'];
    }

    constructor() {
        super();
        this.setupA11y('article', 'GitHub Issue');
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === 'data') {
            try {
                // Try to parse the data
                this._issue = JSON.parse(newValue);
                this.render();
            } catch (error) {
                console.error('Failed to parse issue data', error);
                // Try to handle HTML-escaped JSON
                try {
                    const unescaped = newValue
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#039;/g, "'");
                    this._issue = JSON.parse(unescaped);
                    this.render();
                } catch (innerError) {
                    console.error('Failed to parse unescaped issue data', innerError);
                    this.renderError();
                }
            }
        }
    }

    connectedCallback() {
        this.render();
    }

    protected render() {
        const styles = `
            :host {
                display: block;
                padding: 8px;
                transition: transform 0.3s ease;
            }
            
            :host(:hover) {
                transform: translateY(-8px);
            }

            .card {
                height: 100%;
                display: flex;
                flex-direction: column;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                position: relative;
                z-index: 1;
            }
            
            .card:hover {
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                border-color: var(--accent-blue);
            }
            
            .card:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, #58a6ff, #1f6feb);
                z-index: 2;
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.3s ease;
            }
            
            .card:hover:before {
                transform: scaleX(1);
            }

            .card-header {
                padding: 20px;
                border-bottom: 1px solid var(--border-color);
                background: linear-gradient(to right, var(--bg-card), var(--bg-secondary));
            }

            .title {
                font-size: 17px;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                line-height: 1.5;
            }

            .repo-name {
                font-size: 13px;
                color: var(--accent-blue);
                margin-top: 8px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .repo-name:before {
                content: '📦';
                font-size: 14px;
            }

            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 16px 20px;
                flex-grow: 1;
                min-height: 80px;
            }

            .tag {
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                background: var(--tag-bg);
                color: var(--accent-blue);
                font-weight: 500;
                letter-spacing: 0.3px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
            }
            
            .tag:hover {
                background: rgba(56, 139, 253, 0.25);
                transform: translateY(-2px);
            }

            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: var(--bg-secondary);
                border-top: 1px solid var(--border-color);
            }

            .stats {
                display: flex;
                gap: 16px;
                color: var(--text-secondary);
                font-size: 14px;
            }

            .stats span {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .view-button {
                padding: 8px 16px;
                background: var(--accent-blue);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                position: relative;
                overflow: hidden;
            }
            
            .view-button:before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.2);
                transition: transform 0.5s ease;
                transform: skewX(-15deg);
            }
            
            .view-button:hover {
                background: #2188ff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .view-button:hover:before {
                transform: translateX(200%) skewX(-15deg);
            }
        `;

        const issue = this._issue;
        if (!issue) return;

        // Extract repository name from full_name or URL
        let repoName = issue.repository?.full_name || '';
        if (!repoName && issue.html_url) {
            const urlParts = issue.html_url.split('/');
            if (urlParts.length >= 4) {
                repoName = `${urlParts[3]}/${urlParts[4]}`;
            }
        }

        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="card">
                <div class="card-header">
                    <h3 class="title">${issue.title}</h3>
                    <div class="repo-name">${repoName}</div>
                </div>
                
                <div class="tags">
                    ${Array.isArray(issue.labels) && issue.labels.length > 0 
                        ? issue.labels.map((label: any) => `
                            <span class="tag">${label.name}</span>
                        `).join('') 
                        : '<span class="tag">good-first-issue</span>'}
                </div>

                <div class="card-footer">
                    <div class="stats">
                        <span>⭐ ${issue.repository?.stargazers_count ?? 0}</span>
                        <span>💬 ${issue.comments ?? 0}</span>
                    </div>
                    <a href="${issue.html_url}" class="view-button" target="_blank">
                        View Issue
                    </a>
                </div>
            </div>
        `;
    }

    private renderError() {
        const styles = `
            :host {
                display: block;
            }
            .error-card {
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px;
                color: #ff5555;
            }
        `;
        
        this.shadow.innerHTML = `
            <style>${styles}</style>
            <div class="error-card">
                <p>Failed to load issue data</p>
            </div>
        `;
    }
}

customElements.define('issue-card', IssueCard); 