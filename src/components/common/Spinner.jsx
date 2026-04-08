import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Spinner Component
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size
 * @param {'primary' | 'white' | 'current'} props.color
 */
export const Spinner = ({
    size = 'md',
    color = 'primary',
    className = '',
}) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3',
        xl: 'w-12 h-12 border-4',
    };

    const colors = {
        primary: 'border-primary-500 border-t-transparent',
        white: 'border-white border-t-transparent',
        current: 'border-current border-t-transparent',
    };

    return (
        <div
            className={`inline-block rounded-full animate-spin ${sizes[size]} ${colors[color]} ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
};

// Full Page Loader
export const PageLoader = ({ message }) => {
    const { t } = useTranslation();
    const displayMessage = message || t('common.loading');
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-50/80  /80 backdrop-blur-sm">
            <Spinner size="xl" />
            {displayMessage && (
                <p className="mt-4 text-third-900   font-medium">
                    {displayMessage}
                </p>
            )}
        </div>
    );
};

// Skeleton Loader
export const Skeleton = ({
    width = '100%',
    height = '1rem',
    className = '',
    rounded = 'md',
}) => {
    const roundedClasses = {
        none: '',
        sm: 'rounded',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        full: 'rounded-full',
    };

    return (
        <div
            className={`bg-neutral-100  animate-pulse ${roundedClasses[rounded]} ${className}`}
            style={{ width, height }}
        />
    );
};

// Skeleton Card
export const SkeletonCard = ({ className = '' }) => {
    return (
        <div className={`bg-neutral-50   border border-neutral-400   rounded-2xl p-6 ${className}`}>
            <Skeleton height="200px" className="mb-4" />
            <Skeleton width="60%" height="1.5rem" className="mb-2" />
            <Skeleton width="80%" height="1rem" className="mb-4" />
            <div className="flex gap-4">
                <Skeleton width="30%" height="2rem" />
                <Skeleton width="30%" height="2rem" />
                <Skeleton width="30%" height="2rem" />
            </div>
        </div>
    );
};

// Property Card Skeleton
export const PropertyCardSkeleton = () => {
    return (
        <div className="bg-neutral-50   border border-neutral-400   rounded-2xl overflow-hidden">
            <Skeleton height="16rem" rounded="none" className="mb-0" />
            <div className="p-5">
                <Skeleton width="70%" height="1.5rem" className="mb-3" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="90%" height="1rem" className="mb-4" />
                <Skeleton width="50%" height="1rem" className="mb-4" />
                <div className="flex justify-between pt-4 border-t border-neutral-400">
                    <Skeleton width="30%" height="2rem" />
                    <Skeleton width="30%" height="2rem" />
                    <Skeleton width="30%" height="2rem" />
                </div>
            </div>
        </div>
    );
};