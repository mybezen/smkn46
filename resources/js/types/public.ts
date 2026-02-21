export interface Setting {
    id: number;
    school_name: string;
    logo_url: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    maps: string | null;
    facebook_link: string ;
    instagram_link: string;
    twitter_link: string ;
    youtube_link: string ;
    created_at: string;
    updated_at: string;
}

export interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_url: string;
    link: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Major {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    preview_image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Article {
    id: number;
    author_id: number;
    category_id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    author?: { id: number; name: string };
    category?: { id: number; name: string; slug: string };
}

export interface SchoolProfile {
    id: number;
    type: string;
    title: string;
    content: string;
    data: Record<string, unknown> | null;
    main_image_url: string | null;
    order: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Achievement {
    id: number;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: number;
    name: string;
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
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Gallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    images: { id: number; image_url: string }[];
}