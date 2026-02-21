import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Phone, Mail, ExternalLink, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import type { Setting } from '@/types/public';

interface FooterProps {
    setting: Setting | null;
}

const quickLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil Sekolah', href: '/profile' },
    { label: 'Program Keahlian', href: '/majors' },
    { label: 'Artikel & Berita', href: '/articles' },
    { label: 'Galeri', href: '/gallery' },
    { label: 'Kontak Kami', href: '/contact' },
];

export default function Footer({ setting }: FooterProps) {
    const year = new Date().getFullYear();

    const socials = [
        { icon: Facebook, href: setting?.facebook_link ?? '', label: 'Facebook' },
        { icon: Instagram, href: setting?.instagram_link ?? '', label: 'Instagram' },
        { icon: Twitter, href: setting?.twitter_link ?? '', label: 'Twitter / X' },
        { icon: Youtube, href: setting?.youtube_link ?? '', label: 'YouTube' },
   
    ];

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            {setting?.logo_url && (
                                <img
                                    src={setting.logo_url}
                                    alt={setting?.school_name ?? 'Logo'}
                                    className="h-10 w-10 object-contain"
                                />
                            )}
                            <span className="font-bold text-lg text-gray-800">
                                {setting?.school_name ?? 'Sekolah'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
                            Mencetak generasi unggul yang berkarakter, kompeten, dan siap menghadapi tantangan masa depan.
                        </p>

                        {socials.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {socials.map(({ icon: Icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        title={label}
                                        className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-[0_2px_12px_rgba(59,130,246,0.12)] transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                            Navigasi
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 flex items-center gap-1.5 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 rounded-full transition-all duration-200 overflow-hidden" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                            Kontak
                        </h3>
                        <ul className="space-y-3">
                            {setting?.address && (
                                <li className="flex gap-2.5 text-sm text-gray-500 leading-relaxed">
                                    <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span>{setting.address}</span>
                                </li>
                            )}
                            {setting?.phone && (
                                <li>
                                    <a
                                        href={`tel:${setting.phone}`}
                                        className="flex gap-2.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                                        {setting.phone}
                                    </a>
                                </li>
                            )}
                            {setting?.email && (
                                <li>
                                    <a
                                        href={`mailto:${setting.email}`}
                                        className="flex gap-2.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                                        {setting.email}
                                    </a>
                                </li>
                            )}
                            {setting?.maps && (
                                <li>
                                    <a
                                        href={setting.maps.startsWith('http') ? setting.maps : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-700 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Lihat di Google Maps
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                        © {year} {setting?.school_name ?? 'Sekolah'}. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-gray-400">
                        @peintagons.id
                    </p>
                </div>
            </div>
        </footer>
    );
}