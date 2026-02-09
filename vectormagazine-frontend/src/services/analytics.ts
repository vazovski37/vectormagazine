export async function trackEvent(articleId: number, path: string, eventType: string = 'view') {
    try {
        // Determine the API base URL. Use localhost:5000 directly for now as per admin panel setup
        // Ideally this should come from env var NEXT_PUBLIC_BACKEND_URL
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

        await fetch(`${BASE_URL}/api/analytics/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                article_id: articleId,
                path,
                event_type: eventType,
            }),
            // Don't block navigation, fire and forget logic often preferred for analytics
            keepalive: true,
        });
    } catch (error) {
        console.error('Failed to track analytics event:', error);
    }
}
