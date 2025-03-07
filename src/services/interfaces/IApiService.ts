export interface IApiService {
    fetch(url: string): Promise<Response>;
    getRateLimitInfo(): { remaining: number; limit: number; reset: number };
} 