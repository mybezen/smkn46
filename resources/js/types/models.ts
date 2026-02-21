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
    image: string;
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


export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Article {
    id: number;
    author_id: number;
    category_id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    author?: { id: number; name: string };
    category?: { id: number; name: string; slug: string };
}

export interface Banner {
    id: number;
    title: string;
    description: string | null;
    image: string;
    link: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: number;
    name: string;
    image: string | null;
    image_url: string | null;
    position: string;
    category: string | null;
    order: number | null;
    created_at: string;
    updated_at: string;
}

export interface Extracurricular {
    id: number;
    name: string;
    description: string | null;
    thumbnail: string | null;
    thumbnail_url: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export interface Facility {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface GalleryImage {
    id: number;
    gallery_id: number;
    image: string;
}

export interface Gallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    images: GalleryImage[];
}

export interface Major {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    preview_image: string | null;
    icon_url: string | null;
    preview_image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface SchoolProfile {
    id: number;
    type: string;
    title: string;
    content: string;
    data: Record<string, unknown> | null;
    main_image: string | null;
    main_image_url: string | null;
    order: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Setting {
    id: number;
    school_name: string;
    logo: string | null;
    logo_url: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    maps: string | null;
    facebook_link: string | null;
    instagram_link: string | null;
    twitter_link: string | null;
    youtube_link: string | null;
    created_at: string;
    updated_at: string;
}