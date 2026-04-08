'use client'

import { motion } from 'framer-motion'
import {Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaHome, FaEnvelope, FaLock } from 'react-icons/fa'

export default function ErrorPage({
    statusCode = 404,
    message = "Page Not Found"
}) {
    const { t } = useTranslation();
    const getStatusMessage = () => {
        switch (statusCode) {
            case 403:
                return t('error.forbidden');
            case 404:
                return t('error.notFound');
            default:
                return t('error.default');
        }
    };

    // Custom icons based on status code
    const StatusIcon = () => {
        switch (statusCode) {
            case 403:
                return <FaLock className="text-5xl text-primary-600  mb-4" />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-br flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="overflow-hidden">
                    {/* Glass morphic header */}
                    <div className="p-6 text-center">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="text-8xl font-bold text-primary-600"
                        >
                            {statusCode}
                        </motion.div>
                    </div>

                    {/* Content area */}
                    <div className="p-8 text-center flex flex-col justify-center items-center">
                        {statusCode === 403 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <StatusIcon />
                            </motion.div>
                        )}

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-neutral-900   mb-2"
                        >
                            {message}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-neutral-600   mb-8"
                        >
                            {getStatusMessage()}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                to="/"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                            >
                                <FaHome className="text-lg" />
                                {t('error.goHome')}
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/80   hover:bg-neutral-100   text-neutral-800   rounded-lg transition-colors border border-neutral-400"
                            >
                                <FaArrowLeft className="text-lg" />
                                {t('error.goBack')}
                            </button>
                        </motion.div>

                        {statusCode !== 404 && statusCode !== 403 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 pt-6 border-t border-neutral-400"
                            >
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}