import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Tag, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
}

interface Props {
    category: Category;
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

export default function CategoriesEdit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({ name: category.name });

    const [slugPreview, setSlugPreview] = useState(
        category.name.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    );

    const handleNameChange = (value: string) => {
        setData('name', value);
        const slug = value.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setSlugPreview(slug);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.slug}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${category.name}`} />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Editing: <span className="font-medium text-gray-700">{category.name}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Form Fields */}
                        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-blue-500" />
                                        Category Details
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
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => handleNameChange(e.target.value)}
                                            placeholder="e.g. Technology"
                                            className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.name ? 'border-red-400' : ''}`}
                                        />
                                        {errors.name && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.name}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Current Slug */}
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Current Slug</Label>
                                        <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                            <span className="text-gray-400 text-xs font-mono">/categories/</span>
                                            <code className="text-sm font-mono text-gray-500 truncate">{category.slug}</code>
                                        </div>
                                    </div>

                                    {/* New Slug Preview — only when name changed */}
                                    {data.name !== category.name && (
                                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">New Slug Preview</Label>
                                            <div className="flex items-center h-10 px-3 rounded-lg border border-blue-200 bg-blue-50 gap-2">
                                                <span className="text-blue-400 text-xs font-mono">/categories/</span>
                                                <code className="text-sm font-mono text-blue-600 truncate">
                                                    {slugPreview || <span className="italic text-blue-300">will-be-generated</span>}
                                                </code>
                                            </div>
                                            <p className="text-xs text-blue-500">Slug will be updated automatically when you save.</p>
                                        </motion.div>
                                    )}
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
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Link href="/admin/categories">
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