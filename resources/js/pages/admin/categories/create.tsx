import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, easeOut, Variants  } from 'motion/react';
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

const fieldVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.08, duration: 0.35, ease: easeOut },
    }),
};

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '' });
    const [slugPreview, setSlugPreview] = useState('');

    const handleNameChange = (value: string) => {
        setData('name', value);
        const slug = value
            .toLowerCase()
            .trim()
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

            <motion.div className="space-y-6 p-6 max-w-2xl mx-auto" variants={fadeIn} initial="hidden" animate="visible">
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

                {/* Form Card */}
                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <Tag className="h-4 w-4 text-blue-500" />
                            Category Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 py-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. Technology"
                                    className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.name ? 'border-red-400 focus:border-red-400' : ''}`}
                                />
                                {errors.name && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-1">
                                        {errors.name}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Slug Preview */}
                            <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-700">Slug Preview</Label>
                                <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                    <span className="text-gray-400 text-xs font-mono">/categories/</span>
                                    <code className="text-sm font-mono text-blue-600 truncate">
                                        {slugPreview || <span className="text-gray-400 italic">will-be-generated</span>}
                                    </code>
                                </div>
                                <p className="text-xs text-gray-400">Slug is auto-generated from the name and will be unique.</p>
                            </motion.div>

                            {/* Actions */}
                            <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible"
                                className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                                <Link href="/admin/categories">
                                    <Button type="button" variant="outline" className="w-full sm:w-auto border-gray-200 text-gray-600 hover:bg-gray-50">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Creating...' : 'Create Category'}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}