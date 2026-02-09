'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/services/analytics';

interface ArticleTrackerProps {
    articleId: number;
    slug: string;
}

export function ArticleTracker({ articleId, slug }: ArticleTrackerProps) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            // Track view on mount
            console.log(`Tracking view for article ${articleId}`);
            trackEvent(articleId, `/articles/${slug}`, 'view');
        }
    }, [articleId, slug]);

    return null; // This component renders nothing
}
