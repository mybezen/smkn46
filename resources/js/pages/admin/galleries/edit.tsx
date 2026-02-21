import { useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Images, Loader2, ImagePlus, X, AlignLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';

interface GalleryImage {
    id: number;
    image: string | null;
    image_url: string | null;
}

interface Gallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    created_at: string;
    images: GalleryImage[];
}

interface Props {
    gallery: Gallery;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: easeOut },
    }),
};

const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

interface NewPreview {
    file: File;
    preview: string;
    id: string;
}

export default function GalleriesEdit({ gallery }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        images: File[];
        _method: string;
    }>({
        title: gallery.title,
        description: gallery.description ?? '',
        images: [],
        _method: 'PUT',
    });

    const [slugPreview, setSlugPreview] = useState(
        gallery.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    );
    const [newPreviews, setNewPreviews] = useState<NewPreview[]>([]);
    const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (value: string) => {
        setData('title', value);
        const slug = value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        setSlugPreview(slug);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;
        const added: NewPreview[] = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            id: `${file.name}-${Date.now()}-${Math.random()}`,
        }));
        const updated = [...newPreviews, ...added];
        setNewPreviews(updated);
        setData('images', updated.map((p) => p.file));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeNewImage = (id: string) => {
        const updated = newPreviews.filter((p) => p.id !== id);
        setNewPreviews(updated);
        setData('images', updated.map((p) => p.file));
    };

    const handleDeleteExistingImage = () => {
        if (!deleteImageId) return;
        setDeletingImageId(deleteImageId);
        router.delete(`/admin/galleries/image/${deleteImageId}/delete`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingImageId(null);
                setDeleteImageId(null);
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/galleries/${gallery.slug}`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title={`Edit: ${gallery.title}`} />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/galleries">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Gallery</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Editing: <span className="font-medium text-gray-700">{gallery.title}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Gallery Info */}
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <Images className="h-4 w-4 text-blue-500" />
                                            Gallery Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                                Title <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                placeholder="e.g. School Annual Day 2024"
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.title ? 'border-red-400' : ''}`}
                                            />
                                            {errors.title && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.title}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Current Slug */}
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Current Slug</Label>
                                            <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                                <span className="text-gray-400 text-xs font-mono">/galleries/</span>
                                                <code className="text-sm font-mono text-gray-500 truncate">{gallery.slug}</code>
                                            </div>
                                        </div>

                                        {/* New Slug Preview */}
                                        {data.title !== gallery.title && (
                                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                                                <Label className="text-sm font-medium text-gray-700">New Slug Preview</Label>
                                                <div className="flex items-center h-10 px-3 rounded-lg border border-blue-200 bg-blue-50 gap-2">
                                                    <span className="text-blue-400 text-xs font-mono">/galleries/</span>
                                                    <code className="text-sm font-mono text-blue-600 truncate">
                                                        {slugPreview || <span className="italic text-blue-300">will-be-generated</span>}
                                                    </code>
                                                </div>
                                                <p className="text-xs text-blue-500">Slug will update when you save.</p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Description */}
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <AlignLeft className="h-4 w-4 text-blue-500" />
                                            Description
                                            <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Brief description of this gallery..."
                                            rows={5}
                                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none text-sm"
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Existing Images */}
                            {gallery.images.length > 0 && (
                                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                    <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                        <CardHeader className="border-b border-gray-100 px-6 py-4">
                                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                                <Images className="h-4 w-4 text-blue-500" />
                                                Current Images
                                                <Badge variant="secondary" className="ml-1 text-xs">{gallery.images.length}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-6 py-6">
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                <AnimatePresence>
                                                    {gallery.images.map((img) => (
                                                        <motion.div
                                                            key={img.id}
                                                            variants={imageVariants}
                                                            initial="visible"
                                                            exit="exit"
                                                            className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                                                        >
                                                            <img src={img.image_url} alt="Gallery image" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteImageId(img.id)}
                                                                disabled={deletingImageId === img.id}
                                                                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-700 disabled:opacity-50"
                                                            >
                                                                {deletingImageId === img.id ? (
                                                                    <span className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                                ) : (
                                                                    <X className="h-3.5 w-3.5" />
                                                                )}
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-3">Hover over an image to remove it. Removal is immediate.</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Add New Images */}
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                                <ImagePlus className="h-4 w-4 text-blue-500" />
                                                Add Images
                                                {newPreviews.length > 0 && (
                                                    <Badge variant="secondary" className="ml-1 text-xs bg-blue-50 text-blue-600">{newPreviews.length} new</Badge>
                                                )}
                                            </CardTitle>
                                            {newPreviews.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 h-8 text-xs"
                                                >
                                                    <ImagePlus className="h-3.5 w-3.5" />
                                                    Add
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        {newPreviews.length === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors py-10 flex flex-col items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <ImagePlus className="h-7 w-7 text-gray-300" />
                                                <span className="text-sm text-gray-400">Click to add images</span>
                                                <span className="text-xs text-gray-300">JPG, PNG, WebP · Max 2MB</span>
                                            </button>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <AnimatePresence>
                                                    {newPreviews.map((preview) => (
                                                        <motion.div
                                                            key={preview.id}
                                                            variants={imageVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-blue-200"
                                                        >
                                                            <img src={preview.preview} alt={preview.file.name} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                                            <div className="absolute top-1.5 left-1.5">
                                                                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">New</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(preview.id)}
                                                                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-700"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <ImagePlus className="h-5 w-5 text-gray-300" />
                                                        <span className="text-xs text-gray-400">Add more</span>
                                                    </motion.button>
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            onChange={handleImagesChange}
                                            className="hidden"
                                        />
                                        {errors.images && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-3">
                                                {errors.images}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href="/admin/galleries">
                                    <Button type="button" variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                                        Cancel
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </motion.div>

            {/* Delete Image Dialog */}
            <Dialog open={!!deleteImageId} onOpenChange={(open) => !open && setDeleteImageId(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            Remove Image
                        </DialogTitle>
                        <DialogDescription className="text-gray-500">
                            This image will be permanently deleted. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <Button variant="outline" onClick={() => setDeleteImageId(null)} className="border-gray-200">Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteExistingImage} className="bg-red-600 hover:bg-red-700">
                            Remove Image
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}