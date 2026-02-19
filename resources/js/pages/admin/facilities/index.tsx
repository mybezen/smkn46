import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, MoreVertical, Pencil, Trash2, Eye, Building2 } from 'lucide-react';

interface Facility {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedFacilities {
    data: Facility[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    facilities: PaginatedFacilities;
    filters: { search?: string };
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.3, ease: easeOut },
    }),
};

export default function FacilitiesIndex({ facilities, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/facilities', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/facilities/${deleteTarget.slug}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout>
            <Head title="Facilities" />
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage school facilities and their details</p>
                    </div>
                    <Button
                        onClick={() => router.get('/admin/facilities/create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Facility
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search facilities..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 rounded-xl border-gray-200"
                    />
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {facilities.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-medium">No facilities found</p>
                                                <p className="text-gray-300 text-sm mt-1">Try adjusting your search or add a new facility</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        facilities.data.map((facility, i) => (
                                            <motion.tr
                                                key={facility.id}
                                                custom={i}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="hover:bg-gray-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                        <img src={`/storage/${facility.image}`} alt={facility.name} className="w-full h-full object-cover" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">{facility.name}</span>
                                                    {facility.description && (
                                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{facility.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{facility.slug}</code>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(facility.created_at)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem onClick={() => router.get(`/admin/facilities/${facility.slug}`)}>
                                                                <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.get(`/admin/facilities/${facility.slug}/edit`)}>
                                                                <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteTarget(facility)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {facilities.data.length === 0 ? (
                        <Card className="rounded-2xl border-gray-100">
                            <CardContent className="py-16 text-center">
                                <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No facilities found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        facilities.data.map((facility, i) => (
                            <motion.div key={facility.id} custom={i} variants={rowVariants} initial="hidden" animate="visible" whileHover={{ y: -2 }}>
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img src={`/storage/${facility.image}`} alt={facility.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{facility.name}</p>
                                                <code className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md mt-1 inline-block">{facility.slug}</code>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(facility.created_at)}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-lg flex-shrink-0">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem onClick={() => router.get(`/admin/facilities/${facility.slug}`)}>
                                                        <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.get(`/admin/facilities/${facility.slug}/edit`)}>
                                                        <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteTarget(facility)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {facilities.last_page > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-gray-500">
                            Showing {facilities.from ?? 0}–{facilities.to ?? 0} of {facilities.total}
                        </p>
                        <div className="flex gap-1 flex-wrap">
                            {facilities.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`rounded-lg text-xs ${link.active ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Facility</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" className="rounded-xl" disabled={deleting} onClick={handleDelete}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}