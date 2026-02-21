import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import { useRef, useState, ChangeEvent } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    School,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Upload,
    Image as ImageIcon,
    Loader2,
    ArrowLeft,
    Save,
} from 'lucide-react';

interface Setting {
    id: number;
    school_name: string | null;
    logo: string | null;
    logo_url: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    maps: string | null;
    facebook_link: string | null;
    instagram_link: string | null;
    twitter_link: string | null;
    youtube_link: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    setting: Setting | null;
}

interface FormData {
    school_name: string;
    address: string;
    maps: string;
    phone: string;
    email: string;
    facebook_link: string;
    instagram_link: string;
    twitter_link: string;
    youtube_link: string;
    logo: File | null;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: easeOut },
    },
};

const stagger: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

export default function SettingsIndex({ setting }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data, setData, processing, errors, reset } = useForm<FormData>({
        school_name: setting?.school_name ?? '',
        address: setting?.address ?? '',
        maps: setting?.maps ?? '',
        phone: setting?.phone ?? '',
        email: setting?.email ?? '',
        facebook_link: setting?.facebook_link ?? '',
        instagram_link: setting?.instagram_link ?? '',
        twitter_link: setting?.twitter_link ?? '',
        youtube_link: setting?.youtube_link ?? '',
        logo: null,
    });

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('logo', file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('school_name', data.school_name);
        formData.append('address', data.address);
        formData.append('maps', data.maps);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('facebook_link', data.facebook_link);
        formData.append('instagram_link', data.instagram_link);
        formData.append('twitter_link', data.twitter_link);
        formData.append('youtube_link', data.youtube_link);
        if (data.logo) {
            formData.append('logo', data.logo);
        }
        formData.append('_method', 'PUT');

        router.post('/admin/settings', formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const currentLogo = setting?.logo
        ? setting.logo_url
        : null;

    return (
        <AppLayout>
            <Head title="Settings" />

            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="min-h-screen bg-gray-50/50 p-6 md:p-8"
            >
                {/* Header */}
                <motion.div variants={fadeIn} className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <School className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                                Settings
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage your school information and social media
                            </p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* School Information */}
                            <motion.div variants={fadeIn}>
                                <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                            <School className="w-4 h-4 text-blue-600" />
                                            School Information
                                        </CardTitle>
                                        <Separator />
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="school_name" className="text-sm font-medium text-gray-700">
                                                School Name
                                            </Label>
                                            <Input
                                                id="school_name"
                                                value={data.school_name}
                                                onChange={(e) => setData('school_name', e.target.value)}
                                                placeholder="Enter school name"
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.school_name && (
                                                <p className="text-xs text-red-500 mt-1">{errors.school_name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="Enter school address"
                                                rows={3}
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none"
                                            />
                                            {errors.address && (
                                                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="maps" className="text-sm font-medium text-gray-700">
                                                Google Maps Embed
                                            </Label>
                                            <Textarea
                                                id="maps"
                                                value={data.maps}
                                                onChange={(e) => setData('maps', e.target.value)}
                                                placeholder='<iframe src="https://maps.google.com/..." ...></iframe>'
                                                rows={4}
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 resize-none font-mono text-xs"
                                            />
                                            {errors.maps && (
                                                <p className="text-xs text-red-500 mt-1">{errors.maps}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Social Media */}
                            <motion.div variants={fadeIn}>
                                <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                            <Facebook className="w-4 h-4 text-blue-600" />
                                            Social Media
                                        </CardTitle>
                                        <Separator />
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="facebook_link" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Facebook className="w-3.5 h-3.5 text-blue-500" />
                                                Facebook
                                            </Label>
                                            <Input
                                                id="facebook_link"
                                                value={data.facebook_link}
                                                onChange={(e) => setData('facebook_link', e.target.value)}
                                                placeholder="https://facebook.com/..."
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.facebook_link && (
                                                <p className="text-xs text-red-500 mt-1">{errors.facebook_link}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="instagram_link" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Instagram className="w-3.5 h-3.5 text-pink-500" />
                                                Instagram
                                            </Label>
                                            <Input
                                                id="instagram_link"
                                                value={data.instagram_link}
                                                onChange={(e) => setData('instagram_link', e.target.value)}
                                                placeholder="https://instagram.com/..."
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.instagram_link && (
                                                <p className="text-xs text-red-500 mt-1">{errors.instagram_link}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="twitter_link" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Twitter className="w-3.5 h-3.5 text-sky-500" />
                                                Twitter / X
                                            </Label>
                                            <Input
                                                id="twitter_link"
                                                value={data.twitter_link}
                                                onChange={(e) => setData('twitter_link', e.target.value)}
                                                placeholder="https://twitter.com/..."
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.twitter_link && (
                                                <p className="text-xs text-red-500 mt-1">{errors.twitter_link}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="youtube_link" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Youtube className="w-3.5 h-3.5 text-red-500" />
                                                YouTube
                                            </Label>
                                            <Input
                                                id="youtube_link"
                                                value={data.youtube_link}
                                                onChange={(e) => setData('youtube_link', e.target.value)}
                                                placeholder="https://youtube.com/..."
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.youtube_link && (
                                                <p className="text-xs text-red-500 mt-1">{errors.youtube_link}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact */}
                            <motion.div variants={fadeIn}>
                                <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                            <Phone className="w-4 h-4 text-blue-600" />
                                            Contact
                                        </CardTitle>
                                        <Separator />
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+62 xxx xxxx xxxx"
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="school@example.com"
                                                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Logo Upload */}
                            <motion.div variants={fadeIn}>
                                <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                                            <ImageIcon className="w-4 h-4 text-blue-600" />
                                            School Logo
                                        </CardTitle>
                                        <Separator />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Current / Preview */}
                                        {(logoPreview || currentLogo) && (
                                            <div className="flex items-center justify-center">
                                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                                                    <img
                                                        src={logoPreview ?? currentLogo!}
                                                        alt="School Logo"
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {!logoPreview && !currentLogo && (
                                            <div className="flex items-center justify-center">
                                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                                                    <div className="text-center">
                                                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                                        <p className="text-xs text-gray-400">No logo</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />

                                        <motion.div whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full rounded-xl border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                            </Button>
                                        </motion.div>

                                        {errors.logo && (
                                            <p className="text-xs text-red-500">{errors.logo}</p>
                                        )}

                                        <p className="text-xs text-gray-400 text-center">
                                            JPEG, PNG, SVG — max 2MB
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>

                    {/* Action Buttons — full width below grid */}
                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit('/admin/settings')}
                                className="w-full sm:w-auto rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 px-6"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-70 px-8"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </motion.div>
                </form>
            </motion.div>
        </AppLayout>
    );
}