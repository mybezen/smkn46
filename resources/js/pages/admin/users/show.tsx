import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Pencil,
    User,
    Mail,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    Clock,
} from 'lucide-react';

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const cardVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: easeOut, delay: i * 0.1 },
    }),
};

interface UserData {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    user: UserData;
    [key: string]: any;
}

export default function UsersShow() {
    const { user } = usePage<PageProps>().props;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <AppLayout>
            <Head title={user.name} />

            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="p-4 md:p-6 space-y-6 max-w-3xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.get('/admin/users')}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Detailed user information.</p>
                        </div>
                    </div>
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={() => router.get(`/admin/users/${user.id}/edit`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    </motion.div>
                </div>

                {/* Profile Card */}
                <motion.div custom={0} variants={cardVariant} initial="hidden" animate="visible">
                    <Card className="rounded-2xl shadow-sm border-gray-200 overflow-hidden">
                        {/* Blue banner */}
                        <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600" />
                        <CardContent className="px-6 pb-6">
                            {/* Avatar */}
                            <div className="-mt-12 mb-4">
                                <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-600">{initials}</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {user.is_admin ? (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                            Admin
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
                                            <User className="mr-1 h-3 w-3" />
                                            User
                                        </Badge>
                                    )}
                                    {user.email_verified_at ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
                                            <AlertCircle className="mr-1 h-3 w-3" />
                                            Unverified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Details Card */}
                <motion.div custom={1} variants={cardVariant} initial="hidden" animate="visible">
                    <Card className="rounded-2xl shadow-sm border-gray-200">
                        <CardContent className="p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Account Details
                            </h3>

                            <div className="space-y-4">
                                <DetailRow
                                    icon={<User className="h-4 w-4 text-gray-400" />}
                                    label="Name"
                                    value={user.name}
                                />
                                <DetailRow
                                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                                    label="Email"
                                    value={user.email}
                                />
                                <DetailRow
                                    icon={<ShieldCheck className="h-4 w-4 text-gray-400" />}
                                    label="Role"
                                    value={
                                        user.is_admin ? (
                                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                                <ShieldCheck className="mr-1 h-3 w-3" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
                                                User
                                            </Badge>
                                        )
                                    }
                                />
                                <DetailRow
                                    icon={<CheckCircle2 className="h-4 w-4 text-gray-400" />}
                                    label="Email Verified"
                                    value={
                                        user.email_verified_at ? (
                                            <div>
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    Verified
                                                </Badge>
                                                <span className="ml-2 text-xs text-gray-400">
                                                    {formatDate(user.email_verified_at)}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
                                                <AlertCircle className="mr-1 h-3 w-3" />
                                                Not verified
                                            </Badge>
                                        )
                                    }
                                />
                                <DetailRow
                                    icon={<CalendarDays className="h-4 w-4 text-gray-400" />}
                                    label="Created At"
                                    value={formatDate(user.created_at)}
                                />
                                <DetailRow
                                    icon={<Clock className="h-4 w-4 text-gray-400" />}
                                    label="Last Updated"
                                    value={formatDate(user.updated_at)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}

interface DetailRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
    return (
        <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-medium text-gray-500 min-w-32">{label}</span>
                <span className="text-sm text-gray-800">{value}</span>
            </div>
        </div>
    );
}