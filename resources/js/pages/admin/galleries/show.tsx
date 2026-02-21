import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Calendar, Images, Clock, AlignLeft } from 'lucide-react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';

interface GalleryImage {
    id: number;
    image: string | null;
    image_url: string | null;
}

interface Gallery {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    images: GalleryImage[];
}

interface Props {
    gallery: Gallery;
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

const imageItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easeOut } },
};

export default function GalleriesShow({ gallery }: Props) {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <AppLayout>
            <Head title={gallery.title} />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/galleries">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gallery Detail</h1>
                            <p className="mt-0.5 text-sm text-gray-500">Viewing gallery information</p>
                        </div>
                    </div>
                    <Link href={`/admin/galleries/${gallery.slug}/edit`}>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Pencil className="h-4 w-4" />
                            Edit Gallery
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left — images */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Photos Grid */}
                        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <Images className="h-4 w-4 text-blue-500" />
                                        Photos
                                        <Badge variant="secondary" className="ml-1 text-xs">{gallery.images.length}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-6">
                                    {gallery.images.length === 0 ? (
                                        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                                            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                <Images className="h-7 w-7 text-gray-300" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium">No images yet</p>
                                                <p className="text-xs mt-0.5">Add images by editing this gallery.</p>
                                            </div>
                                            <Link href={`/admin/galleries/${gallery.slug}/edit`}>
                                                <Button size="sm" variant="outline" className="gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50 mt-1">
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit Gallery
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                                        >
                                            {gallery.images.map((img) => (
                                                <motion.div
                                                    key={img.id}
                                                    variants={imageItemVariants}
                                                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <img
                                                        src={img.image_url}
                                                        alt="Gallery image"
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Description */}
                        {gallery.description && (
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <AlignLeft className="h-4 w-4 text-blue-500" />
                                            Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{gallery.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Right — info sidebar */}
                    <div className="space-y-6">
                        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <Images className="h-4 w-4 text-blue-500" />
                                        Gallery Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</p>
                                        <p className="text-gray-900 font-semibold">{gallery.title}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Slug</p>
                                        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md inline-block break-all">{gallery.slug}</code>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Photos</p>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 border">
                                                <Images className="h-3 w-3 mr-1" />
                                                {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Created
                                        </p>
                                        <p className="text-sm text-gray-700">{formatDate(gallery.created_at)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Updated
                                        </p>
                                        <p className="text-sm text-gray-700">{formatDate(gallery.updated_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                            <Link href={`/admin/galleries/${gallery.slug}/edit`}>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit Gallery
                                </Button>
                            </Link>
                            <Link href="/admin/galleries">
                                <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">
                                    Back to List
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}