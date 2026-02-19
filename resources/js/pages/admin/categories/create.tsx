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

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '' });
    const [slugPreview, setSlugPreview] = useState('');

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
        post('/admin/categories');
    };

    return (
        <AppLayout>
            <Head title="Create Category" />
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
                        <h1 className="text-2xl font-bold text-gray-900">Create Category</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Add a new article category</p>
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
                                            placeholder="e.g. Technology, Sports, Events"
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
                                            <span className="text-gray-400 text-xs font-mono">/categories/</span>
                                            <code className="text-sm font-mono text-blue-600 truncate">
                                                {slugPreview || <span className="text-gray-400 italic">will-be-generated</span>}
                                            </code>
                                        </div>
                                        <p className="text-xs text-gray-400">Slug is auto-generated from the name and will be unique.</p>
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
                                {processing ? 'Creating...' : 'Create Category'}
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