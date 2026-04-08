'use client'

import { motion } from 'framer-motion'
import {Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaHome, FaArrowLeft, FaTools, FaHardHat, FaHeart } from 'react-icons/fa'

export default function UnderDevelopment({
    message = 'R.E.G | Under Development',
    description = 'This page for R.E.G is currently under construction. We\'re working hard to bring you something amazing. Please check back later.',
}) {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="overflow-hidden">
                    {/* Animated icon header */}
                    <div className="p-6 text-center">
                        <motion.div
                            initial={{ scale: 0.9, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                damping: 10,
                                delay: 0.1,
                            }}
                            className="inline-flex items-center justify-center"
                        >
                            <div className="relative">
                                <FaTools className="text-8xl text-primary-500" />
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    className="absolute -top-2 -inset-e-2"
                                >
                                    <FaHardHat className="text-4xl text-warning-500" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content area */}
                    <div className="p-8 text-center flex flex-col justify-center items-center">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-neutral-900mb-3"
                        >
                            <span className="text-primary-600">R.E.G</span> {message.replace('R.E.G | ', '')}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-neutral-600 mb-8 max-w-sm"
                        >
                            {description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="pt-6 border-t border-neutral-300 w-full text-sm text-neutral-500"
                        >
                            <p>
                                {t('underDevelopment.estimatedTime', 'Estimated completion: Soon')}
                            </p>
                            <p className="mt-3 flex items-center justify-center gap-1 text-xs">
                                {t('underDevelopment.developedBy', 'Developed with')}{' '}
                                <FaHeart className="text-red-500 mx-1" />{' '}
                                {t('underDevelopment.by', 'by')}{' '}
                                <a
                                    href="https://apex-software.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:underline font-medium"
                                >
                                    Apex Software
                                </a>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}