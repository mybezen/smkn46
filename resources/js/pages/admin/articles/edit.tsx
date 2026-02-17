import { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, easeOut, Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, FileText, Loader2, ImagePlus, X, Settings, AlignLeft } from 'lucide-react';

interface Author {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    is_published: boolean;
    category_id: number;
    author: Author;
    category: Category;
}

interface Props {
    article: Article;
    categories: Category[];
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

export default function ArticlesEdit({ article, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        category_id: string;
        content: string;
        thumbnail: File | null;
        is_published: boolean;
        _method: string;
    }>({
        title: article.title,
        category_id: String(article.category_id),
        content: article.content,
        thumbnail: null,
        is_published: article.is_published,
        _method: 'PUT',
    });

    const [slugPreview, setSlugPreview] = useState(
        article.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    );
    const [imagePreview, setImagePreview] = useState<string | null>(
        article.thumbnail ? `/storage/${article.thumbnail}` : null
    );
    const [imageChanged, setImageChanged] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (value: string) => {
        setData('title', value);
        const slug = value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        setSlugPreview(slug);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('thumbnail', file);
        setImageChanged(true);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setData('thumbnail', null);
        setImagePreview(null);
        setImageChanged(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Use POST with _method=PUT for file uploads (Laravel method spoofing)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/articles/${article.slug}`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title={`Edit: ${article.title}`} />

            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/articles">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
                        <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
                            Editing: <span className="font-medium text-gray-700">{article.title}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Article Info */}
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            Article Info
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
                                                value={data.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                placeholder="Enter article title..."
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.title ? 'border-red-400' : ''}`}
                                            />
                                            {errors.title && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.title}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Current Slug */}
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Current Slug</Label>
                                            <div className="flex items-center h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 gap-2">
                                                <span className="text-gray-400 text-xs font-mono">/articles/</span>
                                                <code className="text-sm font-mono text-gray-500 truncate">{article.slug}</code>
                                            </div>
                                        </div>

                                        {/* New Slug Preview */}
                                        {data.title !== article.title && (
                                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                                                <Label className="text-sm font-medium text-gray-700">New Slug Preview</Label>
                                                <div className="flex items-center h-10 px-3 rounded-lg border border-blue-200 bg-blue-50 gap-2">
                                                    <span className="text-blue-400 text-xs font-mono">/articles/</span>
                                                    <code className="text-sm font-mono text-blue-600 truncate">
                                                        {slugPreview || <span className="italic text-blue-300">will-be-generated</span>}
                                                    </code>
                                                </div>
                                                <p className="text-xs text-blue-500">Slug will update when you save.</p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Content */}
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <AlignLeft className="h-4 w-4 text-blue-500" />
                                            Content
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                                                Article Content <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id="content"
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                placeholder="Write your article content here..."
                                                rows={14}
                                                className={`border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-y font-mono text-sm ${errors.content ? 'border-red-400' : ''}`}
                                            />
                                            {errors.content && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.content}
                                                </motion.p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Settings */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-blue-500" />
                                            Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-5">
                                        {/* Category */}
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">
                                                Category <span className="text-red-500">*</span>
                                            </Label>
                                            <Select value={data.category_id} onValueChange={(val) => setData('category_id', val)}>
                                                <SelectTrigger className={`h-10 border-gray-200 ${errors.category_id ? 'border-red-400' : ''}`}>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.category_id && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.category_id}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Publish Toggle */}
                                        <div className="flex items-center justify-between py-1">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Publish</p>
                                                <p className="text-xs text-gray-400">Make article visible</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={data.is_published}
                                                    onCheckedChange={(val) => setData('is_published', val)}
                                                    className="data-[state=checked]:bg-blue-600"
                                                />
                                                <Badge variant="secondary" className={data.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-gray-50 text-gray-500 border-gray-100'}>
                                                    {data.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Thumbnail */}
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <ImagePlus className="h-4 w-4 text-blue-500" />
                                            Thumbnail
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-3">
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
                                                {!imageChanged && (
                                                    <div className="absolute bottom-2 left-2">
                                                        <Badge className="bg-black/60 text-white text-xs border-0">Current</Badge>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <ImagePlus className="h-8 w-8 text-gray-300" />
                                                <span className="text-sm text-gray-400">Click to upload image</span>
                                                <span className="text-xs text-gray-300">JPG, PNG, WebP · Max 2MB</span>
                                            </button>
                                        )}
                                        {imagePreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full border-gray-200 text-gray-600 text-xs h-8"
                                            >
                                                Change Image
                                            </Button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {errors.thumbnail && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                {errors.thumbnail}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11">
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href="/admin/articles">
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