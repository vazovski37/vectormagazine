export interface Subscriber {
    id: number;
    email: string;
    is_active: boolean;
    created_at: string;
}

export interface SubscribersResponse {
    subscribers: Subscriber[];
    total: number;
    pages: number;
    current_page: number;
}
