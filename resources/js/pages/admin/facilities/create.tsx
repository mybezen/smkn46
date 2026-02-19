import { useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, Loader2, ImagePlus, X, AlignLeft } from 'lucide-react';

interface PageProps {
    errors: Record<string, string>;
    [key: string]: unknown;
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

function slugify(text: string): string {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function FacilitiesCreate() {
    const { errors } = usePage<PageProps>().props;

    const [name, setName] = useState('');
    const [slugPreview, setSlugPreview] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (value: string) => {
        setName(value);
        setSlugPreview(slugify(value));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (imageFile) formData.append('image', imageFile);

        setSubmitting(true);
        router.post('/admin/facilities', formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Facility" />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/facilities">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Facility</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Add a new school facility</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column — main content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Facility Info */}
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-blue-500" />
                                            Facility Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-5">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                placeholder="e.g. Science Laboratory, Library"
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.name ? 'border-red-400' : ''}`}
                                            />
                                            {errors.name && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Slug Preview */}
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Slug Preview</Label>
                                            <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                                <span className="text-gray-400 text-xs font-mono">/facilities/</span>
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
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                                Facility Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Describe this facility, its purpose and capacity..."
                                                rows={8}
                                                className={`border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-y ${errors.description ? 'border-red-400' : ''}`}
                                            />
                                            {errors.description && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.description}
                                                </motion.p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column — image + actions */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <ImagePlus className="h-4 w-4 text-blue-500" />
                                            Facility Image <span className="text-red-500 font-normal text-sm ml-1">*</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="w-full rounded-xl object-cover aspect-video" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full bg-red-600 hover:bg-red-700 shadow"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full rounded-xl border-2 border-dashed hover:border-blue-300 hover:bg-blue-50/30 transition-colors aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer ${errors.image ? 'border-red-300 bg-red-50/20' : 'border-gray-200'}`}
                                            >
                                                <ImagePlus className="h-8 w-8 text-gray-300" />
                                                <span className="text-sm text-gray-400">Click to upload image</span>
                                                <span className="text-xs text-gray-300">JPG, PNG, WebP · Max 2MB</span>
                                            </button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {errors.image && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-2">
                                                {errors.image}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11"
                                >
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {submitting ? 'Creating...' : 'Create Facility'}
                                </Button>
                                <Link href="/admin/facilities">
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