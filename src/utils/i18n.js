import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en.json';
import translationAR from '../locales/ar.json';

// Get the initial language from localStorage or default to 'en'
// Note: This will be managed by useLocalStorage in I18nProvider
const getDefaultLanguage = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('language') || 'en';
    }
    return 'en';
};

const getInitialDir = () => {
    const lng = getDefaultLanguage();
    return lng === 'ar' ? 'rtl' : 'ltr';
};

if (typeof window !== 'undefined') {
    document.documentElement.dir = getInitialDir();
    document.documentElement.lang = getDefaultLanguage();
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
        }
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;