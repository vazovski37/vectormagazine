export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    count?: number; // Optional field from potential API extensions
}

export interface CreateCategoryData {
    name: string;
    slug?: string;
    description?: string | null;
}
