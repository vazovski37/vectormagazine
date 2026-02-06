export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
    last_login: string | null;
}

export interface LoginResponse {
    access_token: string;
    user: User;
    expires_in: number;
}

export interface AuthError {
    error: string;
}
