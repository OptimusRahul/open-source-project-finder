import { GitHubIssue } from '../../types/github';

export interface IStateManager {
    setIssues(issues: GitHubIssue[]): void;
    getIssues(): GitHubIssue[];
    getCurrentPageIssues(): GitHubIssue[];
    setPage(page: number): void;
    setLanguage(language: string): void;
    filterBySearch(searchTerm: string): void;
    sortIssues(sortBy: 'stars' | 'recent' | 'issues'): void;
} 