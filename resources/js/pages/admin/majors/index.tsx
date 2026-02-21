import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BreadcrumbItem } from '@/types';

interface Major {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string | null;
    preview_image: string | null;
    icon_url: string | null;
    preview_image_url: string | null;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Majors', href: '/admin/majors' },
];

interface Props {
    majors: {
        data: Major[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function index({ majors }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteDialog) return;

        setDeleting(true);
        router.delete(`/admin/majors/${deleteDialog}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteDialog(null);
            },
        });

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='p-6'>
            <Head title="Majors" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Majors</h1>
                        <p className="text-gray-600 mt-1">Manage your expertise programs</p>
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/admin/majors/create">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Major
                        </Link>
                    </Button>
                </div>

                <div className="hidden md:block">
                    <Card className="rounded-2xl shadow-sm border-gray-200">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Major
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Slug
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Images
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {majors.data.map((major, index) => (
                                                <motion.tr
                                                    key={major.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {major.icon ? (
                                                                <img
                                                                    src={major.icon_url}
                                                                    alt={major.name}
                                                                    className="w-10 h-10 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                    <ImageIcon className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{major.name}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary" className="font-mono text-xs">
                                                            {major.slug}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {major.description}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            {major.icon && (
                                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                                    Icon
                                                                </Badge>
                                                            )}
                                                            {major.preview_image && (
                                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                                                    Preview
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                                            >
                                                                <Link href={`/admin/majors/${major.slug}/edit`}>
                                                                    <Pencil className="w-4 h-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDeleteDialog(major.slug)}
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

                            {majors.data.length === 0 && (
                                <div className="text-center py-12">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No majors found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="md:hidden space-y-4">
                    <AnimatePresence>
                        {majors.data.map((major, index) => (
                            <motion.div
                                key={major.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start gap-3">
                                            {major.icon ? (
                                                <img
                                                    src={major.icon}
                                                    alt={major.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <ImageIcon className="w-6 h-6 text-blue-600" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg">{major.name}</CardTitle>
                                                <Badge variant="secondary" className="font-mono text-xs mt-2">
                                                    {major.slug}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-600">{major.description}</p>

                                        <div className="flex gap-2">
                                            {major.icon && (
                                                <Badge className="bg-blue-100 text-blue-700">Icon</Badge>
                                            )}
                                            {major.preview_image && (
                                                <Badge className="bg-green-100 text-green-700">Preview</Badge>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Link href={`/admin/majors/${major.id}/edit`}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setDeleteDialog(major.id)}
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

                    {majors.data.length === 0 && (
                        <Card className="rounded-2xl shadow-sm">
                            <CardContent className="text-center py-12">
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No programs found</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {majors.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2">
                        {majors.links.map((link, index) => (
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
                        <DialogTitle>Delete Major</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this major? This action cannot be undone.
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