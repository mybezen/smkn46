import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, Variants, easeOut } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    MoreVertical,
    Pencil,
    Trash2,
    FileText,
    ChevronLeft,
    ChevronRight,
    Eye,
    ImageOff,
} from 'lucide-react';

interface Author {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    is_published: boolean;
    created_at: string;
    author: Author;
    category: Category;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedArticles {
    data: Article[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    articles: PaginatedArticles;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const fadeIn = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ArticlesIndex({ articles, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category ?? '');
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/articles', { search, category: categoryFilter }, { preserveState: true, replace: true });
    };

    const handleCategoryFilter = (value: string) => {
        const cat = value === 'all' ? '' : value;
        setCategoryFilter(cat);
        router.get('/admin/articles', { search, category: cat }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (!deleteSlug) return;
        setDeleteLoading(true);
        router.delete(`/admin/articles/${deleteSlug}`, {
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteSlug(null);
            },
        });
    };

    // Route: PUT /admin/articles/{slug}/status
    const handleToggleStatus = (slug: string) => {
        setTogglingSlug(slug);
        router.put(
            `/admin/articles/${slug}/status`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingSlug(null),
            }
        );
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const getThumbnailUrl = (thumbnail: string | null) =>
        thumbnail ? `/storage/${thumbnail}` : null;

    return (
        <AppLayout>
            <Head title="Articles" />

            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Flash Messages */}
                <AnimatePresence>
                    {flash?.success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
                        >
                            {flash.success}
                        </motion.div>
                    )}
                    {flash?.error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                        >
                            {flash.error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage published content</p>
                    </div>
                    <Link href="/admin/articles/create">
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Plus className="h-4 w-4" />
                            New Article
                        </Button>
                    </Link>
                </div>

                {/* Main Card */}
                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                All Articles
                                <Badge variant="secondary" className="ml-1 text-xs">{articles.total}</Badge>
                            </CardTitle>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                {/* Category Filter */}
                                <Select value={categoryFilter || 'all'} onValueChange={handleCategoryFilter}>
                                    <SelectTrigger className="h-9 w-full sm:w-44 border-gray-200 text-sm">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Search */}
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search articles..."
                                            className="pl-9 w-full sm:w-56 h-9 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                        />
                                    </div>
                                    <Button type="submit" size="sm" variant="outline" className="h-9 border-gray-200 flex-shrink-0">
                                        Search
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/60">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Thumb</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                    <AnimatePresence>
                                        {articles.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <FileText className="h-10 w-10 text-gray-200" />
                                                        <p className="text-sm font-medium">No articles found</p>
                                                        <p className="text-xs">
                                                            {filters.search || filters.category ? 'Try adjusting your filters.' : 'Start by creating your first article.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            articles.data.map((article) => (
                                                <motion.tr
                                                    key={article.id}
                                                    variants={rowVariants}
                                                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                            {getThumbnailUrl(article.thumbnail) ? (
                                                                <img
                                                                    src={getThumbnailUrl(article.thumbnail)!}
                                                                    alt={article.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImageOff className="h-4 w-4 text-gray-300" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-900 text-sm line-clamp-2 max-w-xs">{article.title}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-xs font-medium">
                                                            {article.category.name}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{article.author.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={article.is_published}
                                                                disabled={togglingSlug === article.slug}
                                                                onCheckedChange={() => handleToggleStatus(article.slug)}
                                                                className="data-[state=checked]:bg-blue-600"
                                                            />
                                                            <span className={`text-xs font-medium ${article.is_published ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                                {article.is_published ? 'Published' : 'Draft'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(article.created_at)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/articles/${article.slug}`} className="flex items-center gap-2 cursor-pointer">
                                                                        <Eye className="h-3.5 w-3.5" />
                                                                        Preview
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/articles/${article.slug}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                    onClick={() => setDeleteSlug(article.slug)}
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
                        <div className="lg:hidden">
                            {articles.data.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                                    <FileText className="h-10 w-10 text-gray-200" />
                                    <p className="text-sm font-medium">No articles found</p>
                                </div>
                            ) : (
                                <motion.div className="divide-y divide-gray-100" variants={containerVariants} initial="hidden" animate="visible">
                                    {articles.data.map((article) => (
                                        <motion.div
                                            key={article.id}
                                            variants={rowVariants}
                                            className="flex gap-4 px-4 py-4 hover:bg-blue-50/30 transition-colors"
                                        >
                                            <div className="h-16 w-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                {getThumbnailUrl(article.thumbnail) ? (
                                                    <img src={getThumbnailUrl(article.thumbnail)!} alt={article.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageOff className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-2">{article.title}</p>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-xs">
                                                        {article.category.name}
                                                    </Badge>
                                                    <span className={`text-xs font-medium ${article.is_published ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                        {article.is_published ? '● Published' : '○ Draft'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{article.author.name} · {formatDate(article.created_at)}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 flex-shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/articles/${article.slug}`} className="flex items-center gap-2 cursor-pointer">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Preview
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/articles/${article.slug}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteSlug(article.slug)}
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
                        {articles.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">Showing {articles.from}–{articles.to} of {articles.total}</p>
                                <div className="flex items-center gap-1">
                                    {articles.links.map((link, i) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)} className="h-8 w-8 p-0 border-gray-200">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            );
                                        }
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <Button key={i} variant="outline" size="sm" disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)} className="h-8 w-8 p-0 border-gray-200">
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
                            <DialogTitle className="text-gray-900">Delete Article</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                This action cannot be undone. This article will be permanently deleted along with its thumbnail.
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