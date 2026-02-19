import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { motion, easeOut } from 'motion/react';
import type { Variants } from 'motion/react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, MoreVertical, Pencil, Trash2, Eye, Users } from 'lucide-react';

type EmployeeCategory = 'PRINCIPAL' | 'HEAD_OF_ADMIN' | 'VICE_PRINCIPAL' | 'TEACHER' | 'ADMINISTRATIVE' | 'STAFF';

interface Employee {
    id: number;
    name: string;
    image: string | null;
    position: string;
    category: EmployeeCategory;
    display_order: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedEmployees {
    data: Employee[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Props {
    employees: PaginatedEmployees;
    filters: { search?: string; category?: string };
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.3, ease: easeOut },
    }),
};

const CATEGORY_LABELS: Record<EmployeeCategory, string> = {
    PRINCIPAL: 'Principal',
    HEAD_OF_ADMIN: 'Head of Admin',
    VICE_PRINCIPAL: 'Vice Principal',
    TEACHER: 'Teacher',
    ADMINISTRATIVE: 'Administrative',
    STAFF: 'Staff',
};

const CATEGORY_COLORS: Record<EmployeeCategory, string> = {
    PRINCIPAL: 'bg-purple-100 text-purple-700 border-purple-200',
    HEAD_OF_ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
    VICE_PRINCIPAL: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    TEACHER: 'bg-green-100 text-green-700 border-green-200',
    ADMINISTRATIVE: 'bg-amber-100 text-amber-700 border-amber-200',
    STAFF: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function EmployeesIndex({ employees, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
    const [deleting, setDeleting] = useState(false);

    const applyFilters = useCallback((newSearch: string, newCategory: string) => {
        const params: Record<string, string> = {};
        if (newSearch) params.search = newSearch;
        if (newCategory) params.category = newCategory;
        router.get('/admin/employees', params, { preserveState: true, replace: true });
    }, []);

    const handleSearch = (value: string) => {
        setSearch(value);
        applyFilters(value, category);
    };

    const handleCategoryChange = (value: string) => {
        const newCat = value === 'ALL' ? '' : value;
        setCategory(newCat);
        applyFilters(search, newCat);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/admin/employees/${deleteTarget.id}`, {
            onFinish: () => { setDeleting(false); setDeleteTarget(null); },
        });
    };

    return (
        <AppLayout>
            <Head title="Employees" />
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage teachers and staff members</p>
                    </div>
                    <Button
                        onClick={() => router.get('/admin/employees/create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 rounded-xl border-gray-200"
                        />
                    </div>
                    <Select value={category || 'ALL'} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full sm:w-52 rounded-xl border-gray-200">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="ALL">All Categories</SelectItem>
                            {(Object.keys(CATEGORY_LABELS) as EmployeeCategory[]).map((cat) => (
                                <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {employees.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                                <p className="text-gray-400 font-medium">No employees found</p>
                                                <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        employees.data.map((employee, i) => (
                                            <motion.tr
                                                key={employee.id}
                                                custom={i}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className="hover:bg-gray-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                        {employee.image ? (
                                                            <img src={`/storage/${employee.image}`} alt={employee.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="w-5 h-5 text-gray-300" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">{employee.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{employee.position}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${CATEGORY_COLORS[employee.category]}`}>
                                                        {CATEGORY_LABELS[employee.category]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 font-mono">#{employee.display_order}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-lg">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl">
                                                            <DropdownMenuItem onClick={() => router.get(`/admin/employees/${employee.id}/edit`)}>
                                                                <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteTarget(employee)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {employees.data.length === 0 ? (
                        <Card className="rounded-2xl border-gray-100">
                            <CardContent className="py-16 text-center">
                                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No employees found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        employees.data.map((employee, i) => (
                            <motion.div key={employee.id} custom={i} variants={rowVariants} initial="hidden" animate="visible" whileHover={{ y: -2 }}>
                                <Card className="rounded-2xl border border-gray-100 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                                {employee.image ? (
                                                    <img src={`/storage/${employee.image}`} alt={employee.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Users className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{employee.name}</p>
                                                <p className="text-sm text-gray-500 truncate mt-0.5">{employee.position}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${CATEGORY_COLORS[employee.category]}`}>
                                                        {CATEGORY_LABELS[employee.category]}
                                                    </span>
                                                    <span className="text-xs text-gray-400">#{employee.display_order}</span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-lg flex-shrink-0">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem onClick={() => router.get(`/admin/employees/${employee.id}`)}>
                                                        <Eye className="w-4 h-4 mr-2 text-gray-500" /> View Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.get(`/admin/employees/${employee.id}/edit`)}>
                                                        <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setDeleteTarget(employee)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {employees.last_page > 1 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-sm text-gray-500">
                            Showing {employees.from ?? 0}–{employees.to ?? 0} of {employees.total}
                        </p>
                        <div className="flex gap-1 flex-wrap">
                            {employees.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`rounded-lg text-xs ${link.active ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-200'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" className="rounded-xl" disabled={deleting} onClick={handleDelete}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}