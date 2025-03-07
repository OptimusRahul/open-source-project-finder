import { GithubService } from './services/GithubService';
import { StateManager } from './services/StateManager';
import './components/Sidebar/Sidebar';
import './components/IssueCard/IssueCard';
import './components/SearchBar/SearchBar';
import './components/ThemeToggle/ThemeToggle';
import './components/PaginationControls/PaginationControls';
import './components/Header/Header';

export class App {
    private api: GithubService;
    private state: StateManager;
    private container: HTMLElement | null;

    constructor() {
        this.api = GithubService.getInstance();
        this.state = StateManager.getInstance();
        this.container = document.getElementById('app');
        this.init();
    }

    private init() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="app-container">
                <app-sidebar></app-sidebar>
                <main>
                    <div class="header">
                        <span class="repo-count"></span>
                        <select class="sort-select">
                            <option value="stars">Most Stars</option>
                            <option value="recent">Most Recent</option>
                            <option value="issues">Most Issues</option>
                        </select>
                    </div>
                    <div id="issues-container" class="issues-grid"></div>
                    <loading-state></loading-state>
                    <pagination-controls></pagination-controls>
                </main>
            </div>
        `;

        this.setupEventListeners();
        this.loadDefaultLanguage();
    }

    private setupEventListeners() {
        // Listen for language selection
        document.addEventListener('language-selected', (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            this.loadIssues(customEvent.detail);
        });

        // Listen for page changes
        document.addEventListener('page-changed', (e: Event) => {
            const customEvent = e as CustomEvent<number>;
            this.state.setPage(customEvent.detail);
            this.renderIssues();
        });

        // Listen for theme changes
        document.addEventListener('theme-changed', (e: Event) => {
            const customEvent = e as CustomEvent<'light' | 'dark'>;
            document.body.setAttribute('data-theme', customEvent.detail);
        });

        // Listen for sort changes
        document.addEventListener('sort-changed', (e: Event) => {
            const customEvent = e as CustomEvent<'stars' | 'recent' | 'issues'>;
            this.state.sortIssues(customEvent.detail);
            this.renderIssues();
        });
    }

    private async loadDefaultLanguage() {
        await this.loadIssues('JavaScript');
    }

    private async loadIssues(language: string) {
        const loadingState = document.querySelector('loading-state');
        if (loadingState) {
            loadingState.setAttribute('active', 'true');
        }

        try {
            const issues = await this.api.searchIssues(language);
            this.state.setIssues(issues);
            this.updateRepoCount(issues.length);
            this.renderIssues();
        } catch (error) {
            console.error('Failed to load issues:', error);
        } finally {
            if (loadingState) {
                loadingState.setAttribute('active', 'false');
            }
        }
    }

    private updateRepoCount(count: number) {
        const repoCount = document.querySelector('.repo-count');
        if (repoCount) {
            repoCount.textContent = `${count} repositories found`;
        }
    }

    private renderIssues() {
        const container = document.getElementById('issues-container');
        if (!container) return;

        container.innerHTML = '';
        const issues = this.state.getCurrentPageIssues();
        
        if (issues.length === 0) {
            container.innerHTML = '<div class="no-issues">No issues found. Try another language.</div>';
            return;
        }

        // Render each issue directly without using custom elements
        issues.forEach(issue => {
            const title = issue.title || 'No Title';
            const labels = Array.isArray(issue.labels) ? issue.labels : [];
            const repoStars = issue.repository?.stargazers_count ?? 0;
            const comments = issue.comments ?? 0;
            const issueUrl = issue.html_url || '#';
            
            const cardHtml = `
                <div class="card">
                    <div class="card-header">
                        <h3 class="title">${title}</h3>
                    </div>
                    
                    <div class="tags">
                        ${labels.map((label: any) => `
                            <span class="tag">${label.name}</span>
                        `).join('')}
                    </div>

                    <div class="card-footer">
                        <div class="stats">
                            <span>⭐ ${repoStars}</span>
                            <span>💬 ${comments}</span>
                        </div>
                        <a href="${issueUrl}" class="view-button" target="_blank">
                            View Issue
                        </a>
                    </div>
                </div>
            `;
            
            const cardElement = document.createElement('div');
            cardElement.className = 'issue-card';
            cardElement.innerHTML = cardHtml;
            container.appendChild(cardElement);
        });

        // Update pagination
        const paginationControls = document.querySelector('pagination-controls');
        if (paginationControls) {
            paginationControls.setAttribute('current-page', this.state.getCurrentPage().toString());
            paginationControls.setAttribute('total-pages', this.state.getTotalPages().toString());
        }
    }
} 