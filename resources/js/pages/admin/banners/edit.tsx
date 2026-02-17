import { Head } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowLeft } from 'lucide-react';
import { router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Banner } from '@/types/models';
import type { BreadcrumbItem } from '@/types';

interface Props {
    banner: Banner;
}

const getBreadcrumbs = (id: number): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Banners', href: '/admin/banners' },
    { title: 'Edit', href: `/admin/banners/${id}/edit` },
];

export default function Edit({ banner }: Props) {
    const [data, setData] = useState({
        title: banner.title,
        description: banner.description || '',
        image: null as File | null,
        link: banner.link || '',
        is_active: banner.is_active,
        order: banner.order,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const [preview, setPreview] = useState<string | null>(banner.image);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData({ ...data, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('link', data.link);
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('order', data.order.toString());
        
        if (data.image) {
            formData.append('image', data.image);
        }

        router.post(`/admin/banners/${banner.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setErrors({});
            },
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={getBreadcrumbs(banner.id)}>
            <Head title="Edit Banner" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-2 sm:p-4">
                {/* Header with Back Button */}
                <div className="flex items-center gap-3">
                    <Link href="/admin/banners">
                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">Edit Banner</h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Update banner information</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-sidebar-border dark:bg-card"
                >
                    <form onSubmit={submit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                placeholder="Enter banner title"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                placeholder="Enter banner description"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300">
                                Banner Image
                                {banner.image && !data.image && (
                                    <span className="ml-2 text-xs text-slate-500 dark:text-muted-foreground">(Current image shown)</span>
                                )}
                                <span className="ml-2 text-xs text-slate-500">(Required: 1200x750 pixels)</span>
                            </Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer rounded-lg border-2 border-dashed border-slate-200 p-4 sm:p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50 dark:border-sidebar-border dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5"
                            >
                                {preview ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-2"
                                    >
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mx-auto max-h-40 sm:max-h-48 rounded-lg ring-1 ring-slate-200"
                                        />
                                        <p className="text-center text-sm text-slate-600 dark:text-muted-foreground">
                                            {data.image ? 'New image - Tap to change' : 'Tap to change image'}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="size-8 text-blue-500" />
                                        <p className="text-sm text-slate-700 dark:text-muted-foreground text-center">
                                            Tap to upload banner
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-muted-foreground text-center">
                                            PNG, JPG - 1200x750px up to 4MB
                                        </p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {errors.image && (
                                <p className="text-sm text-destructive">{errors.image}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link" className="text-slate-700 dark:text-slate-300">Link (Optional)</Label>
                            <Input
                                id="link"
                                type="url"
                                value={data.link}
                                onChange={(e) => setData({ ...data, link: e.target.value })}
                                placeholder="https://example.com"
                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.link && (
                                <p className="text-sm text-destructive">{errors.link}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="order" className="text-slate-700 dark:text-slate-300">Display Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData({ ...data, order: parseInt(e.target.value) })}
                                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.order && (
                                    <p className="text-sm text-destructive">{errors.order}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="is_active" className="text-slate-700 dark:text-slate-300">Active Status</Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData({ ...data, is_active: checked })}
                                    />
                                    <Label htmlFor="is_active" className="font-normal text-slate-600 dark:text-slate-400">
                                        {data.is_active ? 'Active' : 'Inactive'}
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-slate-200 dark:border-sidebar-border">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => window.history.back()} 
                                className="border-slate-200 hover:bg-slate-50 w-full sm:w-auto order-2 sm:order-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto order-1 sm:order-2"
                            >
                                {processing ? 'Updating...' : 'Update Banner'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AppLayout>
    );
}   