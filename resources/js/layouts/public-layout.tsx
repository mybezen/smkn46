import React from 'react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import type { Setting } from '@/types/public';

interface PublicLayoutProps {
    children: React.ReactNode;
    variant?: 'landing' | 'default';
}

interface SharedProps {
    setting?: Setting | null;
    [key: string]: unknown;
}

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: easeOut },
    },
};

export default function PublicLayout({ children, variant = 'default' }: PublicLayoutProps) {
    const { props } = usePage<SharedProps>();
    const setting = props.setting ?? null;
    const logo = props.setting.logo_url;
    const schoolName = props.setting.school_name;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="min-h-screen flex flex-col bg-white"
        >
            <Navbar variant={variant} setting={setting} />
            <main className="flex-1">
                {children}
            </main>
            <Footer setting={setting} />
        </motion.div>
    );
}
