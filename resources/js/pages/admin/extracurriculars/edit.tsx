import { useState, FormEvent, ChangeEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';

interface Extracurricular {
    id: number;
    name: string;
    description: string;
    category: string;
    thumbnail: string | null;
    thumbnail_url: string | null;
}

interface Props {
    extracurricular: Extracurricular;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Extracurricular', href: '/admin/extracurriculars' },
    { title: 'Edit Extracurricular', href: '/admin/extracurriculars/edit' },
];

interface FormData {
    name: string;
    description: string;
    category: string;
    thumbnail: File | null;
}

interface Errors {
    name?: string;
    description?: string;
    category?: string;
    thumbnail?: string;
}

export default function Edit({ extracurricular }: Props) {
    const [formData, setFormData] = useState<FormData>({
        name: extracurricular.name,
        description: extracurricular.description,
        category: extracurricular.category,
        thumbnail: null,
    });
    const [errors, setErrors] = useState<Errors>({});
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(extracurricular.thumbnail_url);
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, category: value }));
        setErrors((prev) => ({ ...prev, category: undefined }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, thumbnail: file }));
        setErrors((prev) => ({ ...prev, thumbnail: undefined }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

        router.post(`/admin/extracurriculars/${extracurricular.id}`, data, {
            onError: (errors) => {
                setErrors(errors as Errors);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='p-6'>
            <Head title="Edit Extracurricular" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/extracurriculars">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Extracurricular</h1>
                        <p className="text-gray-600 mt-1">Update extracurricular information</p>
                    </div>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Extracurricular Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="olahraga">Olahraga</SelectItem>
                                        <SelectItem value="seni">Seni</SelectItem>
                                        <SelectItem value="akademik">Akademik</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail (max 2MB)</Label>
                                <div className="space-y-4">
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={errors.thumbnail ? 'border-red-500' : ''}
                                    />
                                    {errors.thumbnail && (
                                        <p className="text-sm text-red-600">{errors.thumbnail}</p>
                                    )}
                                    {thumbnailPreview && (
                                        <div className="relative inline-block">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, thumbnail: null }));
                                                    setThumbnailPreview(null);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {submitting ? 'Updating...' : 'Update Extracurricular'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/extracurriculars">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
            </div>
        </AppLayout>
    );
}