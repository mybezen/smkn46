import AppLayout from '@/layouts/app-layout';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useRef, useState, ChangeEvent } from 'react';
import { Upload, BookOpen, ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

interface HistoryData {
    title: string | null;
    content: string | null;
    main_image: string | null;
    main_image_url: string | null;
}

interface PageProps {
    history: HistoryData | null;
    flash?: { success?: string };
    [key: string]: any;
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easeOut,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: easeOut,
            delay: 0.1,
        },
    },
};

export default function HistoryIndex() {
    const { history, flash } = usePage<PageProps>().props;

    const [title, setTitle] = useState<string>(history?.title ?? '');
    const [content, setContent] = useState<string>(history?.content ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        history?.main_image ? history.main_image_url : null,
    );
    const [processing, setProcessing] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (title) formData.append('title', title);
        if (content) formData.append('content', content);
        if (imageFile) formData.append('main_image', imageFile);

        router.post('/admin/profile/history', formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-screen bg-gray-50/40 p-4 md:p-8"
            >
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-sm">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                School History
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage the history section of your school profile
                            </p>
                        </div>
                    </div>
                    <Separator className="mt-6" />
                </div>

                {flash?.success && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {flash.success}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div variants={cardVariants} className="lg:col-span-2">
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        Content Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Our School History"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                                            Content
                                        </Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Write about your school's history..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={10}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={cardVariants} className="space-y-5">
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-blue-500" />
                                        Section Image
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {imagePreview ? (
                                        <motion.div
                                            whileHover={{ y: -4 }}
                                            className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-50"
                                        >
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {imageFile && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-blue-600 text-white text-xs">
                                                        New
                                                    </Badge>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 aspect-[4/3] bg-gray-50 gap-2">
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                            <span className="text-xs text-gray-400">No image uploaded</span>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpg,image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full rounded-xl border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {imagePreview ? 'Replace Image' : 'Upload Image'}
                                        </Button>
                                    </motion.div>
                                    <p className="text-xs text-gray-400 text-center">
                                        JPG, PNG, WEBP — max 2MB
                                    </p>
                                </CardContent>
                            </Card>

                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 shadow-sm shadow-blue-200"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}