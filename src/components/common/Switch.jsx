import React from 'react';
import { useTranslation } from 'react-i18next';

export const Switch = ({
    checked,
    onCheckedChange,
    disabled = false,
    className = '',
}) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    // Handle RTL transformation
    const getTranslateClass = () => {
        if (isRTL) {
            return checked ? '-translate-x-6' : '-translate-x-1';
        }
        return checked ? 'translate-x-6' : 'translate-x-1';
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onCheckedChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${checked ? 'bg-primary-600' : 'bg-neutral-300  '}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${getTranslateClass()}
                `}
            />
        </button>
    );
};