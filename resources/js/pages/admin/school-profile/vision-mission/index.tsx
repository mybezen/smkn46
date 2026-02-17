import AppLayout from '@/layouts/app-layout';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useRef, useState, ChangeEvent } from 'react';
import {
    Upload,
    Eye,
    ImageIcon,
    CheckCircle2,
    Loader2,
    Plus,
    Trash2,
    Target,
    Quote,
} from 'lucide-react';

interface VisionMissionData {
    vision: string | null;
    missions: string[] | null;
    motto: string | null;
}

interface VisionMissionRecord {
    title: string | null;
    data: VisionMissionData | null;
    main_image: string | null;
}

interface PageProps {
    visionMission: VisionMissionRecord | null;
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

const missionItemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.2, ease: easeOut },
    },
    exit: {
        opacity: 0,
        x: 10,
        transition: { duration: 0.15 },
    },
};

export default function VisionMissionIndex() {
    const { visionMission, flash } = usePage<PageProps>().props;

    const [title, setTitle] = useState<string>(visionMission?.title ?? '');
    const [vision, setVision] = useState<string>(visionMission?.data?.vision ?? '');
    const [missions, setMissions] = useState<string[]>(visionMission?.data?.missions ?? ['']);
    const [motto, setMotto] = useState<string>(visionMission?.data?.motto ?? '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        visionMission?.main_image ? `/storage/${visionMission.main_image}` : null,
    );
    const [processing, setProcessing] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const addMission = () => {
        setMissions((prev) => [...prev, '']);
    };

    const removeMission = (index: number) => {
        setMissions((prev) => prev.filter((_, i) => i !== index));
    };

    const updateMission = (index: number, value: string) => {
        setMissions((prev) => prev.map((m, i) => (i === index ? value : m)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (title) formData.append('title', title);
        if (vision) formData.append('vision', vision);
        if (motto) formData.append('motto', motto);
        missions.forEach((m, i) => {
            formData.append(`missions[${i}]`, m);
        });
        if (imageFile) formData.append('main_image', imageFile);

        router.post('/admin/school-profile/vision-mission', formData, {
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
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Vision & Mission
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage your school's vision, mission, and motto
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
                        {/* Main Content */}
                        <motion.div variants={cardVariants} className="lg:col-span-2 space-y-5">
                            {/* Title */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        Section Title
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="title"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Our Vision & Mission"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Vision */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        Vision
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="vision"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Vision Statement
                                        </Label>
                                        <Textarea
                                            id="vision"
                                            placeholder="Describe your school's vision..."
                                            value={vision}
                                            onChange={(e) => setVision(e.target.value)}
                                            rows={4}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Missions */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            Mission
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-50 text-blue-600 text-xs"
                                        >
                                            {missions.length} item{missions.length !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <AnimatePresence>
                                        {missions.map((mission, index) => (
                                            <motion.div
                                                key={index}
                                                variants={missionItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="flex items-center gap-2"
                                            >
                                                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <Input
                                                    placeholder={`Mission ${index + 1}`}
                                                    value={mission}
                                                    onChange={(e) =>
                                                        updateMission(index, e.target.value)
                                                    }
                                                    className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 flex-1"
                                                />
                                                {missions.length > 1 && (
                                                    <motion.button
                                                        type="button"
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeMission(index)}
                                                        className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addMission}
                                            className="w-full rounded-xl border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors mt-2"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Mission
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>

                            {/* Motto */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                        <Quote className="w-4 h-4 text-blue-500" />
                                        Motto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="motto"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            School Motto
                                        </Label>
                                        <Input
                                            id="motto"
                                            placeholder="e.g. Excellence in Education"
                                            value={motto}
                                            onChange={(e) => setMotto(e.target.value)}
                                            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Image + Submit */}
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
                                            <span className="text-xs text-gray-400">
                                                No image uploaded
                                            </span>
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