import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Search, X, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Banner, PaginatedData } from '@/types/models';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Banners', href: '/admin/banners' },
];

interface Props {
    banners: PaginatedData<Banner>;
    filters: {
        search?: string;
        is_active?: string;
    };
}

export default function Index({ banners: data, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/banners', { search }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/admin/banners');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(`/admin/banners/${id}`, {
                onStart: () => setDeletingId(id),
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banners" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">Banners</h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Manage homepage banners</p>
                    </div>
                    <Link href="/admin/banners/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto">
                            <Plus className="mr-2 size-4" />
                            <span className="hidden sm:inline">Create Banner</span>
                            <span className="sm:hidden">Create</span>
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border dark:bg-card">
                    {/* Filter Section */}
                    <div className="border-b border-slate-200 p-3 sm:p-4 dark:border-sidebar-border">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search banners..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white">
                                Filter
                            </Button>
                            {search && (
                                <Button type="button" variant="outline" onClick={handleReset} className="border-slate-200 hover:bg-slate-50">
                                    <X className="size-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Reset</span>
                                </Button>
                            )}
                        </form>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-200 bg-slate-50/50 dark:border-sidebar-border dark:bg-transparent">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Image
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Created At
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-sidebar-border">
                                {data.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-muted-foreground">
                                            No banners found
                                        </td>
                                    </tr>
                                ) : (
                                    data.data.map((banner, index) => (
                                        <motion.tr
                                            key={banner.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/50 dark:hover:bg-sidebar-accent transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <img
                                                    src={banner.image}
                                                    alt={banner.title}
                                                    className="h-16 w-28 rounded-lg object-cover ring-1 ring-slate-200"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-md">
                                                    <div className="font-medium text-slate-900 dark:text-white">{banner.title}</div>
                                                    {banner.description && (
                                                        <div className="line-clamp-1 text-sm text-slate-600 dark:text-muted-foreground">
                                                            {banner.description}
                                                        </div>
                                                    )}
                                                    {banner.link && (
                                                        <a
                                                            href={banner.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                                        >
                                                            <ExternalLink className="size-3" />
                                                            {banner.link.substring(0, 30)}...
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                                                    {banner.order}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                        banner.is_active
                                                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
                                                    }`}
                                                >
                                                    {banner.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-muted-foreground">
                                                {banner.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/banners/${banner.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(banner.id)}
                                                        disabled={deletingId === banner.id}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        {deletingId === banner.id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-200 dark:divide-sidebar-border">
                        {data.data.length === 0 ? (
                            <div className="px-4 py-12 text-center text-sm text-slate-500 dark:text-muted-foreground">
                                No banners found
                            </div>
                        ) : (
                            data.data.map((banner, index) => (
                                <motion.div
                                    key={banner.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 hover:bg-blue-50/50 dark:hover:bg-sidebar-accent transition-colors"
                                >
                                    <div className="space-y-3">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-full h-40 rounded-lg object-cover ring-1 ring-slate-200"
                                        />
                                        
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-medium text-slate-900 dark:text-white flex-1">
                                                    {banner.title}
                                                </h3>
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold flex-shrink-0 ${
                                                        banner.is_active
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}
                                                >
                                                    {banner.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            
                                            {banner.description && (
                                                <p className="text-sm text-slate-600 dark:text-muted-foreground line-clamp-2 mt-1">
                                                    {banner.description}
                                                </p>
                                            )}
                                            
                                            {banner.link && (
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    <ExternalLink className="size-3" />
                                                    <span className="truncate">{banner.link}</span>
                                                </a>
                                            )}
                                            
                                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium">
                                                    Order: {banner.order}
                                                </span>
                                                <span>•</span>
                                                <span>{banner.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-3">
                                        <Link href={`/admin/banners/${banner.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                                                <Edit className="mr-2 size-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(banner.id)}
                                            disabled={deletingId === banner.id}
                                            className="flex-1 bg-red-600 hover:bg-red-700"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            {deletingId === banner.id ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {data.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 px-3 sm:px-4 py-3 bg-slate-50/50 dark:border-sidebar-border dark:bg-transparent">
                            <div className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground text-center sm:text-left">
                                Showing {data.from} to {data.to} of {data.total} results
                            </div>
                            <div className="flex gap-1 flex-wrap justify-center">
                                {Array.from({ length: data.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === data.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        className={page === data.current_page ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200 hover:bg-slate-50'}
                                        onClick={() =>
                                            router.get(`/admin/banners?page=${page}`, { search })
                                        }
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}