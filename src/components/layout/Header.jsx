import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiHome, FiHeart, FiPhone, FiGrid, FiLayers, FiSearch, FiUser, FiChevronDown, FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { FaBuilding } from 'react-icons/fa';
import { metaPixelEvents, TrackedLink } from '../tracking';

/* ============================================
   OPTION 1: MODERN CINEMATIC HEADER
   ============================================
   Matches Hero Option 1:
   - Dark background
   - Bronze accent highlights
   - Diagonal elements
   - Sophisticated editorial feel
*/

export function HeaderOption1() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('navigation.home'), icon: FiHome },
        { href: '/properties', label: t('navigation.properties'), icon: FiGrid },
        { href: '/models', label: t('navigation.models'), icon: FiLayers },
        { href: '/about-us', label: t('navigation.about'), icon: FiHeart },
        { href: '/contact-us', label: t('navigation.contact'), icon: FiPhone },
    ];

    return (
        <header
            className={`fixed top-0 inset-s-0 inset-e-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-secondary-950/90 backdrop-blur-xl border-b border-primary-500/20 shadow-lg'
                : 'bg-secondary-950/80 backdrop-blur-md'
                }`}
        >
            {/* Diagonal Top Border */}
            <div
                className="h-1 bg-linear-to-r from-primary-500 to-transparent"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
            />

            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="h-6 w-px bg-primary-500/50 hidden md:block" />
                        <span className="text-white font-serif font-bold text-lg hidden md:block">
                            {t('header.companyName', 'R.E.G')}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="px-4 py-2 text-neutral-300 hover:text-primary-500 font-medium transition-all duration-200 hover:bg-white/5 rounded-lg flex items-center gap-2 group"
                            >
                                <link.icon className="opacity-70 group-hover:opacity-100" size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="p-2 text-neutral-300 hover:text-primary-500 transition-colors">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-neutral-300 hover:text-primary-500 hover:bg-white/5 rounded-lg"
                            dropdownClassName="bg-secondary-950 border border-secondary-800"
                            variant="modern-cinematic"
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button className="p-2 text-neutral-300 hover:text-primary-500 transition-colors">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-neutral-300 hover:text-primary-500 hover:bg-white/5 rounded-lg"
                            dropdownClassName="bg-secondary-950 border border-secondary-800"
                            variant="modern-cinematic"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-neutral-300 hover:text-primary-500 transition-colors p-2"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-2xl" />
                            ) : (
                                <FiMenu className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden p-6 border-t border-secondary-800 bg-secondary-950/95 backdrop-blur-xl my-2 rounded-lg shadow-2xl">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="px-4 py-3 text-neutral-300 hover:text-primary-500 hover:bg-white/5 font-medium transition-all duration-200 rounded-lg flex items-center gap-3 group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <link.icon className="opacity-70 group-hover:opacity-100" />
                                    {link.label}
                                    <FiArrowRight className="ms-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST HEADER
   ============================================
   Matches Hero Option 2:
   - Bold borders and geometric layout
   - High contrast black/white
   - Offset shadow effect
   - Raw, unpolished aesthetic
*/

export function HeaderOption2() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('navigation.home'), icon: FiHome },
        { href: '/properties', label: t('navigation.properties'), icon: FiGrid },
        { href: '/models', label: t('navigation.models'), icon: FiLayers },
        { href: '/about-us', label: t('navigation.about'), icon: FiHeart },
        { href: '/contact-us', label: t('navigation.contact'), icon: FiPhone },
    ];

    return (
        <header
            className={`fixed top-0 inset-s-0 inset-e-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-neutral-50 border-b-4 border-neutral-900 shadow-lg'
                : 'bg-neutral-50'
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="h-6 w-1 bg-neutral-900 hidden md:block" />
                        <span className="text-third-900 font-bold text-lg tracking-tighter hidden md:block">
                            {t('header.companyName', 'R.E.G')}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 relative">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="px-4 py-2 text-third-900 hover:text-primary-600 font-bold transition-all duration-200 hover:bg-neutral-100 border-2 border-transparent hover:border-neutral-900"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="p-2 text-third-900 hover:text-primary-600 transition-colors border-2 border-neutral-900 hover:border-primary-600">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-third-900 hover:text-primary-600 border-2 border-neutral-900 hover:border-primary-600"
                            dropdownClassName="bg-neutral-50 border-2 border-neutral-900"
                            variant="minimal-brutalist"
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button className="p-2 text-third-900 border-2 border-neutral-900">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-third-900 hover:text-primary-600 border-2 border-neutral-900 hover:border-primary-600"
                            dropdownClassName="bg-neutral-50 border-2 border-neutral-900"
                            variant="minimal-brutalist"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-third-900 border-2 border-neutral-900 p-2"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-2xl" />
                            ) : (
                                <FiMenu className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden p-6 border-t-4 border-neutral-900 bg-neutral-50 my-2">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="px-4 py-3 text-third-900 hover:bg-neutral-100 font-bold border-2 border-neutral-900 hover:border-primary-600 transition-all duration-200 flex items-center gap-3 relative group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="w-2 h-2 bg-primary-600" />
                                    {link.label}
                                    <div className="absolute inset-0 border-2 border-neutral-900 translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC HEADER
   ============================================
   Matches Hero Option 3:
   - Rounded corners and soft shadows
   - Glass morphism elements
   - Warm bronze gradients
   - Inviting, friendly aesthetic
*/

export function HeaderOption3() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('navigation.home'), icon: FiHome },
        { href: '/properties', label: t('navigation.properties'), icon: FiGrid },
        { href: '/projects', label: t('navigation.projects'), icon: FaBuilding },
        { href: '/about-us', label: t('navigation.about'), icon: FiHeart },
        { href: '/testimonials', label: t('navigation.testimonials'), icon: FiMessageSquare },
        { href: '/contact-us', label: t('navigation.contact'), icon: FiPhone },
    ];

    // Track mobile menu toggle
    const handleMobileMenuToggle = () => {
        const newState = !mobileMenuOpen;
        setMobileMenuOpen(newState);
        metaPixelEvents.buttonClick(
            newState ? 'Open Mobile Menu' : 'Close Mobile Menu',
            'header'
        );
    };

    return (
        <header
            className={`fixed top-0 inset-s-0 inset-e-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl border-b border-primary-300/50 shadow-lg'
                : 'bg-white/60 backdrop-blur-md'
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo — tracked via TrackedLink with 'logo' event */}
                    <TrackedLink
                        href="/"
                        trackEvent="logo"
                        trackLocation="header"
                        className="flex items-center gap-3 group"
                    >
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="h-4 w-px bg-primary-500/50 hidden lg:block" />
                        <span className="bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent font-serif font-bold text-lg hidden md:block">
                            {t('header.companyName', 'R.E.G')}
                        </span>
                    </TrackedLink>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <TrackedLink
                                key={link.href}
                                href={link.href}
                                trackName={link.label}
                                trackLocation="header"
                                trackEvent="nav"
                                className="px-4 py-2 text-neutral-700 hover:text-primary-700 font-medium transition-all duration-200 hover:bg-primary-50/50 rounded-full flex items-center gap-2 group"
                            >
                                <link.icon className="opacity-70 group-hover:opacity-100" size={16} />
                                {link.label}
                            </TrackedLink>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <LanguageSwitcher
                            buttonClassName="text-neutral-700 hover:text-primary-700 hover:bg-primary-50/50 rounded-full"
                            dropdownClassName="bg-white border border-primary-300/50"
                            variant="soft-organic"
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center gap-3">
                        <LanguageSwitcher
                            buttonClassName="text-neutral-700 hover:text-primary-700 hover:bg-primary-50/50 rounded-full"
                            dropdownClassName="bg-white border border-primary-300/50"
                            variant="soft-organic"
                        />
                        <button
                            onClick={handleMobileMenuToggle}
                            className="text-neutral-700 hover:text-primary-700 transition-colors p-2"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-2xl" />
                            ) : (
                                <FiMenu className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden p-6 border-t border-primary-300/50 bg-white/90 backdrop-blur-xl my-2 rounded-2xl shadow-xl">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <TrackedLink
                                    key={link.href}
                                    href={link.href}
                                    trackName={link.label}
                                    trackLocation="mobile_menu"
                                    trackEvent="nav"
                                    className="px-4 py-3 text-neutral-700 hover:text-primary-700 hover:bg-primary-50/50 font-medium transition-all duration-200 rounded-full flex items-center gap-3 group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <link.icon className="opacity-70 group-hover:opacity-100" />
                                    {link.label}
                                    <FiArrowRight className="ms-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </TrackedLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
/* ============================================
   OPTION 4: GLASS MORPHISM HEADER
   ============================================
   Matches Hero Option 4:
   - Dark navy background with gradient orbs
   - Frosted glass elements
   - Professional depth
   - Modern tech aesthetic
*/

export function HeaderOption4() {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: t('navigation.home'), icon: FiHome },
        { href: '/properties', label: t('navigation.properties'), icon: FiGrid },
        { href: '/projects', label: t('navigation.projects'), icon: FaBuilding },
        { href: '/models', label: t('navigation.models'), icon: FiLayers },
        { href: '/about-us', label: t('navigation.about'), icon: FiHeart },
        { href: '/contact-us', label: t('navigation.contact'), icon: FiPhone },
    ];

    return (
        <header
            className={`fixed top-0 inset-s-0 inset-e-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-accent-950/90 backdrop-blur-xl border-b border-white/20 shadow-2xl'
                : 'bg-accent-950/80 backdrop-blur-lg'
                }`}
        >
            {/* Background Orbs */}
            {scrolled && (
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-10 inset-s-1/4 w-20 h-20 bg-linear-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-xl" />
                    <div className="absolute -top-5 inset-e-1/4 w-16 h-16 bg-linear-to-r from-accent-500/10 to-primary-500/10 rounded-full blur-xl" />
                </div>
            )}

            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="h-4 w-px bg-linear-to-b from-primary-400 to-accent-400 hidden md:block" />
                        <span className="bg-linear-to-r from-white via-primary-100 to-accent-100 bg-clip-text text-transparent font-serif font-bold text-lg hidden md:block">
                            {t('header.companyName', 'R.E.G')}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="px-4 py-2 text-accent-200 hover:text-white font-medium transition-all duration-200 hover:bg-white/10 rounded-xl flex items-center gap-2 group backdrop-blur-sm"
                            >
                                <link.icon className="opacity-70 group-hover:opacity-100" size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="p-2 text-accent-200 hover:text-white transition-colors hover:bg-white/10 rounded-xl backdrop-blur-sm">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-accent-200 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                            dropdownClassName="bg-accent-950/95 backdrop-blur-xl border border-white/20"
                            variant="glass-morphism"
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button className="p-2 text-accent-200 hover:text-white transition-colors">
                            <FiSearch size={20} />
                        </button>
                        <LanguageSwitcher
                            buttonClassName="text-accent-200 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                            dropdownClassName="bg-accent-950/95 backdrop-blur-xl border border-white/20"
                            variant="glass-morphism"
                        />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-accent-200 hover:text-white transition-colors p-2"
                        >
                            {mobileMenuOpen ? (
                                <FiX className="text-2xl" />
                            ) : (
                                <FiMenu className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden p-6 border-t border-white/20 bg-accent-950/95 backdrop-blur-xl my-2 rounded-2xl shadow-2xl">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="px-4 py-3 text-accent-200 hover:text-white hover:bg-white/10 font-medium transition-all duration-200 rounded-xl flex items-center gap-3 group backdrop-blur-sm"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <link.icon className="opacity-70 group-hover:opacity-100" />
                                    {link.label}
                                    <FiArrowRight className="ms-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

// Main Header component with option selector
export const Header = ({ option = 3 }) => {
    // Return selected header option
    switch (option) {
        case 1:
            return <HeaderOption1 />;
        case 2:
            return <HeaderOption2 />;
        case 3:
            return <HeaderOption3 />;
        case 4:
            return <HeaderOption4 />;
        default:
            return <HeaderOption1 />;
    }
};