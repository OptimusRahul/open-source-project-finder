import { IApiService } from './interfaces/IApiService';
import { Logger } from '../utils/logger';

export class ApiService implements IApiService {
    private static instance: ApiService;
    private rateLimit = { remaining: 60, limit: 60, reset: 0 };
    private cache = new Map<string, { data: any; timestamp: number }>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public async fetch(url: string): Promise<Response> {
        const cachedData = this.getFromCache(url);
        if (cachedData) {
            return new Response(JSON.stringify(cachedData), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            this.updateRateLimit(response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setInCache(url, data);

            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            Logger.error('API fetch error:', error as Error);
            throw error;
        }
    }

    public getRateLimitInfo() {
        return this.rateLimit;
    }

    private updateRateLimit(response: Response) {
        this.rateLimit = {
            remaining: Number(response.headers.get('x-ratelimit-remaining')),
            limit: Number(response.headers.get('x-ratelimit-limit')),
            reset: Number(response.headers.get('x-ratelimit-reset'))
        };
    }

    private getFromCache(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    private setInCache(key: string, data: any) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
} 