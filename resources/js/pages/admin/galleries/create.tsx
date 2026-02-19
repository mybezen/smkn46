import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Images, Loader2, ImagePlus, X, AlignLeft } from 'lucide-react';

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

interface PreviewImage {
    file: File;
    preview: string;
    id: string;
}

export default function GalleriesCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        images: File[];
    }>({
        title: '',
        description: '',
        images: [],
    });

    const [slugPreview, setSlugPreview] = useState('');
    const [previews, setPreviews] = useState<PreviewImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (value: string) => {
        setData('title', value);
        const slug = value.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlugPreview(slug);
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;
        const newPreviews: PreviewImage[] = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            id: `${file.name}-${Date.now()}-${Math.random()}`,
        }));
        const updated = [...previews, ...newPreviews];
        setPreviews(updated);
        setData('images', updated.map((p) => p.file));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id: string) => {
        const updated = previews.filter((p) => p.id !== id);
        setPreviews(updated);
        setData('images', updated.map((p) => p.file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/galleries', { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title="Create Gallery" />
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
                        <h1 className="text-2xl font-bold text-gray-900">Create Gallery</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Add a new photo gallery</p>
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

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Slug Preview</Label>
                                            <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                                <span className="text-gray-400 text-xs font-mono">/galleries/</span>
                                                <code className="text-sm font-mono text-blue-600 truncate">
                                                    {slugPreview || <span className="text-gray-400 italic">will-be-generated</span>}
                                                </code>
                                            </div>
                                        </div>
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
                                        {errors.description && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1.5">
                                                {errors.description}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Images Upload */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                                <ImagePlus className="h-4 w-4 text-blue-500" />
                                                Images
                                                <span className="text-xs font-normal text-gray-400 ml-1">({previews.length})</span>
                                            </CardTitle>
                                            {previews.length > 0 && (
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
                                        {previews.length === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full rounded-xl border-2 border-dashed hover:border-blue-300 hover:bg-blue-50/30 transition-colors py-10 flex flex-col items-center justify-center gap-3 cursor-pointer ${errors.images ? 'border-red-300' : 'border-gray-200'}`}
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <ImagePlus className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-600">Click to upload</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP · Max 2MB</p>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                <AnimatePresence>
                                                    {previews.map((preview) => (
                                                        <motion.div
                                                            key={preview.id}
                                                            variants={imageVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                                                        >
                                                            <img src={preview.preview} alt={preview.file.name} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(preview.id)}
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
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Creating...' : 'Create Gallery'}
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
        </AppLayout>
    );
}