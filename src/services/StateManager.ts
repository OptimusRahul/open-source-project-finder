import { IStateManager } from './interfaces/IStateManager';
import { GitHubIssue } from '../types/github';
import { EventBus } from '../core/EventBus';
import { Logger } from '../utils/logger';

export class StateManager implements IStateManager {
    private static instance: StateManager;
    private eventBus: EventBus;
    private state: {
        issues: GitHubIssue[];
        filteredIssues: GitHubIssue[];
        currentPage: number;
        itemsPerPage: number;
        currentLanguage: string;
        searchTerm: string;
        sortBy: 'stars' | 'recent' | 'issues';
    };

    private constructor() {
        this.eventBus = EventBus.getInstance();
        this.state = {
            issues: [],
            filteredIssues: [],
            currentPage: 1,
            itemsPerPage: 12,
            currentLanguage: '',
            searchTerm: '',
            sortBy: 'stars'
        };
    }

    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    public setIssues(issues: GitHubIssue[]) {
        this.state.issues = issues;
        this.state.filteredIssues = issues;
        this.sortIssues(this.state.sortBy);
        this.eventBus.publish('issues-updated', this.getCurrentPageIssues());
    }

    public getIssues(): GitHubIssue[] {
        return this.state.issues;
    }

    public getCurrentPageIssues(): GitHubIssue[] {
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        return this.state.filteredIssues.slice(startIndex, endIndex);
    }

    public setPage(page: number) {
        const totalPages = Math.ceil(this.state.filteredIssues.length / this.state.itemsPerPage);
        if (page < 1 || page > totalPages) {
            Logger.warn('Invalid page number:', page);
            return;
        }

        this.state.currentPage = page;
        this.eventBus.publish('page-changed', {
            currentPage: page,
            totalPages,
            issues: this.getCurrentPageIssues()
        });
    }

    public setLanguage(language: string) {
        this.state.currentLanguage = language;
        this.state.currentPage = 1;
        this.eventBus.publish('language-changed', language);
    }

    public filterBySearch(searchTerm: string) {
        this.state.searchTerm = searchTerm;
        this.state.filteredIssues = this.state.issues.filter(issue => 
            issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.body?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.state.currentPage = 1;
        this.eventBus.publish('issues-filtered', this.getCurrentPageIssues());
    }

    public sortIssues(sortBy: 'stars' | 'recent' | 'issues') {
        this.state.sortBy = sortBy;
        this.state.filteredIssues.sort((a, b) => {
            switch (sortBy) {
                case 'stars':
                    return ((b.repository?.stargazers_count ?? 0) - (a.repository?.stargazers_count ?? 0));
                case 'recent':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'issues':
                    return ((b.repository?.open_issues_count ?? 0) - (a.repository?.open_issues_count ?? 0));
                default:
                    return 0;
            }
        });
        this.eventBus.publish('issues-sorted', this.getCurrentPageIssues());
    }

    public getCurrentPage(): number {
        return this.state.currentPage;
    }

    public getTotalPages(): number {
        return Math.ceil(this.state.filteredIssues.length / this.state.itemsPerPage);
    }
} 