import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, ShieldCheck, User } from 'lucide-react';

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

interface CreateForm {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
}

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout>
            <Head title="Create User" />

            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="p-4 md:p-6 space-y-6"
            >
                {/* Header */}
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
                        <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Add a new user to the system.</p>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left – User Info */}
                        <motion.div
                            custom={0}
                            variants={cardVariant}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-2"
                        >
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        User Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">
                                            Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Full name"
                                            className={errors.name ? 'border-red-400' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="user@example.com"
                                            className={errors.email ? 'border-red-400' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="password">
                                            Password <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className={errors.password ? 'border-red-400' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-red-500">{errors.password}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Right – Settings + Actions */}
                        <motion.div
                            custom={1}
                            variants={cardVariant}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4"
                        >
                            {/* Settings Card */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardHeader className="border-b border-gray-100 px-6 py-4">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="is-admin" className="text-sm font-medium text-gray-700">
                                                Administrator
                                            </Label>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Grant admin privileges
                                            </p>
                                        </div>
                                        <Switch
                                            id="is-admin"
                                            checked={data.role === 'admin'}
                                            onCheckedChange={(checked) =>
                                                setData('role', checked ? 'admin' : 'user')
                                            }
                                        />
                                    </div>

                                    {/* Badge Preview */}
                                    <div className="space-y-1.5">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                            Role Preview
                                        </p>
                                        {data.role === 'admin' ? (
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
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions Card */}
                            <Card className="rounded-2xl shadow-sm border-gray-200">
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create User'
                                            )}
                                        </Button>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => router.get('/admin/users')}
                                        >
                                            Cancel
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </AppLayout>
    );
}