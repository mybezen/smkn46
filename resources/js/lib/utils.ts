import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function storageUrl(path: string | null | undefined): string | undefined {
    if (!path) return undefined;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/storage/')) return path;
    return `/storage/${path.replace(/^\//, '')}`;
}

export function extractIframeSrc(value: string | null | undefined): string | undefined {
    if (!value) return undefined;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    const match = value.match(/src=["']([^"']+)["']/);
    return match ? match[1] : undefined;
}