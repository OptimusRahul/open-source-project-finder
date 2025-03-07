export const config = {
    github: {
        baseUrl: 'https://api.github.com',
        perPage: 100,
        defaultLanguage: 'javascript'
    },
    app: {
        itemsPerPage: 12,
        cacheDuration: 5 * 60 * 1000, // 5 minutes
        maxRetries: 3,
        retryDelay: 1000 // 1 second
    }
}; 