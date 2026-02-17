import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Search, X, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Achievement, PaginatedData } from '@/types/models';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Achievements', href: '/admin/achievements' },
];

interface Props {
    achievements: PaginatedData<Achievement>;
    filters: {
        search?: string;
        category?: string;
    };
}

export default function Index({ achievements: data, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/achievements', { search, category }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        router.get('/admin/achievements');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this achievement?')) {
            router.delete(`/admin/achievements/${id}`, {
                onStart: () => setDeletingId(id),
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const getCategoryBadge = (cat: string) => {
        const styles = cat === 'akademik'
            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';

        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
                {cat === 'akademik' ? 'Akademik' : 'Non Akademik'}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Achievements" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">Achievements</h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Manage student achievements</p>
                    </div>
                    <Link href="/admin/achievements/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto">
                            <Plus className="mr-2 size-4" />
                            <span className="hidden sm:inline">Create Achievement</span>
                            <span className="sm:hidden">Create</span>
                        </Button>
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border dark:bg-card">
                    {/* Filter Section */}
                    <div className="border-b border-slate-200 p-3 sm:p-4 dark:border-sidebar-border">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search achievements..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={category || 'all'}
                                    onValueChange={(value) =>
                                        setCategory(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger className="w-full sm:w-[180px] border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="akademik">Akademik</SelectItem>
                                        <SelectItem value="non_akademik">Non Akademik</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white flex-1 sm:flex-none">
                                    Filter
                                </Button>
                                {(search || category) && (
                                    <Button type="button" variant="outline" onClick={handleReset} className="border-slate-200 hover:bg-slate-50">
                                        <X className="size-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Reset</span>
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-200 bg-slate-50/50 dark:border-sidebar-border dark:bg-transparent">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Thumbnail
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-muted-foreground">
                                        Category
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
                                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-muted-foreground">
                                            No achievements found
                                        </td>
                                    </tr>
                                ) : (
                                    data.data.map((achievement, index) => (
                                        <motion.tr
                                            key={achievement.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/50 dark:hover:bg-sidebar-accent transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                {achievement.thumbnail ? (
                                                    <img
                                                        src={achievement.thumbnail}
                                                        alt={achievement.title}
                                                        className="size-12 rounded-lg object-cover ring-1 ring-slate-200"
                                                    />
                                                ) : (
                                                    <div className="flex size-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-muted">
                                                        <span className="text-xs text-slate-400 dark:text-muted-foreground">No image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-md">
                                                    <div className="font-medium text-slate-900 dark:text-white">{achievement.title}</div>
                                                    <div className="line-clamp-1 text-sm text-slate-600 dark:text-muted-foreground">
                                                        {achievement.description}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getCategoryBadge(achievement.category)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-muted-foreground">
                                                {achievement.created_at}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/achievements/${achievement.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(achievement.id)}
                                                        disabled={deletingId === achievement.id}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        {deletingId === achievement.id ? 'Deleting...' : 'Delete'}
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
                                No achievements found
                            </div>
                        ) : (
                            data.data.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 hover:bg-blue-50/50 dark:hover:bg-sidebar-accent transition-colors"
                                >
                                    <div className="flex gap-3">
                                        {achievement.thumbnail ? (
                                            <img
                                                src={achievement.thumbnail}
                                                alt={achievement.title}
                                                className="size-16 rounded-lg object-cover ring-1 ring-slate-200 flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="flex size-16 items-center justify-center rounded-lg bg-slate-100 dark:bg-muted flex-shrink-0">
                                                <span className="text-xs text-slate-400 dark:text-muted-foreground">No image</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-muted-foreground line-clamp-2 mt-1">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {getCategoryBadge(achievement.category)}
                                                <span className="text-xs text-slate-500 dark:text-muted-foreground">
                                                    {achievement.created_at}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-3">
                                        <Link href={`/admin/achievements/${achievement.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full border-slate-200 hover:bg-slate-50 hover:text-blue-600">
                                                <Edit className="mr-2 size-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(achievement.id)}
                                            disabled={deletingId === achievement.id}
                                            className="flex-1 bg-red-600 hover:bg-red-700"
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            {deletingId === achievement.id ? 'Deleting...' : 'Delete'}
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
                                            router.get(`/admin/achievements?page=${page}`, { search, category })
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