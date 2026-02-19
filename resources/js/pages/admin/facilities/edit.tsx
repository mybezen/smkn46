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
import { ArrowLeft, Building2, Loader2, ImagePlus, X, AlignLeft, Upload } from 'lucide-react';

interface Facility {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string | null;
    created_at: string;
}

interface PageProps {
    errors: Record<string, string>;
    facility: Facility;
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

export default function FacilitiesEdit() {
    const { errors, facility } = usePage<PageProps>().props;

    const [name, setName] = useState(facility.name);
    const [slugPreview, setSlugPreview] = useState(facility.slug);
    const [description, setDescription] = useState(facility.description ?? '');
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

    const removeNewImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', name);
        formData.append('description', description);
        if (imageFile) formData.append('image', imageFile);

        setSubmitting(true);
        router.post(`/admin/facilities/${facility.slug}`, formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    // Show new preview if selected, otherwise show existing storage image
    const displayImage = imagePreview ?? `/storage/${facility.image}`;

    return (
        <AppLayout>
            <Head title="Edit Facility" />
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
                        <h1 className="text-2xl font-bold text-gray-900">Edit Facility</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Update facility information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column */}
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
                                                <code className="text-sm font-mono text-blue-600 truncate">{slugPreview}</code>
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

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Image */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <ImagePlus className="h-4 w-4 text-blue-500" />
                                            Facility Image
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-3">
                                        {/* Always show current or new image */}
                                        <div className="relative">
                                            <img
                                                src={displayImage}
                                                alt="Facility"
                                                className="w-full rounded-xl object-cover aspect-video"
                                            />
                                            {imageFile && (
                                                <>
                                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                                        New image
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeNewImage}
                                                        className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full bg-red-600 hover:bg-red-700 shadow"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {imageFile ? 'Change image' : 'Replace image'}
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {errors.image && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.image}
                                            </motion.p>
                                        )}
                                        <p className="text-xs text-gray-400 text-center">Leave unchanged to keep current image</p>
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
                                    {submitting ? 'Saving...' : 'Save Changes'}
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