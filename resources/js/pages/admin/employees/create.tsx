import { useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Users, Loader2, ImagePlus, X, Settings } from 'lucide-react';

type EmployeeCategory = 'PRINCIPAL' | 'HEAD_OF_ADMIN' | 'VICE_PRINCIPAL' | 'TEACHER' | 'ADMINISTRATIVE' | 'STAFF';

interface PageProps {
    errors: Record<string, string>;
    [key: string]: unknown;
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

const CATEGORY_OPTIONS: { value: EmployeeCategory; label: string }[] = [
    { value: 'PRINCIPAL', label: 'Principal' },
    { value: 'HEAD_OF_ADMIN', label: 'Head of Admin' },
    { value: 'VICE_PRINCIPAL', label: 'Vice Principal' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'ADMINISTRATIVE', label: 'Administrative' },
    { value: 'STAFF', label: 'Staff' },
];

export default function EmployeesCreate() {
    const { errors } = usePage<PageProps>().props;

    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [category, setCategory] = useState<EmployeeCategory | ''>('');
    const [displayOrder, setDisplayOrder] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('category', category);
        formData.append('display_order', displayOrder);
        if (imageFile) formData.append('image', imageFile);

        setSubmitting(true);
        router.post('/admin/employees', formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Add Employee" />
            <motion.div className="space-y-6 p-6" variants={fadeIn} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/employees">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 hover:text-gray-700 -ml-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Create a new employee record</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column — personal info */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6 space-y-5">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter full name"
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.name ? 'border-red-400' : ''}`}
                                            />
                                            {errors.name && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Position */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                                                Position <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="position"
                                                value={position}
                                                onChange={(e) => setPosition(e.target.value)}
                                                placeholder="e.g. Math Teacher, IT Staff"
                                                className={`h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 ${errors.position ? 'border-red-400' : ''}`}
                                            />
                                            {errors.position && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.position}
                                                </motion.p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right Column — settings, photo, actions */}
                        <div className="space-y-6">
                            {/* Settings */}
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
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
                                            <Select value={category} onValueChange={(val) => setCategory(val as EmployeeCategory)}>
                                                <SelectTrigger className={`h-10 border-gray-200 ${errors.category ? 'border-red-400' : ''}`}>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {CATEGORY_OPTIONS.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.category}
                                                </motion.p>
                                            )}
                                        </div>

                                        {/* Display Order */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="display_order" className="text-sm font-medium text-gray-700">
                                                Display Order
                                            </Label>
                                            <Input
                                                id="display_order"
                                                type="number"
                                                min="0"
                                                value={displayOrder}
                                                onChange={(e) => setDisplayOrder(e.target.value)}
                                                placeholder="Auto-assigned if empty"
                                                className="h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            <p className="text-xs text-gray-400">Lower number = appears first</p>
                                            {errors.display_order && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500">
                                                    {errors.display_order}
                                                </motion.p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Photo Upload */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <ImagePlus className="h-4 w-4 text-blue-500" />
                                            Photo
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-6">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full rounded-xl object-cover aspect-square"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full bg-red-600 hover:bg-red-700 shadow"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <ImagePlus className="h-8 w-8 text-gray-300" />
                                                <span className="text-sm text-gray-400">Upload photo</span>
                                                <span className="text-xs text-gray-300">Optional · JPG, PNG · Max 2MB</span>
                                            </button>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {errors.image && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 mt-2">
                                                {errors.image}
                                            </motion.p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11"
                                >
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {submitting ? 'Creating...' : 'Create Employee'}
                                </Button>
                                <Link href="/admin/employees">
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