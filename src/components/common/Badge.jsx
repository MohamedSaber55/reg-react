import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Badge Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {boolean} props.rounded
 * @param {boolean} props.outlined
 * @param {React.ReactNode} props.icon
 * @param {React.ReactNode} props.children
 */
export const Badge = ({
    variant = 'primary',
    size = 'md',
    rounded = false,
    outlined = false,
    icon,
    className = '',
    children,
    ...props
}) => {
    const variants = {
        primary: outlined
            ? 'bg-primary-50   text-primary-600  border border-primary-500/30'
            : 'bg-primary-500 text-white',
        secondary: outlined
            ? 'bg-secondary-50  /20 text-neutral-600   border border-secondary-500/30'
            : 'bg-secondary-500 text-white',
        success: outlined
            ? 'bg-success-50   text-success-600   border border-success-500/30'
            : 'bg-success-500 text-white',
        warning: outlined
            ? 'bg-warning-50   text-warning-600   border border-warning-500/30'
            : 'bg-warning-500 text-white',
        error: outlined
            ? 'bg-error-50  text-error-600   border border-error-500/30'
            : 'bg-error-500 text-white',
        info: outlined
            ? 'bg-info-50   text-info-600   border border-info-500/30'
            : 'bg-info-500 text-white',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-semibold ${variants[variant]} ${sizes[size]} ${roundedClass} ${className}`}
            {...props}
        >
            {icon && <span>{icon}</span>}
            {children}
        </span>
    );
};

// Status Badge (for property status, order status, etc.)
export const StatusBadge = ({ status, className = '' }) => {
    const { t } = useTranslation();
    const statusConfig = {
        for_sale: { variant: 'success', label: t('common.status.for_sale') },
        for_rent: { variant: 'info', label: t('common.status.for_rent') },
        sold: { variant: 'secondary', label: t('common.status.sold') },
        rented: { variant: 'primary', label: t('common.status.rented') },
        pending: { variant: 'warning', label: t('common.status.pending') },
        active: { variant: 'success', label: t('common.status.active') },
        inactive: { variant: 'secondary', label: t('common.status.inactive') },
        completed: { variant: 'success', label: t('common.status.completed') },
        cancelled: { variant: 'error', label: t('common.status.cancelled') },
    };

    const config = statusConfig[status] || { variant: 'primary', label: status };

    return (
        <Badge variant={config.variant} rounded outlined className={className}>
            {config.label}
        </Badge>
    );
};

// Notification Badge (dot indicator)
export const NotificationBadge = ({ count, max = 99, className = '' }) => {
    const displayCount = count > max ? `${max}+` : count;

    return (
        <span className={`absolute -top-1 -inset-e-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-error-500 text-white text-xs font-bold rounded-full ${className}`}>
            {displayCount}
        </span>
    );
};