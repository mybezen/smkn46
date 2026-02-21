import { usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import Navbar from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import type { Setting } from '@/types/models';

interface PublicLayoutProps {
    children: React.ReactNode;
}

interface SharedProps {
    setting?: Setting | null;
    [key: string]: unknown;
}

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4, ease: easeOut },
    },
};

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { props } = usePage<SharedProps>();
    const setting = props.setting ?? null;
    const logo = props.setting.logo_url;
    const schoolName = props.setting.school_name;

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="flex min-h-screen flex-col bg-white"
        >
            <Navbar logo={logo} schoolName={schoolName} />
            <main className="flex-1 pt-16">{children}</main>
            <Footer setting={setting} />
        </motion.div>
    );
}
