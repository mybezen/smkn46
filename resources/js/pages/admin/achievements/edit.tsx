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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Upload, ArrowLeft, Loader2, Trophy } from 'lucide-react';
import { useRef } from 'react';
import type { Achievement } from '@/types/models';

interface Props {
    achievement: Achievement;
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

export default function Edit({ achievement }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        thumbnail: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(achievement.thumbnail);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/achievements/${achievement.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Achievement" />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/achievements">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Achievement</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Editing: <span className="font-medium text-gray-700">{achievement.title}</span>
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
                                        <Trophy className="h-4 w-4 text-blue-500" />
                                        Achievement Details
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
                                            placeholder="e.g. National Science Olympiad Winner"
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
                                            Description <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the achievement in detail..."
                                            className={`border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none ${errors.description ? 'border-red-400' : ''}`}
                                        />
                                        {errors.description && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.description}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                            Category <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) => {
                                                if (value === 'akademik' || value === 'non_akademik') {
                                                    setData('category', value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="akademik">Akademik</SelectItem>
                                                <SelectItem value="non_akademik">Non Akademik</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.category}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Thumbnail (Optional)
                                            <span className="ml-2 text-xs text-gray-500">(PNG/JPG up to 2MB)</span>
                                        </Label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50 ${
                                                errors.thumbnail ? 'border-red-400' : 'border-gray-200'
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
                                                        Click to change
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="h-8 w-8 text-blue-500" />
                                                    <p className="text-sm text-gray-700 text-center">
                                                        Click to upload thumbnail
                                                    </p>
                                                    <p className="text-xs text-gray-500 text-center">
                                                        PNG, JPG up to 2MB
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
                                        {errors.thumbnail && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.thumbnail}
                                            </motion.p>
                                        )}
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
                                {processing ? 'Updating...' : 'Update Achievement'}
                            </Button>
                            <Link href="/admin/achievements">
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