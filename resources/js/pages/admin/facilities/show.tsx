import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Calendar, LinkIcon, AlignLeft, Building2 } from 'lucide-react';

interface Facility {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string | null;
    created_at: string;
}

interface Props {
    facility: Facility;
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

export default function FacilitiesShow({ facility }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <AppLayout>
            <Head title={facility.name} />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/facilities">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Facility Detail</h1>
                            <p className="mt-0.5 text-sm text-gray-500">Viewing facility information</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.get(`/admin/facilities/${facility.slug}/edit`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left — image + meta */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                            <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <img
                                    src={`/storage/${facility.image}`}
                                    alt={facility.name}
                                    className="w-full aspect-video object-cover"
                                />
                            </Card>
                        </motion.div>

                        {/* Description */}
                        {facility.description && (
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <AlignLeft className="h-4 w-4 text-blue-500" />
                                            Description
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{facility.description}</p>
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
                                        <Building2 className="h-4 w-4 text-blue-500" />
                                        Facility Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 py-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Name</p>
                                        <p className="text-gray-900 font-semibold">{facility.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <LinkIcon className="h-3 w-3" /> Slug
                                        </p>
                                        <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md inline-block break-all">{facility.slug}</code>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Created
                                        </p>
                                        <p className="text-sm text-gray-700">{formatDate(facility.created_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                            <Button
                                onClick={() => router.get(`/admin/facilities/${facility.slug}/edit`)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit Facility
                            </Button>
                            <Link href="/admin/facilities">
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