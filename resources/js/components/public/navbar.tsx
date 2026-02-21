import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    logo: string | null;
    schoolName: string;
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

export default function Navbar({ logo, schoolName }: NavbarProps) {
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
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const isActive = (href: string) =>
        href === '/' ? url === '/' : url.startsWith(href);

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md'
                        : 'bg-white/80 backdrop-blur-sm'
                }`}
            >
                <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex shrink-0 items-center gap-3"
                    >
                        {logo ? (
                            <img
                                src={logo}
                                alt={schoolName}
                                className="h-9 w-9 object-contain"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                                <span className="text-sm font-bold text-white">
                                    {schoolName.charAt(0) ?? 'S'}
                                </span>
                            </div>
                        )}
                        <span className="max-w-[160px] text-sm leading-tight font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                            {schoolName}
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <ul className="hidden items-center gap-1 lg:flex">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive(href)
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-blue-600'
                                    }`}
                                >
                                    {label}
                                    <span
                                        className={`absolute right-3 bottom-1 left-3 h-0.5 origin-left rounded-full bg-blue-500 transition-all duration-300 ${
                                            isActive(href)
                                                ? 'scale-x-100 opacity-100'
                                                : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60'
                                        }`}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="hidden shrink-0 lg:block">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800"
                        >
                            Hubungi Kami
                        </Link>
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
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
                            className="fixed top-0 right-0 bottom-0 z-50 flex w-72 flex-col bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                <span className="text-sm font-semibold text-gray-800">
                                    {schoolName ?? 'Menu'}
                                </span>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
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
                                                className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
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

                            <div className="border-t border-gray-100 px-5 py-4">
                                <Link
                                    href="/contact"
                                    className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
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
