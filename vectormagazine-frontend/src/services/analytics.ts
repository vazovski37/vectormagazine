import { supabase } from '@/lib/supabase';

export async function trackEvent(articleId: number, path: string, eventType: string = 'view') {
    try {
        await supabase.from('analytics').insert({
            path: path,
            // Additional fields can be populated here if needed (user_agent, ip_address, session_id)
            // supabase auth uid can also be used if users log in on the frontend
        });
    } catch (error) {
        console.error('Failed to track analytics event:', error);
    }
}
