export type Theme = 'light' | 'dark';

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    meta?: {
        rateLimit?: {
            remaining: number;
            limit: number;
            reset: number;
        }
    };
} 