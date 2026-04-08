import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
            <div className="max-w-md mx-auto space-y-4">
                {Icon && (
                    <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                        <Icon className="text-3xl text-primary-600" />
                    </div>
                )}

                <h3 className="text-2xl font-bold text-third-900">
                    {title}
                </h3>

                {description && (
                    <p className="text-third-500">
                        {description}
                    </p>
                )}

                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </motion.div>
    );
}