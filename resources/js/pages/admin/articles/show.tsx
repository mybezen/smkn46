import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Calendar, User, Tag, Globe, Lock, ImageOff } from 'lucide-react';
import { motion, easeOut, Variants } from 'motion/react';

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
    thumbnail_url: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    author: Author;
    category: Category;
}

interface Props {
    article: Article;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: easeOut },
    }),
};

export default function ArticlesShow({ article }: Props) {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <AppLayout>
            <Head title={article.title} />

            <motion.div className="space-y-6 p-6 max-w-4xl mx-auto" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/articles">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Article Preview</h1>
                            <p className="mt-0.5 text-sm text-gray-500">View article details</p>
                        </div>
                    </div>
                    <Link href={`/admin/articles/${article.slug}/edit`}>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Pencil className="h-4 w-4" />
                            Edit Article
                        </Button>
                    </Link>
                </div>

                {/* Meta Strip */}
                <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm">
                        <CardContent className="px-6 py-4">
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    {article.is_published ? (
                                        <>
                                            <Globe className="h-4 w-4 text-emerald-500" />
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border hover:bg-emerald-50">
                                                Published
                                            </Badge>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 text-gray-400" />
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500">Draft</Badge>
                                        </>
                                    )}
                                </div>

                                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                                {/* Category */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Tag className="h-4 w-4 text-blue-500" />
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 border">
                                        {article.category.name}
                                    </Badge>
                                </div>

                                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                                {/* Author */}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>{article.author.name}</span>
                                </div>

                                <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                                {/* Date */}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>{formatDate(article.created_at)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Thumbnail */}
                {article.thumbnail && (
                    <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
                        <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
                            <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    </motion.div>
                )}

                {/* Article Content */}
                <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100 px-6 py-5">
                            <h2 className="text-2xl font-bold text-gray-900 leading-snug">{article.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <code className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                    /articles/{article.slug}
                                </code>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-6">
                            {!article.thumbnail && (
                                <div className="w-full rounded-xl border-2 border-dashed border-gray-100 aspect-video flex flex-col items-center justify-center gap-2 mb-6 text-gray-300">
                                    <ImageOff className="h-10 w-10" />
                                    <span className="text-sm">No thumbnail</span>
                                </div>
                            )}
                            <div className="prose prose-sm prose-gray max-w-none">
                                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                                    {article.content}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer */}
                <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="text-center pb-4">
                    <p className="text-xs text-gray-400">Last updated: {formatDate(article.updated_at)}</p>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}