import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

/**
 * Alert Component
 * @param {Object} props
 * @param {'success' | 'error' | 'warning' | 'info'} props.variant
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 * @param {boolean} props.dismissible
 * @param {Function} props.onDismiss
 */
export const Alert = ({
    variant = 'info',
    title,
    children,
    dismissible = false,
    onDismiss,
    className = '',
}) => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';
    const [visible, setVisible] = useState(true);

    const handleDismiss = () => {
        setVisible(false);
        if (onDismiss) onDismiss();
    };

    if (!visible) return null;

    const icons = {
        success: FiCheckCircle,
        error: FiAlertCircle,
        warning: FiAlertTriangle,
        info: FiInfo,
    };

    const variants = {
        success: 'bg-success-50   border-success-500/30 text-success-800  ',
        error: 'bg-error-50  border-error-500/30 text-error-800  ',
        warning: 'bg-warning-50   border-warning-500/30 text-warning-800  ',
        info: 'bg-info-50   border-info-500/30 text-info-800  ',
    };

    const iconColors = {
        success: 'text-success-500',
        error: 'text-error-500',
        warning: 'text-warning-500',
        info: 'text-info-500',
    };

    const Icon = icons[variant];

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${variants[variant]} ${className}`}
            role="alert"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColors[variant]}`} />

            <div className="flex-1">
                {title && (
                    <h4 className="font-semibold mb-1">{title}</h4>
                )}
                <div className="text-sm">{children}</div>
            </div>

            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 hover:bg-black/5   rounded transition-colors"
                    aria-label={t('common.alert.dismiss')}
                >
                    <FiX className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Toast Component (for notifications)
export const Toast = ({
    message,
    variant = 'info',
    duration = 3000,
    onClose,
    className = '',
}) => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';
    const [visible, setVisible] = useState(true);

    React.useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible) return null;

    const variants = {
        success: 'bg-success-500 text-white',
        error: 'bg-error-500 text-white',
        warning: 'bg-warning-500 text-white',
        info: 'bg-info-500 text-white',
    };

    const icons = {
        success: FiCheckCircle,
        error: FiAlertCircle,
        warning: FiAlertTriangle,
        info: FiInfo,
    };

    const Icon = icons[variant];

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-fade-in ${variants[variant]} ${className}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button
                onClick={() => {
                    setVisible(false);
                    if (onClose) onClose();
                }}
                className="shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                aria-label={t('common.alert.close')}
            >
                <FiX className="w-4 h-4" />
            </button>
        </div>
    );
};

// Toast Container (for managing multiple toasts)
export const ToastContainer = ({ children, position = 'top-right', className = '' }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    // Adjust positions for RTL
    const getAdjustedPosition = (position) => {
        if (!isRTL) return position;

        const rtlMappings = {
            'top-right': 'top-left',
            'top-left': 'top-right',
            'bottom-right': 'bottom-left',
            'bottom-left': 'bottom-right',
        };

        // For center positions, keep as is
        if (position.includes('center')) return position;

        return rtlMappings[position] || position;
    };

    const positions = {
        'top-right': 'top-4 inset-e-4',
        'top-left': 'top-4 inset-s-4',
        'top-center': 'top-4 inset-s-1/2 -translate-x-1/2',
        'bottom-right': 'bottom-4 inset-e-4',
        'bottom-left': 'bottom-4 inset-s-4',
        'bottom-center': 'bottom-4 inset-s-1/2 -translate-x-1/2',
    };

    const adjustedPosition = getAdjustedPosition(position);

    return (
        <div
            className={`fixed z-50 flex flex-col gap-2 ${positions[adjustedPosition]} ${className}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {children}
        </div>
    );
};