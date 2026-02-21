import React from 'react';
import { motion } from 'motion/react';
import { easeOut } from 'motion';
import type { Variants } from 'motion/react';

interface SectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    delay?: number;
}

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: easeOut, delay },
    }),
};

export default function SectionWrapper({ children, className = '', id, delay = 0 }: SectionWrapperProps) {
    return (
        <motion.section
            id={id}
            custom={delay}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={sectionVariants}
            className={`w-full ${className}`}
        >
            {children}
        </motion.section>
    );
}