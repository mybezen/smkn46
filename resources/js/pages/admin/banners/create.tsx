import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useRef } from 'react';
import type { BannerFormData } from '@/types/models';

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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<BannerFormData>({
        title: '',
        description: '',
        image: null,
        link: '',
        is_active: true,
        order: 0,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/banners');
    };

    return (
        <AppLayout>
            <Head title="Create Banner" />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/banners">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Banner</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Add a new banner to the homepage</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Form Fields */}
                        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-blue-500" />
                                        Banner Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-6 space-y-5">
                                    {/* Title */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                            Title <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter banner title"
                                            className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.title ? 'border-red-400' : ''}`}
                                        />
                                        {errors.title && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.title}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                            Description (Optional)
                                        </Label>
                                        <Textarea
                                            id="description"
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter banner description"
                                            className={`border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none ${errors.description ? 'border-red-400' : ''}`}
                                        />
                                        {errors.description && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.description}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                                            Banner Image <span className="text-red-500">*</span>
                                            <span className="ml-2 text-xs text-gray-500">(Required: 1200x750 pixels)</span>
                                        </Label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                                                errors.image ? 'border-red-400' : 'border-gray-200'
                                            }`}
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
                                                        className="mx-auto max-h-48 rounded-lg ring-1 ring-gray-200"
                                                    />
                                                    <p className="text-center text-sm text-gray-600">
                                                        Click to change image
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="h-8 w-8 text-blue-500" />
                                                    <p className="text-sm text-gray-700 text-center">
                                                        Click to upload banner
                                                    </p>
                                                    <p className="text-xs text-gray-500 text-center">
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
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.image}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Link */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="link" className="text-sm font-medium text-gray-700">
                                            Link (Optional)
                                        </Label>
                                        <Input
                                            id="link"
                                            type="url"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                            placeholder="https://example.com"
                                            className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.link ? 'border-red-400' : ''}`}
                                        />
                                        {errors.link && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.link}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Order and Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="order" className="text-sm font-medium text-gray-700">
                                                Display Order
                                            </Label>
                                            <Input
                                                id="order"
                                                type="number"
                                                min="0"
                                                value={data.order}
                                                onChange={(e) => setData('order', parseInt(e.target.value))}
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.order ? 'border-red-400' : ''}`}
                                            />
                                            {errors.order && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.order}
                                                </motion.p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Active Status</Label>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Switch
                                                    id="is_active"
                                                    checked={data.is_active}
                                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                                    className="data-[state=checked]:bg-blue-600"
                                                />
                                                <Label htmlFor="is_active" className="font-normal text-gray-600">
                                                    {data.is_active ? 'Active' : 'Inactive'}
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11"
                            >
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                {processing ? 'Creating...' : 'Create Banner'}
                            </Button>
                            <Link href="/admin/banners">
                                <Button type="button" variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                                    Cancel
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}