import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import PublicLayout from '@/layouts/public-layout';
import SectionWrapper from '@/components/public/section-wrapper';
import { extractIframeSrc } from '@/lib/utils';
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Award,
    Users,
    Calendar,
    ExternalLink,
    Cpu,
    Wrench,
    FlaskConical,
    Landmark,
    Shirt,
    Car,
    Network,
    Utensils,
    Building2,
    Zap,
    MapPin,
    Phone,
    Mail,
    Send,
} from 'lucide-react';
import type { Banner, Major, Article, Setting, SchoolProfile } from '@/types/public';

interface WelcomeProps {
    banners: Banner[];
    majors: Major[];
    articles: Article[];
    setting: Setting | null;
    headmaster: SchoolProfile | null;
}

const cardVariant: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: easeOut, delay: i * 0.1 },
    }),
};

const stats = [
    { icon: GraduationCap, value: '600+', label: 'Siswa Aktif' },
    { icon: Users, value: '20+', label: 'Tenaga Pendidik' },
    { icon: Award, value: '150+', label: 'Prestasi' },
    { icon: BookOpen, value: '5', label: 'Program Keahlian' },
];

const MAJOR_ICONS: Record<string, React.ElementType> = {
    default: BookOpen,
    tkj: Network,
    rpl: Cpu,
    tki: Network,
    teknik: Wrench,
    kimia: FlaskConical,
    akuntansi: Landmark,
    busana: Shirt,
    otomotif: Car,
    kuliner: Utensils,
    konstruksi: Building2,
    listrik: Zap,
};

function getMajorIcon(name: string): React.ElementType {
    const lower = name.toLowerCase();
    for (const [key, Icon] of Object.entries(MAJOR_ICONS)) {
        if (key !== 'default' && lower.includes(key)) return Icon;
    }
    return MAJOR_ICONS.default;
}

function HeroCarousel({ banners }: { banners: Banner[] }) {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const total = banners.length;

    useEffect(() => {
        if (total <= 1) return;
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, 5500);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [total]);

    if (!total) {
        return (
            <div className="relative h-[62vh] min-h-[500px] md:min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500">
                <HeroContent banner={null} />
            </div>
        );
    }

    return (
        <div className="relative h-[62vh] min-h-[500px] md:min-h-screen overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.7, ease: easeOut }}
                    className="absolute inset-0"
                >
                    <img
                        src={banners[current].image_url}
                        alt={banners[current].title}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-20 h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
                        className="h-full"
                    >
                        <HeroContent banner={banners[current]} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function HeroContent({ banner }: { banner: Banner | null }) {
    return (
        <div className="flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 md:pt-28">
                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 text-blue-200 text-xs font-semibold mb-5 tracking-widest uppercase"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                    Selamat Datang
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22, ease: easeOut }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white max-w-3xl leading-[1.1] mb-5"
                >
                    {banner?.title ?? 'Membangun Generasi Unggul'}
                </motion.h1>

                {banner?.description && (
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.34, ease: easeOut }}
                        className="text-sm sm:text-base md:text-lg text-gray-200/90 max-w-lg mb-8 leading-relaxed"
                    >
                        {banner.description}
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.44, ease: easeOut }}
                    className="flex flex-wrap gap-3"
                >
                    <Link
                        href="/majors"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-700/30 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                    >
                        Program Keahlian
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                    >
                        Tentang Kami
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

function StatsSection() {
    return (
        <SectionWrapper className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {stats.map(({ icon: Icon, value, label }, i) => (
                        <motion.div
                            key={label}
                            custom={i}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.22 }}
                            className="bg-white rounded-2xl p-4 md:p-6 text-center shadow-[0_8px_32px_-8px_rgba(59,130,246,0.13),0_2px_8px_-2px_rgba(59,130,246,0.06)] border border-gray-100"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div className="text-xl md:text-2xl font-black text-gray-800 mb-0.5">{value}</div>
                            <div className="text-xs md:text-sm text-gray-500 font-medium">{label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

function PPDBSection() {
    return (
        <SectionWrapper className="py-10 md:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.a
                    href="https://ppdb.jakarta.go.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, ease: easeOut }}
                    whileHover={{ scale: 1.012 }}
                    className="group relative flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl overflow-hidden px-8 py-8 md:py-10 cursor-pointer bg-gradient-to-br from-blue-600 via-blue-600 to-blue-800"
                >
                    <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-900/30 blur-2xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none" />

                    <div className="relative z-10 text-center md:text-left">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                            Pendaftaran Dibuka
                        </span>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-1">
                            Penerimaan Peserta Didik Baru
                        </h3>
                        <p className="text-blue-200 text-sm md:text-base max-w-md">
                            Daftarkan diri sekarang melalui sistem PPDB Online Provinsi DKI Jakarta.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <div className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all duration-200 group-hover:-translate-y-0.5 text-sm">
                            Daftar Sekarang
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </motion.a>
            </div>
        </SectionWrapper>
    );
}

function HeadmasterSection({ headmaster }: { headmaster: SchoolProfile | null }) {
    if (!headmaster) return null;
    return (
        <SectionWrapper className="py-16 md:py-24 bg-gray-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                            Kata Sambutan
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-5 leading-snug">
                            {headmaster.title}
                        </h2>
                        <div
                            className="text-gray-600 leading-relaxed text-sm md:text-base prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: headmaster.content }}
                        />
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 mt-7 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                        >
                            Selengkapnya
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="order-1 lg:order-2 flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl -z-10" />
                            <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-blue-200/40 rounded-2xl -z-10 blur-sm" />
                            {headmaster.main_image_url ? (
                                <img
                                    src={headmaster.main_image_url}
                                    alt={headmaster.title}
                                    className="w-60 h-80 md:w-72 md:h-96 object-cover rounded-2xl shadow-[0_16px_48px_-8px_rgba(59,130,246,0.18),0_4px_16px_-4px_rgba(59,130,246,0.10)]"
                                />
                            ) : (
                                <div className="w-60 h-80 md:w-72 md:h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center">
                                    <GraduationCap className="w-16 h-16 text-blue-300" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

function MajorsSection({ majors }: { majors: Major[] }) {
    return (
        <SectionWrapper className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-14">
                    <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                        Program Keahlian
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">
                        Pilihan Jurusan Unggulan
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
                        Temukan program keahlian yang sesuai dengan minat dan bakatmu.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {majors.map((major, i) => {
                        const Icon = getMajorIcon(major.name);
                        return (
                            <motion.div
                                key={major.id}
                                custom={i}
                                variants={cardVariant}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.22 }}
                                className="group"
                            >
                                <Link
                                    href={`/majors/${major.slug}`}
                                    className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-[0_8px_32px_-8px_rgba(59,130,246,0.16),0_2px_8px_-4px_rgba(59,130,246,0.08)] transition-all duration-300 hover:border-blue-100"
                                >
                                    <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                                        <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-800 text-base group-hover:text-blue-600 transition-colors leading-snug">
                                            {major.name}
                                        </h3>
                                        {major.description && (
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                {major.description}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {majors.length > 0 && (
                    <div className="text-center mt-10">
                        <Link
                            href="/majors"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                            Semua Program Keahlian
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}

function ArticlesSection({ articles }: { articles: Article[] }) {
    if (!articles.length) return null;
    return (
        <SectionWrapper className="py-16 md:py-24 bg-gray-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                            Berita Terkini
                        </span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">
                            Artikel & Pengumuman
                        </h2>
                    </div>
                    <Link
                        href="/articles"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                    >
                        Semua Artikel
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {articles.map((article, i) => (
                        <motion.article
                            key={article.id}
                            custom={i}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.22 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_12px_40px_-8px_rgba(59,130,246,0.14),0_4px_12px_-4px_rgba(59,130,246,0.06)] transition-all duration-300 flex flex-col"
                        >
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {article.thumbnail_url ? (
                                    <img
                                        src={article.thumbnail_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <BookOpen className="w-10 h-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    {article.category && (
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            {article.category.name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(article.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <Link
                                    href={`/articles/${article.slug}`}
                                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                                >
                                    Baca selengkapnya
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="sm:hidden mt-6 text-center">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                        Semua Artikel <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </SectionWrapper>
    );
}

function LocationSection({ setting }: { setting: Setting | null }) {
    const mapSrc = extractIframeSrc(setting?.maps);

    return (
        <SectionWrapper className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-12">
                    <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                        Lokasi Kami
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">
                        Temukan Kami di Sini
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1 space-y-4">
                        {setting?.address && (
                            <div className="flex gap-3.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <MapPin className="w-4.5 h-4.5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Alamat</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{setting.address}</p>
                                </div>
                            </div>
                        )}
                        {setting?.phone && (
                            <a
                                href={`tel:${setting.phone}`}
                                className="flex gap-3.5 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
                            >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Telepon</p>
                                    <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{setting.phone}</p>
                                </div>
                            </a>
                        )}
                        {setting?.email && (
                            <a
                                href={`mailto:${setting.email}`}
                                className="flex gap-3.5 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group"
                            >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{setting.email}</p>
                                </div>
                            </a>
                        )}
                        {mapSrc && (
                            <a
                                href={mapSrc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Buka di Google Maps
                            </a>
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        {mapSrc ? (
                            <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(59,130,246,0.15),0_2px_8px_-2px_rgba(59,130,246,0.08)] border border-gray-100 h-72 md:h-96">
                                <iframe
                                    src={mapSrc}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Sekolah"
                                />
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-gray-100 border border-gray-200 h-72 md:h-96 flex flex-col items-center justify-center gap-3 text-gray-400">
                                <MapPin className="w-10 h-10" />
                                <p className="text-sm font-medium">Peta belum tersedia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

function ContactSection() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSent(true);
        setEmail('');
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <SectionWrapper className="py-16 md:py-20 bg-gray-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-600 to-blue-800 rounded-3xl px-8 py-12 md:py-16 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-xl mx-auto text-center">
                        <span className="inline-block text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">
                            Tetap Terhubung
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                            Dapatkan Informasi Terbaru
                        </h2>
                        <p className="text-blue-200 text-sm md:text-base mb-8">
                            Masukkan email Anda untuk mendapatkan pengumuman, berita sekolah, dan informasi penting lainnya.
                        </p>

                        <AnimatePresence mode="wait">
                            {sent ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3, ease: easeOut }}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-500/30 rounded-xl border border-blue-400/40 text-white font-semibold text-sm"
                                >
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                    Terima kasih! Kami akan segera menghubungi Anda.
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3, ease: easeOut }}
                                    onSubmit={handleSubmit}
                                    className="flex flex-col sm:flex-row gap-3"
                                >
                                    <div className="flex-1 relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alamat@email.com"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-blue-300/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:-translate-y-0.5 text-sm shrink-0 shadow-lg"
                                    >
                                        Berlangganan
                                        <Send className="w-4 h-4" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <p className="text-blue-300/70 text-xs mt-4">
                            Kami menghargai privasi Anda. Tidak ada spam.
                        </p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

export default function Welcome({ banners, majors, articles, setting, headmaster }: WelcomeProps) {
    return (
        <PublicLayout variant="landing">
            <Head title={setting?.school_name ?? 'Beranda'} />
            <HeroCarousel banners={banners} />
            <StatsSection />
            <PPDBSection />
            <HeadmasterSection headmaster={headmaster} />
            <MajorsSection majors={majors} />
            <ArticlesSection articles={articles} />
            <LocationSection setting={setting} />
            <ContactSection />
        </PublicLayout>
    );
}