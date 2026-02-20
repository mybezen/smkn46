import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import type { Setting } from '@/types/models';
import { extractIframeSrc } from '@/lib/utils';

interface FooterProps {
    setting: Setting | null;
}

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/profile', label: 'Profil Sekolah' },
    { href: '/majors', label: 'Jurusan' },
    { href: '/articles', label: 'Berita & Artikel' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/contact', label: 'Kontak' },
];

export default function Footer({ setting }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
                            {setting?.logo ? (
                                <img
                                    src={setting.logo}
                                    alt={setting.school_name}
                                    className="h-10 w-10 object-contain"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold">
                                        {setting?.school_name?.charAt(0) ?? 'S'}
                                    </span>
                                </div>
                            )}
                            <span className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors">
                                {setting?.school_name ?? 'Sekolah'}
                            </span>
                        </Link>

                        <div className="space-y-3 mt-5">
                            {setting?.address && (
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <MapPin size={16} className="mt-0.5 shrink-0 text-blue-500" />
                                    <span className="leading-relaxed">{setting.address}</span>
                                </div>
                            )}
                            {setting?.phone && (
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="mt-0.5 shrink-0 text-blue-500" />
                                    <a
                                        href={`tel:${setting.phone}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {setting.phone}
                                    </a>
                                </div>
                            )}
                            {setting?.email && (
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="mt-0.5 shrink-0 text-blue-500" />
                                    <a
                                        href={`mailto:${setting.email}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {setting.email}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social */}
                        <div className="flex gap-3 mt-6">
                            {setting?.facebook_link && (
                                <a
                                    href={setting.facebook_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={17} />
                                </a>
                            )}
                            {setting?.instagram_link && (
                                <a
                                    href={setting.instagram_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-pink-500 hover:border-pink-200 transition-colors shadow-sm"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={17} />
                                </a>
                            )}
                            {setting?.twitter_link && (
                                <a
                                    href={setting.twitter_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-sky-500 hover:border-sky-200 transition-colors shadow-sm"
                                    aria-label="Twitter / X"
                                >
                                    <Twitter size={17} />
                                </a>
                            )}
                            {setting?.youtube_link && (
                                <a
                                    href={setting.youtube_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                                    aria-label="YouTube"
                                >
                                    <Youtube size={17} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Nav links */}
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-4 uppercase tracking-wide">
                            Navigasi
                        </h3>
                        <ul className="space-y-2.5">
                            {navLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Maps */}
                    {setting?.maps && (
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-4 uppercase tracking-wide">
                                Lokasi
                            </h3>
                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                                <iframe
                                    src={extractIframeSrc(setting.maps)}
                                    className="w-full h-full"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Sekolah"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">
                        &copy; {year} {setting?.school_name ?? 'Sekolah'}. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-gray-400">
                        Dibuat dengan ❤️ untuk pendidikan Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
}