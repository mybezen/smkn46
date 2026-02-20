import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { Menu, X } from 'lucide-react';
import type { Setting } from '@/types/models';

interface NavbarProps {
    setting: Setting | null;
}

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profile', label: 'Profil' },
    { href: '/majors', label: 'Jurusan' },
    { href: '/articles', label: 'Berita' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/contact', label: 'Kontak' },
];

const drawerVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.35, ease: easeOut },
    },
    exit: {
        x: '100%',
        opacity: 0,
        transition: { duration: 0.28, ease: easeOut },
    },
};

const linkItemVariants: Variants = {
    hidden: { opacity: 0, x: 24 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.07, duration: 0.35, ease: easeOut },
    }),
};

export default function Navbar({ setting }: NavbarProps) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const isActive = (href: string) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <>
            <header
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
                        : 'bg-white/80 backdrop-blur-sm'
                }`}
            >
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        {setting?.logo ? (
                            <img
                                src={setting.logo}
                                alt={setting.school_name}
                                className="h-9 w-9 object-contain"
                            />
                        ) : (
                            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {setting?.school_name?.charAt(0) ?? 'S'}
                                </span>
                            </div>
                        )}
                        <span className="font-semibold text-gray-800 text-sm leading-tight max-w-[160px] group-hover:text-blue-600 transition-colors duration-200">
                            {setting?.school_name ?? 'Sekolah'}
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                                        isActive(href)
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                >
                                    {label}
                                    <span
                                        className={`absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-blue-500 transition-all duration-300 origin-left ${
                                            isActive(href) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60'
                                        }`}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="hidden lg:block shrink-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-sm"
                        >
                            Hubungi Kami
                        </Link>
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setOpen(true)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        aria-label="Buka menu"
                    >
                        <Menu size={22} />
                    </button>
                </nav>
            </header>

            {/* Mobile drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                <span className="font-semibold text-gray-800 text-sm">
                                    {setting?.school_name ?? 'Menu'}
                                </span>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    aria-label="Tutup menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto px-3 py-4">
                                <ul className="space-y-1">
                                    {navLinks.map(({ href, label }, i) => (
                                        <motion.li
                                            key={href}
                                            custom={i}
                                            variants={linkItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <Link
                                                href={href}
                                                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                                                    isActive(href)
                                                        ? 'bg-blue-50 text-blue-600'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="px-5 py-4 border-t border-gray-100">
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Hubungi Kami
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}