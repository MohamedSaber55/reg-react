import React, { useState, useRef, useEffect } from 'react';
import { FiSun, FiMoon, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTheme } from '@/store/slices/themeSlice';

export const ThemeSwitcher = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((state) => state.theme);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const themes = [
        { value: 'light', label: 'Light', icon: FiSun },
        { value: 'dark', label: 'Dark', icon: FiMoon },
    ];

    const currentTheme = themes.find(t => t.value === theme) || themes[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThemeChange = (newTheme) => {
        dispatch(setTheme(newTheme));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-third-900/80   hover:text-third-900   hover:bg-neutral-100/50   rounded-lg transition-all duration-200"
                aria-label={t('common.toggleTheme')}
            >
                <currentTheme.icon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute inset-e-0 overflow-hidden mt-2 w-48 bg-neutral-50   border border-neutral-400   rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                    {themes.map((themeOption) => (
                        <button
                            key={themeOption.value}
                            onClick={() => handleThemeChange(themeOption.value)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${theme === themeOption.value
                                ? 'bg-primary-50   text-primary-600  '
                                : 'text-third-900   hover:bg-neutral-100  '
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <themeOption.icon className="w-4 h-4" />
                                <span>{themeOption.label}</span>
                            </div>
                            {theme === themeOption.value && (
                                <FiCheck className="w-4 h-4" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};