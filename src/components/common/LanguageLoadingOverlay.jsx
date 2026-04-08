import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageLoader } from './Spinner';

const LanguageLoadingContext = createContext();

export const LanguageLoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { i18n } = useTranslation();

    useEffect(() => {
        const handleLanguageChange = () => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    return (
        <LanguageLoadingContext.Provider value={{ isLoading }}>
            {children}
            {isLoading && (
                <div className="fixed inset-0 z-[9999]">
                    <PageLoader message="" />
                </div>
            )}
        </LanguageLoadingContext.Provider>
    );
};

export const useLanguageLoading = () => useContext(LanguageLoadingContext);