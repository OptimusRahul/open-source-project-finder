import { IGithubService } from './interfaces/IGithubService';
import { GitHubIssue, GitHubSearchResponse } from '../types/github';
import { ApiService } from './ApiService';
import { Logger } from '../utils/logger';
import { config } from '../config/config';

export class GithubService implements IGithubService {
    private static instance: GithubService;
    private apiService: ApiService;
    private baseUrl: string;

    private constructor() {
        this.apiService = ApiService.getInstance();
        this.baseUrl = config.github.baseUrl;
    }

    public static getInstance(): GithubService {
        if (!GithubService.instance) {
            GithubService.instance = new GithubService();
        }
        return GithubService.instance;
    }

    public async searchIssues(language: string): Promise<GitHubIssue[]> {
        try {
            const url = `${this.baseUrl}/search/issues?q=label:good-first-issue+is:issue+is:open+language:${language}&per_page=100`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Raw API response:", data);
            
            // Transform the items to match our GitHubIssue interface
            const items = data.items || [];
            return items.map((item: any) => {
                // Extract repository name from repository_url
                // Format: https://api.github.com/repos/owner/repo
                let repoName = "unknown/unknown";
                let repoOwner = "unknown";
                let repoRepo = "unknown";
                
                if (item.repository_url) {
                    const urlParts = item.repository_url.split('/');
                    repoOwner = urlParts[urlParts.length - 2];
                    repoRepo = urlParts[urlParts.length - 1];
                    repoName = `${repoOwner}/${repoRepo}`;
                }
                
                // Create a properly formatted GitHubIssue object
                return {
                    id: item.id,
                    title: item.title || 'No Title',
                    body: item.body || '',
                    html_url: item.html_url || '#',
                    created_at: item.created_at || new Date().toISOString(),
                    comments: item.comments || 0,
                    labels: Array.isArray(item.labels) ? item.labels : [],
                    user: {
                        login: item.user?.login || 'unknown',
                        avatar_url: item.user?.avatar_url || ''
                    },
                    repository: {
                        full_name: repoName,
                        stargazers_count: 0, // We don't have this info yet
                        open_issues_count: 0  // We don't have this info yet
                    }
                };
            });
        } catch (error) {
            console.error('Failed to fetch issues:', error);
            return [];
        }
    }

    public async getRepoData(owner: string, repo: string) {
        try {
            const url = `${this.baseUrl}/repos/${owner}/${repo}`;
            const response = await this.apiService.fetch(url);
            return await response.json();
        } catch (error) {
            Logger.error('Failed to get repo data:', error as Error);
            throw error;
        }
    }

    public getRateLimitInfo() {
        return this.apiService.getRateLimitInfo();
    }
} 