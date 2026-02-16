import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BreadcrumbItem } from '@/types';

interface Extracurricular {
    id: number;
    name: string;
    description: string;
    category: 'olahraga' | 'seni' | 'akademik' | 'lainnya';
    thumbnail: string | null;
    created_at: string;
}

interface Props {
    extracurriculars: {
        data: Extracurricular[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        category: string;
        search: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Extracurriculars', href: '/admin/extracurriculars' },
];

const categoryConfig = {
    olahraga: { label: 'Olahraga', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    seni: { label: 'Seni', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    akademik: { label: 'Akademik', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    lainnya: { label: 'Lainnya', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
};

export default function index({ extracurriculars, filters }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search);

    const handleCategoryChange = (value: string) => {
        router.get(
            `/admin/extracurriculars`,
            { category: value, search: searchTerm },
            { preserveState: true }
        );
    };

    const handleSearch = () => {
        router.get(
            `/admin/extracurriculars`,
            { category: filters.category, search: searchTerm },
            { preserveState: true }
        );
    };

    const handleDelete = () => {
        if (!deleteDialog) return;

        setDeleting(true);
        router.delete(`/admin/extracurriculars/${deleteDialog}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteDialog(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='p-6'>


                <Head title="Extracurriculars" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Extracurriculars</h1>
                            <p className="text-gray-600 mt-1">Manage school activities</p>
                        </div>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href={`/admin/extracurriculars/create`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Extracurricular
                            </Link>
                        </Button>
                    </div>

                    <Card className="rounded-2xl shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search by name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={filters.category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="olahraga">Olahraga</SelectItem>
                                        <SelectItem value="seni">Seni</SelectItem>
                                        <SelectItem value="akademik">Akademik</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                                    Search
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="hidden md:block">
                        <Card className="rounded-2xl shadow-sm border-gray-200">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <AnimatePresence>
                                                {extracurriculars.data.map((extracurricular, index) => (
                                                    <motion.tr
                                                        key={extracurricular.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {extracurricular.thumbnail ? (
                                                                    <img
                                                                        src={extracurricular.thumbnail}
                                                                        alt={extracurricular.name}
                                                                        className="w-12 h-12 rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                        <ImageIcon className="w-6 h-6 text-blue-600" />
                                                                    </div>
                                                                )}
                                                                <p className="font-semibold text-gray-900">{extracurricular.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge className={categoryConfig[extracurricular.category].color}>
                                                                {categoryConfig[extracurricular.category].label}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                                {extracurricular.description}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    asChild
                                                                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                                >
                                                                    <Link href={`/admin/extracurricular/${extracurricular.id}/edit`}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setDeleteDialog(extracurricular.id)}
                                                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>

                                {extracurriculars.data.length === 0 && (
                                    <div className="text-center py-12">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No extracurriculars found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:hidden space-y-4">
                        <AnimatePresence>
                            {extracurriculars.data.map((extracurricular, index) => (
                                <motion.div
                                    key={extracurricular.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex items-start gap-3">
                                                {extracurricular.thumbnail ? (
                                                    <img
                                                        src={extracurricular.thumbnail}
                                                        alt={extracurricular.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <ImageIcon className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg">{extracurricular.name}</CardTitle>
                                                    <Badge className={`${categoryConfig[extracurricular.category].color} mt-2`}>
                                                        {categoryConfig[extracurricular.category].label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-gray-600">{extracurricular.description}</p>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Link href={`/admin/extracurricular/${extracurricular.id}/edit`}>
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setDeleteDialog(extracurricular.id)}
                                                    className="flex-1 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {extracurriculars.data.length === 0 && (
                            <Card className="rounded-2xl shadow-sm">
                                <CardContent className="text-center py-12">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No extracurriculars found</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {extracurriculars.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2">
                            {extracurriculars.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={link.active ? 'bg-blue-600' : ''}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                <Dialog open={deleteDialog !== null} onOpenChange={() => setDeleteDialog(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete extracurricular</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this extracurricular? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialog(null)} disabled={deleting}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}