import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en.json';
import translationAR from '../locales/ar.json';

const getLanguageFromUrl = () => {
    if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const match = path.match(/^\/(ar|en)(\/|$)/);
        if (match) {
            return match[1];
        }
        return localStorage.getItem('language') || 'en';
    }
    return 'en';
};

const getDefaultLanguage = () => {
    return getLanguageFromUrl();
};

const getInitialDir = () => {
    const lng = getDefaultLanguage();
    return lng === 'ar' ? 'rtl' : 'ltr';
};

if (typeof window !== 'undefined') {
    const lang = getLanguageFromUrl();
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
}

const resources = {
    en: {
        translation: translationEN
    },
    ar: {
        translation: translationAR
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getDefaultLanguage(),
        fallbackLng: 'en',

        react: {
            useSuspense: false
        },

        interpolation: {
            escapeValue: false
        },

        detection: {
            order: ['path', 'localStorage'],
            lookupFromPath: 'lang',
            caches: ['localStorage']
        }
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('language', lng);
});

export default i18n;