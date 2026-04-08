'use client'

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';
// next/image removed;

export default function Loading() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                {/* Logo with image */}
                <motion.div
                    animate={{
                        scale: [1, 1, 1],
                        opacity: [1, 0.6, 1],
                    }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="relative"
                >
                    <div className="relative w-32 h-24 mx-auto">
                        <img src="/logo.png"
                            alt="R.E.G Logo" className="object-contain"
                        />
                    </div>
                </motion.div>


                {/* Simple loading indicator */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 0.8 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 1 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4, delay: 1.2 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.6, delay: 1.4 }}
                            className="w-2 h-2 bg-primary-500 rounded-full"
                        ></motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}