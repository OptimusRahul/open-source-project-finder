import { GitHubIssue } from '../../types/github';

export interface IGithubService {
    searchIssues(language: string): Promise<GitHubIssue[]>;
    getRepoData(owner: string, repo: string): Promise<any>;
    getRateLimitInfo(): { remaining: number; limit: number; reset: number };
} 