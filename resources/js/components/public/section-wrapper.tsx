import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    tight?: boolean;
}

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: easeOut },
    },
};

export default function SectionWrapper({ children, className, id, tight }: SectionWrapperProps) {
    return (
        <motion.section
            id={id}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className={cn(
                'w-full',
                tight ? 'py-12' : 'py-20',
                className,
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </motion.section>
    );
}