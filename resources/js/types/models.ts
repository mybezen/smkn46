export type AchievementCategory = 'akademik' | 'non_akademik';

export interface Achievement {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    thumbnail_url: string | null;
    category: AchievementCategory;
    created_at: string;
}

export interface AchievementFormData {
    title: string;
    description: string;
    category: AchievementCategory;
    thumbnail?: File | null;
}

export interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    thumbnail_url: string | null;
    link: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
}

export interface BannerFormData {
    title: string;
    description?: string;
    image?: File | null;
    link?: string;
    is_active: boolean;
    order: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

