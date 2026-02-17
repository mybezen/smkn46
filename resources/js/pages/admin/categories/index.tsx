import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    Tag,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCategories {
    data: Category[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    categories: PaginatedCategories;
    filters: {
        search?: string;
    };
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CategoriesIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/categories', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!deleteSlug) return;
        setDeleteLoading(true);
        router.delete(`/admin/categories/${deleteSlug}`, {
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteSlug(null);
            },
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <AppLayout>
            <Head title="Categories" />

            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Flash Messages */}
                <AnimatePresence>
                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
                        >
                            {flash.success}
                        </motion.div>
                    )}
                    {flash?.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                        >
                            {flash.error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage article categories</p>
                    </div>
                    <Link href="/admin/categories/create">
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                {/* Main Card */}
                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-blue-500" />
                                All Categories
                                <Badge variant="secondary" className="ml-1 text-xs">
                                    {categories.total}
                                </Badge>
                            </CardTitle>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search categories..."
                                        className="pl-9 w-64 h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                    />
                                </div>
                                <Button type="submit" size="sm" variant="outline" className="h-9 border-gray-200">
                                    Search
                                </Button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/60">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                    <AnimatePresence>
                                        {categories.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <Tag className="h-10 w-10 text-gray-200" />
                                                        <p className="text-sm font-medium">No categories found</p>
                                                        <p className="text-xs">
                                                            {filters.search ? 'Try a different search term.' : 'Start by creating a category.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            categories.data.map((category) => (
                                                <motion.tr
                                                    key={category.id}
                                                    variants={rowVariants}
                                                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-900 text-sm">{category.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <code className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-mono">
                                                            {category.slug}
                                                        </code>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {formatDate(category.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-36">
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        href={`/admin/categories/${category.slug}/edit`}
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                    onClick={() => setDeleteSlug(category.slug)}
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </motion.tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden">
                            {categories.data.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                                    <Tag className="h-10 w-10 text-gray-200" />
                                    <p className="text-sm font-medium">No categories found</p>
                                </div>
                            ) : (
                                <motion.div
                                    className="divide-y divide-gray-100"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {categories.data.map((category) => (
                                        <motion.div
                                            key={category.id}
                                            variants={rowVariants}
                                            className="flex items-center justify-between px-4 py-4 hover:bg-blue-50/30 transition-colors"
                                        >
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <span className="font-medium text-gray-900 text-sm truncate">{category.name}</span>
                                                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 font-mono self-start">
                                                    {category.slug}
                                                </code>
                                                <span className="text-xs text-gray-400">{formatDate(category.created_at)}</span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 flex-shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-36">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/categories/${category.slug}/edit`}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteSlug(category.slug)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Pagination */}
                        {categories.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">
                                    Showing {categories.from}–{categories.to} of {categories.total}
                                </p>
                                <div className="flex items-center gap-1">
                                    {categories.links.map((link, i) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className="h-8 w-8 p-0 border-gray-200">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    className="h-8 w-8 p-0 border-gray-200">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        return (
                                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                className={`h-8 w-8 p-0 text-xs ${link.active ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' : 'border-gray-200'}`}>
                                                {link.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteSlug} onOpenChange={(open) => !open && setDeleteSlug(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">Delete Category</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                This action cannot be undone. This category will be permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setDeleteSlug(null)} disabled={deleteLoading} className="border-gray-200">
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogFooter>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}