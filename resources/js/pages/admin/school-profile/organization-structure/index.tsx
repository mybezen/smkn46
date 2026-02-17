import AppLayout from '@/layouts/app-layout';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useRef, useState, ChangeEvent } from 'react';
import { Upload, Network, ImageIcon, CheckCircle2, Loader2, UserCircle2 } from 'lucide-react';

interface Position {
    title: string;
    name: string;
    order: number;
    image: string | null;
}

interface OrgStructureData {
    positions: Position[];
}

interface OrgStructureRecord {
    title: string;
    data: OrgStructureData;
}

interface PageProps {
    organizationStructure: OrgStructureRecord | null;
    flash?: { success?: string };
    [key: string]: any;
}

interface PositionState {
    title: string;
    name: string;
    order: number;
    image: string | null;
    newImageFile: File | null;
    imagePreview: string | null;
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
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: easeOut,
            delay: 0.05 * i,
        },
    }),
};

export default function OrganizationStructureIndex() {
    const { organizationStructure, flash } = usePage<PageProps>().props;

    const [sectionTitle, setSectionTitle] = useState<string>(
        organizationStructure?.title ?? '',
    );

    const [positions, setPositions] = useState<PositionState[]>(
        (organizationStructure?.data?.positions ?? []).map((p) => ({
            title: p.title,
            name: p.name,
            order: p.order,
            image: p.image,
            newImageFile: null,
            imagePreview: p.image ? `/storage/${p.image}` : null,
        })),
    );

    const [processing, setProcessing] = useState<boolean>(false);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setPositions((prev) =>
            prev.map((p, i) =>
                i === index ? { ...p, newImageFile: file, imagePreview: preview } : p,
            ),
        );
    };

    const updatePosition = (
        index: number,
        field: 'title' | 'name',
        value: string,
    ) => {
        setPositions((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (sectionTitle) formData.append('title', sectionTitle);

        positions.forEach((pos, index) => {
            formData.append(`positions[${index}][title]`, pos.title ?? '');
            formData.append(`positions[${index}][name]`, pos.name ?? '');
            formData.append(`positions[${index}][order]`, String(pos.order));
            if (pos.newImageFile) {
                formData.append(`positions[${index}][image]`, pos.newImageFile);
            }
        });

        router.post('/admin/school-profile/organization-structure', formData, {
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
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white shadow-sm">
                            <Network className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Organization Structure
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage your school's organizational positions and members
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
                    <div className="space-y-6">
                        {/* Section Title */}
                        <motion.div
                            custom={0}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        Section Title
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="section-title"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Title
                                        </Label>
                                        <Input
                                            id="section-title"
                                            placeholder="e.g. Our Organization Structure"
                                            value={sectionTitle}
                                            onChange={(e) => setSectionTitle(e.target.value)}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 max-w-xl"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Positions Info Banner */}
                        {positions.length > 0 && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-sm">
                                <Network className="w-4 h-4 flex-shrink-0" />
                                <span>
                                    <strong>{positions.length}</strong> position
                                    {positions.length !== 1 ? 's' : ''} — positions are fixed and
                                    cannot be reordered or removed.
                                </span>
                            </div>
                        )}

                        {/* Positions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {positions.map((pos, index) => (
                                <motion.div
                                    key={index}
                                    custom={index + 1}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Card className="rounded-2xl shadow-sm border-gray-200 h-full">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <UserCircle2 className="w-4 h-4 text-blue-500" />
                                                    Position #{pos.order}
                                                </CardTitle>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gray-100 text-gray-500 text-xs font-normal"
                                                >
                                                    Order: {pos.order}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Image */}
                                            <div>
                                                {pos.imagePreview ? (
                                                    <motion.div
                                                        whileHover={{ y: -4 }}
                                                        className="relative rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50 mb-2"
                                                    >
                                                        <img
                                                            src={pos.imagePreview}
                                                            alt={pos.name || 'Position'}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {pos.newImageFile && (
                                                            <div className="absolute top-2 right-2">
                                                                <Badge className="bg-blue-600 text-white text-xs">
                                                                    New
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 aspect-square bg-gray-50 gap-1.5 mb-2">
                                                        <ImageIcon className="w-6 h-6 text-gray-300" />
                                                        <span className="text-xs text-gray-400">
                                                            No photo
                                                        </span>
                                                    </div>
                                                )}
                                                <input
                                                    ref={(el) => {
                                                        fileInputRefs.current[index] = el;
                                                    }}
                                                    type="file"
                                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                                    onChange={(e) => handleImageChange(index, e)}
                                                    className="hidden"
                                                />
                                                <motion.div whileTap={{ scale: 0.98 }}>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            fileInputRefs.current[index]?.click()
                                                        }
                                                        className="w-full rounded-xl border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs h-8"
                                                    >
                                                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                                                        {pos.imagePreview
                                                            ? 'Replace Photo'
                                                            : 'Upload Photo'}
                                                    </Button>
                                                </motion.div>
                                            </div>

                                            <Separator className="my-1" />

                                            {/* Position Title */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-medium text-gray-600">
                                                    Position Title
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Principal"
                                                    value={pos.title}
                                                    onChange={(e) =>
                                                        updatePosition(
                                                            index,
                                                            'title',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 text-sm h-9"
                                                />
                                            </div>

                                            {/* Name */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-medium text-gray-600">
                                                    Person's Name
                                                </Label>
                                                <Input
                                                    placeholder="e.g. John Doe"
                                                    value={pos.name}
                                                    onChange={(e) =>
                                                        updatePosition(
                                                            index,
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 text-sm h-9"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {positions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                                <Network className="w-10 h-10 text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">No positions found</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Positions are managed from the backend.
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end pt-2">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 px-8 shadow-sm shadow-blue-200"
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
                        </div>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}