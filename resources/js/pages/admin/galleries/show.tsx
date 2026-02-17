import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Calendar, Images, Clock } from 'lucide-react';
import { motion, easeOut, Variants } from 'motion/react';

interface GalleryImage {
    id: number;
    image: string;
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

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: easeOut } },
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: easeOut },
    }),
};

export default function GalleriesShow({ gallery }: Props) {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const getImageUrl = (path: string) => `/storage/${path}`;

    return (
        <AppLayout>
            <Head title={gallery.title} />

            <motion.div className="space-y-6 p-6 max-w-5xl mx-auto" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/galleries">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Gallery Preview</h1>
                            <p className="mt-0.5 text-sm text-gray-500">View gallery details</p>
                        </div>
                    </div>
                    <Link href={`/admin/galleries/${gallery.slug}/edit`}>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Pencil className="h-4 w-4" />
                            Edit Gallery
                        </Button>
                    </Link>
                </div>

                {/* Meta Card */}
                <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm">
                        <CardHeader className="px-6 py-5 border-b border-gray-100">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{gallery.title}</h2>
                                    <code className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded mt-1.5 inline-block">
                                        /galleries/{gallery.slug}
                                    </code>
                                </div>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 border self-start whitespace-nowrap">
                                    <Images className="h-3 w-3 mr-1" />
                                    {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
                                </Badge>
                            </div>

                            {gallery.description && (
                                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{gallery.description}</p>
                            )}
                        </CardHeader>
                        <CardContent className="px-6 py-4">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Created {formatDate(gallery.created_at)}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200 hidden sm:block self-center" />
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>Updated {formatDate(gallery.updated_at)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Images Grid */}
                <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm">
                        <CardHeader className="border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                <Images className="h-4 w-4 text-blue-500" />
                                Photos
                                <Badge variant="secondary" className="ml-1 text-xs">{gallery.images.length}</Badge>
                            </div>
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
                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {gallery.images.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            variants={imageVariants}
                                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={getImageUrl(img.image)}
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

                {/* Footer */}
                <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="text-center pb-4">
                    <p className="text-xs text-gray-400">Gallery ID: {gallery.id}</p>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}