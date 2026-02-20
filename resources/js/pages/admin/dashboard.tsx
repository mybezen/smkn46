import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Separator } from '@/components/ui/separator';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import {
    Users,
    FileText,
    Image,
    UserCheck,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowUpRight,
    Trophy,
    ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticlesStats {
    total: number;
    draft: number;
    published: number;
}

interface AchievementsStats {
    total: number;
    academic: number;
    non_academic: number;
}

interface UsersStats {
    total: number;
    admin: number;
    users: number;
}

interface MonthlyChartEntry {
    month: string;
    articles: number;
    users: number;
}

interface DashboardProps {
    articles: ArticlesStats;
    achievements?: AchievementsStats;
    users?: UsersStats;
    employees?: number;
    galleries: number;
    monthly_chart: MonthlyChartEntry[];
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: easeOut },
    },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.2,
            ease: easeOut,
        });
        return controls.stop;
    }, [value]);

    return <motion.span>{rounded}</motion.span>;
}

// ─── Growth Badge ─────────────────────────────────────────────────────────────

function GrowthBadge({ value }: { value: number }) {
    const isPositive = value >= 0;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOut }}
        >
            <motion.div
                animate={
                    isPositive
                        ? { scale: [1, 1.04, 1] }
                        : {}
                }
                transition={
                    isPositive
                        ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        : {}
                }
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isPositive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                }`}
            >
                {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                ) : (
                    <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}
                {value}%
            </motion.div>
        </motion.div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: number;
    growth?: number;
    icon: React.ReactNode;
    accent: string;
    href: string;
    sub?: string;
}

function StatCard({ label, value, growth, icon, accent, href, sub }: StatCardProps) {
    return (
        <motion.div variants={fadeIn} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Link href={href}>
                <Card className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}
                            >
                                {icon}
                            </div>
                            {growth !== undefined && <GrowthBadge value={growth} />}
                        </div>
                        <div className="text-4xl font-bold text-gray-900 tracking-tight mb-1">
                            <AnimatedNumber value={value} />
                        </div>
                        <div className="text-sm font-medium text-gray-500">{label}</div>
                        {sub && (
                            <div className="mt-2 text-xs text-gray-400">{sub}</div>
                        )}
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

// ─── Chart Empty State ────────────────────────────────────────────────────────

function ChartEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-[280px] md:h-[300px] text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No activity data yet</p>
            <p className="text-xs text-gray-300 mt-1">Data will appear once articles and users are added.</p>
        </div>
    );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string; color: string }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
            <p className="font-semibold text-gray-700 mb-2">{label}</p>
            {payload.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: p.color }}
                    />
                    <span className="text-gray-500 capitalize">{p.name}:</span>
                    <span className="font-semibold text-gray-800">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

interface QuickAction {
    label: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}

const adminActions: QuickAction[] = [
    { label: 'New Article', href: '/admin/articles/create', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Add Employee', href: '/admin/employees/create', icon: <UserCheck className="w-4 h-4" />, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Upload Gallery', href: '/admin/galleries/create', icon: <Image className="w-4 h-4" />, color: 'bg-violet-600 hover:bg-violet-700' },
    { label: 'Create User', href: '/admin/users/create', icon: <Users className="w-4 h-4" />, color: 'bg-sky-600 hover:bg-sky-700' },
];

const editorActions: QuickAction[] = [
    { label: 'New Article', href: '/admin/articles/create', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Upload Gallery', href: '/admin/galleries/create', icon: <Image className="w-4 h-4" />, color: 'bg-violet-600 hover:bg-violet-700' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({ articles, achievements, users, employees, galleries, monthly_chart }: DashboardProps) {
    const hasChartData = monthly_chart.some((d) => d.articles > 0 || d.users > 0);
    const isAdmin = users !== undefined;
    const actions = isAdmin ? adminActions : editorActions;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">

                {/* ── Header ── */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Welcome back — here's what's happening.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                        {actions.map((action) => (
                            <motion.div
                                key={action.label}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={action.href}>
                                    <Button
                                        size="sm"
                                        className={`${action.color} text-white gap-1.5 rounded-xl shadow-sm`}
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        {action.label}
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Stat Cards ── */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
                >
                    <StatCard
                        label="Total Articles"
                        value={articles.total}
                        growth={5}
                        icon={<FileText className="w-5 h-5 text-blue-600" />}
                        accent="bg-blue-50"
                        href="/admin/articles"
                        sub={`${articles.published} published · ${articles.draft} drafts`}
                    />

                    <StatCard
                        label="Gallery Items"
                        value={galleries}
                        growth={3}
                        icon={<Image className="w-5 h-5 text-violet-600" />}
                        accent="bg-violet-50"
                        href="/admin/galleries"
                    />

                    {isAdmin && users && (
                        <StatCard
                            label="Total Users"
                            value={users.total}
                            growth={8}
                            icon={<Users className="w-5 h-5 text-sky-600" />}
                            accent="bg-sky-50"
                            href="/admin/users"
                            sub={`${users.admin} admins · ${users.users} members`}
                        />
                    )}

                    {isAdmin && employees !== undefined && (
                        <StatCard
                            label="Employees"
                            value={employees}
                            growth={2}
                            icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
                            accent="bg-indigo-50"
                            href="/admin/employees"
                        />
                    )}

                    {achievements && (
                        <StatCard
                            label="Achievements"
                            value={achievements.total}
                            growth={12}
                            icon={<Trophy className="w-5 h-5 text-amber-600" />}
                            accent="bg-amber-50"
                            href="/admin/achievements"
                            sub={`${achievements.academic} academic · ${achievements.non_academic} non-academic`}
                        />
                    )}
                </motion.div>

                {/* ── Chart + Summary ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">

                    {/* Chart */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="xl:col-span-2"
                    >
                        <Card className="rounded-2xl border border-gray-100 shadow-sm h-full">
                            <CardHeader className="pb-0 pt-5 px-5">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-semibold text-gray-800">
                                        Activity Overview
                                    </CardTitle>
                                    <span className="text-xs text-gray-400">Last 7 months</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 px-2 pb-4">
                                {hasChartData ? (
                                    <>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={monthly_chart} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    allowDecimals={false}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="articles"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    fill="url(#colorArticles)"
                                                    dot={false}
                                                    activeDot={{ r: 4, fill: '#3b82f6' }}
                                                    animationDuration={1200}
                                                />
                                                {isAdmin && (
                                                    <Area
                                                        type="monotone"
                                                        dataKey="users"
                                                        stroke="#8b5cf6"
                                                        strokeWidth={2}
                                                        fill="url(#colorUsers)"
                                                        dot={false}
                                                        activeDot={{ r: 4, fill: '#8b5cf6' }}
                                                        animationDuration={1400}
                                                    />
                                                )}
                                            </AreaChart>
                                        </ResponsiveContainer>

                                        {/* Legend */}
                                        <div className="flex items-center gap-4 px-4 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />
                                                Articles
                                            </div>
                                            {isAdmin && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <span className="w-3 h-0.5 bg-violet-500 inline-block rounded" />
                                                    Users
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <ChartEmptyState />
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Summary Panel */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <Card className="rounded-2xl border border-gray-100 shadow-sm h-full">
                            <CardHeader className="pt-5 px-5 pb-0">
                                <CardTitle className="text-base font-semibold text-gray-800">
                                    Content Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-4 space-y-4">

                                {/* Articles breakdown */}
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Articles</p>
                                    <div className="space-y-2">
                                        <SummaryRow label="Total" value={articles.total} color="bg-blue-500" max={articles.total} />
                                        <SummaryRow label="Published" value={articles.published} color="bg-emerald-500" max={articles.total} />
                                        <SummaryRow label="Draft" value={articles.draft} color="bg-amber-400" max={articles.total} />
                                    </div>
                                </div>

                                <Separator />

                                {achievements && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Achievements</p>
                                        <div className="space-y-2">
                                            <SummaryRow label="Academic" value={achievements.academic} color="bg-sky-500" max={achievements.total} />
                                            <SummaryRow label="Non-Academic" value={achievements.non_academic} color="bg-violet-500" max={achievements.total} />
                                        </div>
                                    </div>
                                )}

                                {isAdmin && users && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Users</p>
                                            <div className="space-y-2">
                                                <SummaryRow label="Members" value={users.users} color="bg-blue-400" max={users.total} />
                                                <SummaryRow label="Admins" value={users.admin} color="bg-indigo-500" max={users.total} />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* ── Recent Activity ── */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <RecentCard
                        title="Recent Articles"
                        href="/admin/articles"
                        icon={<FileText className="w-4 h-4 text-blue-600" />}
                        items={[]}
                        emptyMessage="No articles yet"
                    />

                    {isAdmin && (
                        <RecentCard
                            title="Recent Users"
                            href="/admin/users"
                            icon={<Users className="w-4 h-4 text-sky-600" />}
                            items={[]}
                            emptyMessage="No users yet"
                        />
                    )}
                </motion.div>
            </div>
        </AppLayout>
    );
}

// ─── Helper: Summary Row ──────────────────────────────────────────────────────

function SummaryRow({ label, value, color, max }: {
    label: string;
    value: number;
    color: string;
    max: number;
}) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">{label}</span>
                <span className="text-xs font-semibold text-gray-800">{value}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: easeOut }}
                />
            </div>
        </div>
    );
}

// ─── Helper: Recent Card ──────────────────────────────────────────────────────

function RecentCard({
    title,
    href,
    icon,
    items,
    emptyMessage,
}: {
    title: string;
    href: string;
    icon: React.ReactNode;
    items: Array<{ id: number; label: string; sub?: string; href: string }>;
    emptyMessage: string;
}) {
    return (
        <motion.div variants={fadeIn}>
            <Card className="rounded-2xl border border-gray-100 shadow-sm">
                <CardHeader className="pt-5 px-5 pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {icon}
                            <CardTitle className="text-sm font-semibold text-gray-800">
                                {title}
                            </CardTitle>
                        </div>
                        <Link href={href}>
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 gap-0.5 h-7 px-2">
                                View all <ArrowUpRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="px-5 py-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                {icon}
                            </div>
                            <p className="text-sm text-gray-400">{emptyMessage}</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <li key={item.id}>
                                    <Link href={item.href}>
                                        <motion.div
                                            whileHover={{ x: 2 }}
                                            className="flex items-center justify-between py-2.5 group cursor-pointer"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {item.label}
                                                </p>
                                                {item.sub && (
                                                    <p className="text-xs text-gray-400">{item.sub}</p>
                                                )}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </motion.div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}