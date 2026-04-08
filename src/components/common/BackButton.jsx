import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton({ href, label }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const handleClick = () => {
        if (href) {
            navigate(href);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 text-third-500 hover:text-primary-600 transition-colors mb-6"
        >
            <FiArrowLeft className={`text-lg ${isRTL ? 'rotate-180' : ''}`} />
            <span className="font-medium">
                {label || t('common.back', 'Back')}
            </span>
        </button>
    );
}