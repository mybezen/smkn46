import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { useState, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Users,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface PageProps {
    users: PaginatedUsers;
    filters: {
        search?: string;
        role?: string;
    };
    [key: string]: any;
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const rowVariant: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

export default function UsersIndex() {
    const { users, filters } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    });
    const [deleting, setDeleting] = useState(false);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);
            router.get(
                '/admin/users',
                { search: value, role: filters.role },
                { preserveState: true, replace: true }
            );
        },
        [filters.role]
    );

    const handleDelete = () => {
        if (!deleteDialog.user) return;
        setDeleting(true);
        router.delete(`/admin/users/${deleteDialog.user.id}`, {
            onFinish: () => {
                setDeleting(false);
                setDeleteDialog({ open: false, user: null });
            },
        });
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    return (
        <AppLayout>
            <Head title="Users" />

            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="space-y-6 p-4 md:p-6"
            >
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage all registered users in the system.
                        </p>
                    </div>
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={() => router.get('/admin/users/create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </motion.div>
                </div>

                {/* Filters */}
                <Card className="rounded-2xl shadow-sm border-gray-200">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                {(['all', 'admin', 'user'] as const).map((role) => (
                                    <Button
                                        key={role}
                                        variant={
                                            (filters.role ?? 'all') === role
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        className={
                                            (filters.role ?? 'all') === role
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : ''
                                        }
                                        onClick={() =>
                                            router.get(
                                                '/admin/users',
                                                {
                                                    search: filters.search,
                                                    role: role === 'all' ? undefined : role,
                                                },
                                                { preserveState: true, replace: true }
                                            )
                                        }
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table / Cards */}
                <Card className="rounded-2xl shadow-sm border-gray-200 overflow-hidden">
                    <CardHeader className="border-b border-gray-100 px-6 py-4">
                        <CardTitle className="text-base font-semibold text-gray-800">
                            {users.total} {users.total === 1 ? 'User' : 'Users'}
                        </CardTitle>
                    </CardHeader>

                    {users.data.length === 0 ? (
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <Users className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-base font-semibold text-gray-700">No users found</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Try adjusting your search or filters.
                            </p>
                        </CardContent>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium">Name</th>
                                            <th className="px-6 py-3 text-left font-medium">Email</th>
                                            <th className="px-6 py-3 text-left font-medium">Role</th>
                                            <th className="px-6 py-3 text-left font-medium">Verified</th>
                                            <th className="px-6 py-3 text-left font-medium">Created</th>
                                            <th className="px-6 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody
                                        variants={stagger}
                                        initial="hidden"
                                        animate="visible"
                                        className="divide-y divide-gray-100"
                                    >
                                        {users.data.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                variants={rowVariant}
                                                className="bg-white hover:bg-blue-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    {user.is_admin ? (
                                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                                            Admin
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
                                                            User
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
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
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {formatDate(user.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.get(`/admin/users/${user.id}`)
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.get(`/admin/users/${user.id}/edit`)
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    setDeleteDialog({ open: true, user })
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <motion.div
                                variants={stagger}
                                initial="hidden"
                                animate="visible"
                                className="md:hidden divide-y divide-gray-100"
                            >
                                {users.data.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        variants={rowVariant}
                                        className="p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.get(`/admin/users/${user.id}`)
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.get(`/admin/users/${user.id}/edit`)
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            setDeleteDialog({ open: true, user })
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {user.is_admin ? (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                                    Admin
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0">
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
                                        <p className="text-xs text-gray-400">
                                            Joined {formatDate(user.created_at)}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </>
                    )}

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="border-t border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-gray-500">
                                Showing {users.from ?? 0}–{users.to ?? 0} of {users.total}
                            </p>
                            <div className="flex gap-1 flex-wrap">
                                {users.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        className={
                                            link.active
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                                                : ''
                                        }
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) => !open && setDeleteDialog({ open: false, user: null })}
            >
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-gray-900">
                                {deleteDialog.user?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, user: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}