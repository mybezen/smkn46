import { useState, FormEvent, ChangeEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface FormData {
    name: string;
    slug: string;
    description: string;
    icon: File | null;
    preview_image: File | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Majors', href: '/admin/majors' },
];

interface Errors {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    preview_image?: string;
}

export default function create() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        slug: '',
        description: '',
        icon: null,
        preview_image: null,
    });
    const [errors, setErrors] = useState<Errors>({});
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [previewImagePreview, setPreviewImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'icon' | 'preview_image') => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, [field]: file }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'icon') {
                    setIconPreview(reader.result as string);
                } else {
                    setPreviewImagePreview(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (field === 'icon') {
                setIconPreview(null);
            } else {
                setPreviewImagePreview(null);
            }
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('description', formData.description);
        if (formData.icon) data.append('icon', formData.icon);
        if (formData.preview_image) data.append('preview_image', formData.preview_image);

        router.post('/admin/majors', data, {
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
            <Head title="Create Major" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/majors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Major</h1>
                        <p className="text-gray-600 mt-1">Add a new expertise program</p>
                    </div>
                </div>

                <Card className="rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Program Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Program Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Teknik Komputer Jaringan"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="e.g. tkj (leave empty for auto-generate)"
                                        className={errors.slug ? 'border-red-500' : ''}
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-600">{errors.slug}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the program..."
                                    rows={5}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon (max 2MB)</Label>
                                    <div className="space-y-4">
                                        <Input
                                            id="icon"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'icon')}
                                            className={errors.icon ? 'border-red-500' : ''}
                                        />
                                        {errors.icon && (
                                            <p className="text-sm text-red-600">{errors.icon}</p>
                                        )}
                                        {iconPreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={iconPreview}
                                                    alt="Icon preview"
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, icon: null }));
                                                        setIconPreview(null);
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preview_image">Preview Image (max 4MB)</Label>
                                    <div className="space-y-4">
                                        <Input
                                            id="preview_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'preview_image')}
                                            className={errors.preview_image ? 'border-red-500' : ''}
                                        />
                                        {errors.preview_image && (
                                            <p className="text-sm text-red-600">{errors.preview_image}</p>
                                        )}
                                        {previewImagePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={previewImagePreview}
                                                    alt="Preview image"
                                                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, preview_image: null }));
                                                        setPreviewImagePreview(null);
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {submitting ? 'Creating...' : 'Create Program'}
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/majors">Cancel</Link>
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