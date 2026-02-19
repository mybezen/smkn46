import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence, Variants, easeOut } from 'motion/react';
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
    Trophy,
    ChevronLeft,
    ChevronRight,
    ImageOff,
} from 'lucide-react';
import { Achievement } from '@/types/models';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAchievements {
    data: Achievement[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    achievements: PaginatedAchievements;
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

export default function Index({ achievements, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category ?? '');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;

    const applyFilters = (newSearch = search, newCat = categoryFilter) => {
        const params: { search?: string; category?: string } = {};
        if (newSearch) params.search = newSearch;
        if (newCat) params.category = newCat;
        router.get('/admin/achievements', params, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleCategoryFilter = (value: string) => {
        const cat = value === 'all' ? '' : value;
        setCategoryFilter(cat);
        applyFilters(search, cat);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        router.delete(`/admin/achievements/${deleteId}`, {
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteId(null);
            },
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const getCategoryBadge = (cat: string) => {
        return (
            <Badge
                variant="secondary"
                className={`${
                    cat === 'akademik'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                } text-xs font-medium`}
            >
                {cat === 'akademik' ? 'Akademik' : 'Non Akademik'}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Achievements" />

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
                        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage student achievements</p>
                    </div>
                    <Link href="/admin/achievements/create">
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Plus className="h-4 w-4" />
                            New Achievement
                        </Button>
                    </Link>
                </div>

                {/* Main Card */}
                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-blue-500" />
                                All Achievements
                                <Badge variant="secondary" className="ml-1 text-xs">{achievements.total}</Badge>
                            </CardTitle>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                {/* Category Filter */}
                                <Select value={categoryFilter || 'all'} onValueChange={handleCategoryFilter}>
                                    <SelectTrigger className="h-9 w-full sm:w-44 border-gray-200 text-sm">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="akademik">Akademik</SelectItem>
                                        <SelectItem value="non_akademik">Non Akademik</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Search */}
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search achievements..."
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
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Thumbnail</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                    <AnimatePresence>
                                        {achievements.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <Trophy className="h-10 w-10 text-gray-200" />
                                                        <p className="text-sm font-medium">No achievements found</p>
                                                        <p className="text-xs">
                                                            {filters.search || filters.category ? 'Try adjusting your filters.' : 'Start by creating your first achievement.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            achievements.data.map((achievement) => (
                                                <motion.tr
                                                    key={achievement.id}
                                                    variants={rowVariants}
                                                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                            {achievement.thumbnail ? (
                                                                <img
                                                                    src={achievement.thumbnail}
                                                                    alt={achievement.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <ImageOff className="h-4 w-4 text-gray-300" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-md">
                                                            <span className="font-medium text-gray-900 text-sm line-clamp-2">{achievement.title}</span>
                                                            <div className="line-clamp-1 text-sm text-gray-500">
                                                                {achievement.description}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getCategoryBadge(achievement.category)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(achievement.created_at)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/achievements/${achievement.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                    onClick={() => setDeleteId(achievement.id)}
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
                            {achievements.data.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
                                    <Trophy className="h-10 w-10 text-gray-200" />
                                    <p className="text-sm font-medium">No achievements found</p>
                                </div>
                            ) : (
                                <motion.div className="divide-y divide-gray-100" variants={containerVariants} initial="hidden" animate="visible">
                                    {achievements.data.map((achievement) => (
                                        <motion.div
                                            key={achievement.id}
                                            variants={rowVariants}
                                            className="flex gap-4 px-4 py-4 hover:bg-blue-50/30 transition-colors"
                                        >
                                            <div className="h-16 w-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                {achievement.thumbnail ? (
                                                    <img src={achievement.thumbnail} alt={achievement.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageOff className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-2">{achievement.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{achievement.description}</p>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    {getCategoryBadge(achievement.category)}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(achievement.created_at)}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 flex-shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/achievements/${achievement.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteId(achievement.id)}
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
                        {achievements.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                                <p className="text-sm text-gray-500">Showing {achievements.from}–{achievements.to} of {achievements.total}</p>
                                <div className="flex items-center gap-1">
                                    {achievements.links.map((link, i) => {
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
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
                        <DialogHeader>
                            <DialogTitle className="text-gray-900">Delete Achievement</DialogTitle>
                            <DialogDescription className="text-gray-500">
                                This action cannot be undone. This achievement will be permanently deleted along with its thumbnail.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteLoading} className="border-gray-200">
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