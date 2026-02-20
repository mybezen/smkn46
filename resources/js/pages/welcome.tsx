import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { Head } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    BookOpen,
    CalendarDays,
    GraduationCap,
    Sparkles,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import SectionWrapper from '@/components/public/section-wrapper';
import type { Banner, Major, Article, Setting, SchoolProfile } from '@/types/models';

// ─── Types ──────────────────────────────────────────────────────────────────

interface WelcomeProps {
    banners: Banner[];
    headmaster: Pick<SchoolProfile, 'title' | 'content' | 'main_image'> | null;
    majors: Major[];
    articles: Article[];
    setting: Setting | null;
}

// ─── Variants ───────────────────────────────────────────────────────────────

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

// ─── Hero / Banner Carousel ──────────────────────────────────────────────────

function HeroCarousel({ banners }: { banners: Banner[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((c) => (c + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
    const next = () => setCurrent((c) => (c + 1) % banners.length);

    if (banners.length === 0) {
        return (
            <div className="relative w-full h-[520px] sm:h-[600px] bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
                <div className="text-center text-white px-6">
                    <motion.h1
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
                    >
                        Selamat Datang
                    </motion.h1>
                    <motion.p
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.15 }}
                        className="text-blue-100 text-lg"
                    >
                        Bersama kami, raih masa depan gemilang.
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[520px] sm:h-[600px] overflow-hidden bg-gray-900">
            {banners.map((banner, i) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                    {/* Content */}
                    {i === current && (
                        <div className="absolute inset-0 flex items-end z-20">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 w-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 32 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.65, ease: easeOut }}
                                    className="max-w-2xl"
                                >
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                                        {banner.title}
                                    </h1>
                                    {banner.description && (
                                        <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed">
                                            {banner.description}
                                        </p>
                                    )}
                                    {banner.link && (
                                        <a
                                            href={banner.link}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg"
                                        >
                                            Selengkapnya <ArrowRight size={16} />
                                        </a>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Controls */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-colors"
                        aria-label="Sebelumnya"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-colors"
                        aria-label="Berikutnya"
                    >
                        <ChevronRight size={22} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`rounded-full transition-all duration-300 ${
                                    i === current
                                        ? 'w-6 h-2 bg-white'
                                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Stats Strip ────────────────────────────────────────────────────────────

function StatsStrip({ majors }: { majors: Major[] }) {
    const stats = [
        { icon: GraduationCap, label: 'Program Keahlian', value: `${majors.length}+` },
        { icon: BookOpen, label: 'Tahun Berpengalaman', value: '20+' },
        { icon: Sparkles, label: 'Prestasi Nasional', value: '50+' },
    ];

    return (
        <div className="bg-blue-600 text-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-blue-500">
                    {stats.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex flex-col items-center text-center px-6">
                            <Icon size={28} className="mb-2 text-blue-200" />
                            <span className="text-3xl font-bold mb-1">{value}</span>
                            <span className="text-blue-200 text-sm">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Section Heading ─────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="text-center mb-12">
            <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    variants={fadeUp}
                    className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            )}
            <motion.div
                variants={fadeUp}
                className="mx-auto mt-4 h-1 w-12 rounded-full bg-blue-500"
            />
        </div>
    );
}

// ─── Majors Section ──────────────────────────────────────────────────────────

function MajorsSection({ majors }: { majors: Major[] }) {
    return (
        <SectionWrapper className="bg-gray-50">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionHeading
                    title="Program Keahlian"
                    subtitle="Temukan jurusan yang sesuai dengan minat dan bakatmu untuk masa depan yang cerah."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {majors.map((major) => (
                        <motion.div key={major.id} variants={cardVariant}>
                            <Link
                                href={`/majors`}
                                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                            >
                                {major.preview_image ? (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={major.preview_image}
                                            alt={major.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                        {major.icon ? (
                                            <img src={major.icon} alt="" className="h-14 w-14 object-contain opacity-60" />
                                        ) : (
                                            <GraduationCap size={48} className="text-blue-300" />
                                        )}
                                    </div>
                                )}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-800 text-base mb-2 group-hover:text-blue-600 transition-colors">
                                        {major.name}
                                    </h3>
                                    {major.description && (
                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                            {major.description}
                                        </p>
                                    )}
                                    <span className="mt-3 inline-flex items-center gap-1 text-blue-600 text-sm font-medium">
                                        Pelajari lebih <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {majors.length > 0 && (
                    <motion.div variants={fadeUp} className="text-center mt-10">
                        <Link
                            href="/majors"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                        >
                            Lihat Semua Jurusan <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </SectionWrapper>
    );
}

// ─── Headmaster Section ──────────────────────────────────────────────────────

function HeadmasterSection({ headmaster }: { headmaster: WelcomeProps['headmaster'] }) {
    if (!headmaster) return null;

    return (
        <SectionWrapper>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
                    <div className="relative">
                        {headmaster.main_image ? (
                            <img
                                src={headmaster.main_image}
                                alt={headmaster.title}
                                className="w-72 h-80 object-cover rounded-2xl shadow-lg"
                            />
                        ) : (
                            <div className="w-72 h-80 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <GraduationCap size={80} className="text-blue-200" />
                            </div>
                        )}
                        {/* Decorative */}
                        <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-blue-200 -z-10" />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <motion.p variants={fadeUp} className="text-blue-600 font-medium text-sm uppercase tracking-widest mb-2">
                        Sambutan Kepala Sekolah
                    </motion.p>
                    <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-800 mb-5">
                        {headmaster.title}
                    </motion.h2>
                    <motion.div
                        variants={fadeUp}
                        className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: headmaster.content }}
                    />
                    <motion.div variants={fadeUp} className="mt-6">
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                        >
                            Baca Profil Lengkap <ArrowRight size={15} />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}

// ─── Articles Section ────────────────────────────────────────────────────────

function ArticlesSection({ articles }: { articles: Article[] }) {
    if (articles.length === 0) return null;

    return (
        <SectionWrapper className="bg-gray-50">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionHeading
                    title="Berita & Artikel"
                    subtitle="Informasi terkini seputar kegiatan dan prestasi sekolah."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article) => (
                        <motion.div key={article.id} variants={cardVariant}>
                            <Link
                                href={`/articles`}
                                className="group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {article.thumbnail && (
                                    <div className="sm:w-44 aspect-video sm:aspect-[4/3] overflow-hidden shrink-0">
                                        <img
                                            src={article.thumbnail}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-5 flex flex-col justify-between">
                                    <div>
                                        {article.category && (
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-2">
                                                {article.category.name}
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                            {article.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
                                        <CalendarDays size={13} />
                                        {new Date(article.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div variants={fadeUp} className="text-center mt-10">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                    >
                        Lihat Semua Berita <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </motion.div>
        </SectionWrapper>
    );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
    return (
        <SectionWrapper tight>
            <div className="bg-blue-600 rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500 opacity-30 -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-700 opacity-40 translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
                        Bergabunglah Bersama Kami
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                        Daftarkan diri Anda dan mulai perjalanan menuju masa depan yang lebih cerah bersama kami.
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-md"
                        >
                            Hubungi Kami <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/profile"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition-colors"
                        >
                            Tentang Sekolah
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}

// ─── Welcome Page ────────────────────────────────────────────────────────────

export default function Welcome({ banners, headmaster, majors, articles, setting }: WelcomeProps) {
    return (
        <PublicLayout>
            <Head title={setting?.school_name ?? 'Beranda'} />

            {/* Hero */}
            <HeroCarousel banners={banners} />

            {/* Stats */}
            <StatsStrip majors={majors} />

            {/* Headmaster */}
            <HeadmasterSection headmaster={headmaster} />

            {/* Majors */}
            {majors.length > 0 && <MajorsSection majors={majors} />}

            {/* Articles */}
            <ArticlesSection articles={articles} />

            {/* CTA */}
            <CTASection />
        </PublicLayout>
    );
}