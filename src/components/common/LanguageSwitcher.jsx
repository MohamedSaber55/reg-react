import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setLanguage } from '@/store/slices/languageSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const LanguageSwitcher = ({
    buttonClassName = '',
    dropdownClassName = '',
    showFullName = false,
    showFlag = false,
    variant = 'default'
}) => {
    const { i18n, t } = useTranslation();
    const dispatch = useAppDispatch();
    const { currentLang } = useAppSelector((state) => state.language);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isInitialized = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true;
            if (i18n.language && i18n.language !== currentLang) {
                dispatch(setLanguage(i18n.language));
            }
        }
    }, [i18n.language, currentLang, dispatch]);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        dispatch(setLanguage(langCode));
        i18n.changeLanguage(langCode);
        
        const currentPath = location.pathname;
        const pathWithoutLang = currentPath.replace(/^\/(ar|en)/, '') || '/';
        const newPath = `/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
        navigate(newPath);
        
        setIsOpen(false);
    };

    // Base styles based on variant
    const getBaseButtonStyles = () => {
        switch (variant) {
            case 'modern-cinematic':
                return 'text-neutral-300 hover:text-primary-500 hover:bg-white/5 rounded-lg';
            case 'minimal-brutalist':
                return 'text-third-900 hover:text-primary-600 border-2 border-neutral-900 hover:border-primary-600';
            case 'soft-organic':
                return 'text-neutral-700 hover:text-primary-700 hover:bg-primary-50/50 rounded-full';
            case 'glass-morphism':
                return 'text-accent-200 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm';
            default:
                return 'text-third-900/80 hover:text-third-900 hover:bg-neutral-100/50 rounded-lg';
        }
    };

    const getBaseDropdownStyles = () => {
        switch (variant) {
            case 'modern-cinematic':
                return 'bg-secondary-950 border border-secondary-800';
            case 'minimal-brutalist':
                return 'bg-neutral-50 border-2 border-neutral-900';
            case 'soft-organic':
                return 'bg-white border border-primary-300/50';
            case 'glass-morphism':
                return 'bg-accent-950/95 backdrop-blur-xl border border-white/20';
            default:
                return 'bg-neutral-50 border border-neutral-400';
        }
    };

    const getDropdownItemStyles = (isActive) => {
        switch (variant) {
            case 'modern-cinematic':
                return isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white';
            case 'minimal-brutalist':
                return isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-third-900 hover:bg-neutral-100 hover:text-primary-600';
            case 'soft-organic':
                return isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-primary-50/50 hover:text-primary-700';
            case 'glass-morphism':
                return isActive
                    ? 'bg-white/10 text-white'
                    : 'text-accent-300 hover:bg-white/10 hover:text-white';
            default:
                return isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-third-900 hover:bg-neutral-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 transition-all duration-200 flex items-center gap-2 ${getBaseButtonStyles()} ${buttonClassName}`}
                aria-label={t('common.changeLanguage')}
            >
                <FiGlobe className="w-5 h-5 shrink-0" />
                {showFlag && (
                    <span className="text-base">{currentLanguage.flag}</span>
                )}
                {showFullName ? (
                    <span className="text-sm font-medium hidden sm:inline">
                        {currentLanguage.name}
                    </span>
                ) : (
                    <span className="text-sm font-medium hidden sm:inline">
                        {currentLanguage.code.toUpperCase()}
                    </span>
                )}
                <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute overflow-hidden inset-e-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-50 animate-fade-in ${getBaseDropdownStyles()} ${dropdownClassName}`}>
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${getDropdownItemStyles(i18n.language === language.code)}`}
                        >
                            <div className="flex items-center gap-3">
                                {showFlag && (
                                    <span className="text-xl">{language.flag}</span>
                                )}
                                <span>{language.name}</span>
                            </div>
                            {i18n.language === language.code && (
                                <FiCheck className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Alternative: Simplified component with just className props
export const SimpleLanguageSwitcher = ({
    buttonClassName = '',
    dropdownClassName = '',
    dropdownItemClassName = '',
    activeItemClassName = ''
}) => {
    const { i18n, t } = useTranslation();
    const dispatch = useAppDispatch();
    const { currentLang } = useAppSelector((state) => state.language);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        dispatch(setLanguage(langCode));
        i18n.changeLanguage(langCode);
        
        const currentPath = location.pathname;
        const pathWithoutLang = currentPath.replace(/^\/(ar|en)/, '') || '/';
        const newPath = `/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
        navigate(newPath);
        
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 transition-all duration-200 flex items-center gap-2 ${buttonClassName}`}
                aria-label={t('common.changeLanguage')}
            >
                <FiGlobe className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">
                    {currentLanguage.code.toUpperCase()}
                </span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute overflow-hidden inset-e-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-50 animate-fade-in ${dropdownClassName}`}>
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${dropdownItemClassName} ${i18n.language === language.code ? activeItemClassName : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{language.flag}</span>
                                <span>{language.name}</span>
                            </div>
                            {i18n.language === language.code && (
                                <FiCheck className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};