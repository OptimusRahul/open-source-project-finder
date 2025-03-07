export interface GitHubIssue {
    id: number;
    title: string;
    body: string;
    html_url: string;
    created_at: string;
    comments: number;
    labels: Array<{ name: string; color: string }>;
    user: {
        login: string;
        avatar_url: string;
    };
    repository: {
        full_name: string;
        stargazers_count: number;
        open_issues_count: number;
    };
}

export interface GitHubSearchResponse {
    items: GitHubIssue[];
} 