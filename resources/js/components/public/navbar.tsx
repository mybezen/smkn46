import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import type { Setting } from '@/types/public';

interface NavbarProps {
    variant?: 'landing' | 'default';
    setting: Setting | null;
}

interface NavItem {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
    { label: 'Beranda', href: '/' },
    {
        label: 'Profil',
        href: '/profile',
        children: [
            { label: 'Tentang Sekolah', href: '/profile' },
            { label: 'Kepala Sekolah', href: '/profile#headmaster' },
            { label: 'Tenaga Pendidik', href: '/employees' },
        ],
    },
    { label: 'Program Keahlian', href: '/majors' },
    { label: 'Artikel', href: '/articles' },
    { label: 'Galeri', href: '/gallery' },
    { label: 'Kontak', href: '/contact' },
];

const drawerVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: easeOut } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.28, ease: easeOut } },
};

const navbarReveal: Variants = {
    hidden: { y: -80, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

export default function Navbar({ variant = 'default', setting }: NavbarProps) {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        if (variant !== 'landing') return;
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant]);

    const isLanding = variant === 'landing';
    const isTransparent = isLanding && !scrolled;

    const navClasses = [
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(59,130,246,0.08),0_2px_8px_-2px_rgba(234,179,8,0.06)]',
    ].join(' ');

    const linkColor = isTransparent ? 'text-white' : 'text-gray-700';
    const logoTextColor = isTransparent ? 'text-white' : 'text-blue-600';

    const isActive = (href: string) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <>
            <motion.nav
                variants={navbarReveal}
                initial="hidden"
                animate="visible"
                className={navClasses}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            {setting?.logo_url && (
                                <img
                                    src={setting.logo_url}
                                    alt={setting.school_name}
                                    className="h-9 w-9 object-contain"
                                />
                            )}
                            <span
                                className={`font-bold text-base lg:text-lg leading-tight transition-colors duration-300 ${logoTextColor}`}
                                style={{ fontFamily: "'Urbanist', sans-serif" }}
                            >
                                {setting?.school_name ?? 'Sekolah'}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <div
                                    key={item.href}
                                    className="relative"
                                    onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <Link
                                        href={item.href}
                                        className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group
                                            ${isActive(item.href) ? 'text-blue-600' : `${linkColor} hover:text-blue-600`}`}
                                    >
                                        {item.label}
                                        {item.children && (
                                            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                        )}
                                        {/* Animated underline */}
                                        <motion.span
                                            className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-blue-500 rounded-full origin-left"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: isActive(item.href) ? 1 : 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.25, ease: easeOut }}
                                        />
                                    </Link>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {item.children && openDropdown === item.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                                transition={{ duration: 0.2, ease: easeOut }}
                                                className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                                            >
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setDrawerOpen(false)}
                        />
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <span className="font-bold text-blue-600 text-base" style={{ fontFamily: "'Urbanist', sans-serif" }}>
                                    {setting?.school_name ?? 'Sekolah'}
                                </span>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto py-4 px-3">
                                {navItems.map((item) => (
                                    <div key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setDrawerOpen(false)}
                                            className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium mb-1 transition-colors duration-150
                                                ${isActive(item.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                                        >
                                            {item.label}
                                        </Link>
                                        {item.children && (
                                            <div className="ml-3 border-l-2 border-blue-100 pl-3 mb-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        onClick={() => setDrawerOpen(false)}
                                                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50/50 transition-colors mb-0.5"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
