import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay, FiMapPin, FiHome, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/* ============================================
   OPTION 1: MODERN CINEMATIC SPLIT
   ============================================ */
export function HeroOption1({ heroSection, isRTL, t, getLocalizedText }) {
    const title = getLocalizedText(heroSection, 'title');
    const titleWords = title ? title.split(' ') : [];
    const stats = [
        { value: heroSection.propertiesSold, label: t('home.hero.propertiesSold', 'Properties Sold'), show: heroSection.propertiesSold > 0 },
        { value: heroSection.propertiesRented, label: t('home.hero.propertiesRented', 'Properties Rented'), show: heroSection.propertiesRented > 0 },
        { value: heroSection.happyClients, label: t('home.hero.happyClients', 'Happy Clients'), show: heroSection.happyClients > 0 },
        { value: heroSection.citiesCovered, label: t('home.hero.citiesCovered', 'Cities Covered'), show: heroSection.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <section className="relative h-screen-minus-header flex items-center overflow-hidden bg-secondary-950">
            {/* Diagonal Background Split */}
            <div className="absolute inset-0">
                {heroSection.imageUrl && (
                    <>
                        <div
                            className="absolute inset-0 w-3/5 origin-left"
                            style={{
                                clipPath: isRTL
                                    ? 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)'
                                    : 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                                [isRTL ? 'right' : 'left']: 0,
                            }}
                        >
                            <img
                                src={heroSection.imageUrl}
                                alt={title}
                                className="w-full h-full object-cover scale-110"
                            />
                            <div className={`absolute inset-0 ${isRTL ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-transparent to-secondary-950/80`} />
                        </div>
                        <div className={`absolute inset-0 inset-s-[60%] bg-secondary-950`} />
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {heroSection.yearsExperience > 0 && (
                                <div className={`mb-4 flex items-center gap-3`}>
                                    <div className="h-px w-8 bg-primary-500" />
                                    <span className="text-primary-500 text-xs tracking-[0.2em] uppercase font-medium">
                                        {heroSection.yearsExperience}+ {t('common.years', 'Years')}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[0.95] tracking-tight font-serif">
                                {titleWords.length > 0 && (
                                    <>
                                        <span className="block">
                                            {titleWords[0]}
                                        </span>
                                        {titleWords.length > 1 && (
                                            <span className="block text-primary-500">
                                                {titleWords.slice(1).join(' ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </h1>

                            {(heroSection.subTitleEn || heroSection.subTitleAr) && (
                                <p className="text-lg text-neutral-300 mb-4 max-w-md font-light">
                                    {getLocalizedText(heroSection, 'subTitle')}
                                </p>
                            )}

                            {(heroSection.descriptionEn || heroSection.descriptionAr) && (
                                <p className="text-base text-neutral-400 mb-6 max-w-md leading-relaxed">
                                    {getLocalizedText(heroSection, 'description')}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                                {heroSection.primaryCtaTitleEn && heroSection.primaryCtaUrl && (
                                    <Link
                                        to={heroSection.primaryCtaUrl}
                                        className="group px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-none font-semibold flex items-center gap-2 transition-all relative overflow-hidden text-sm"
                                    >
                                        <span className="relative z-10">{getLocalizedText(heroSection, 'primaryCtaTitle')}</span>
                                        <FiArrowRight className={`relative z-10 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </Link>
                                )}
                                {heroSection.secondaryCtaTitleEn && heroSection.secondaryCtaUrl && (
                                    <Link
                                        to={heroSection.secondaryCtaUrl}
                                        className="px-6 py-3 border border-white text-white hover:bg-white hover:text-neutral-950 rounded-none font-semibold flex items-center gap-2 transition-all text-sm"
                                    >
                                        <FiPlay />
                                        {getLocalizedText(heroSection, 'secondaryCtaTitle')}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats - Floating Cards */}
                    {stats.length > 0 && (
                        <div className="lg:col-span-5 relative hidden lg:block">
                            {stats.slice(0, 3).map((stat, index) => {
                                const positions = [
                                    'top-0 inset-e-0',
                                    'top-16 inset-e-16',
                                    'bottom-0 inset-e-8'
                                ];
                                const backgrounds = [
                                    'bg-neutral-50 text-third-900',
                                    'bg-primary-500 text-white',
                                    'bg-secondary-800 text-white'
                                ];

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (index * 0.1) }}
                                        className={`absolute ${positions[index]} ${backgrounds[index]} p-6 shadow-2xl w-48`}
                                    >
                                        <div className="text-4xl font-bold mb-1 font-serif">
                                            {stat.value}+
                                        </div>
                                        <div className={`text-xs uppercase tracking-wider ${index === 0 ? 'text-third-500' : 'text-current opacity-80'}`}>
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mobile Stats */}
                {stats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:hidden mt-8 grid grid-cols-2 gap-3"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-secondary-900 border border-secondary-800 p-4 rounded">
                                <div className="text-2xl font-bold text-primary-500 mb-1">
                                    {stat.value}+
                                </div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST
   ============================================ */
export function HeroOption2({ heroSection, isRTL, t, getLocalizedText }) {
    const stats = [
        { value: heroSection.propertiesSold, label: t('home.hero.propertiesSold', 'Sold'), show: heroSection.propertiesSold > 0 },
        { value: heroSection.propertiesRented, label: t('home.hero.propertiesRented', 'Rented'), show: heroSection.propertiesRented > 0 },
        { value: heroSection.happyClients, label: t('home.hero.happyClients', 'Clients'), show: heroSection.happyClients > 0 },
        { value: heroSection.citiesCovered, label: t('home.hero.citiesCovered', 'Cities'), show: heroSection.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <section className="relative h-screen-minus-header flex items-center bg-neutral-50 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {heroSection.yearsExperience > 0 && (
                        <div className="inline-block mb-4 px-6 py-2 bg-neutral-900 text-neutral-50 relative">
                            <span className="relative z-10 text-sm font-bold uppercase tracking-wider">
                                {heroSection.yearsExperience}+ {t('common.years', 'Years')}
                            </span>
                            <div className={`absolute inset-0 border-2 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2`} />
                        </div>
                    )}

                    <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black text-third-900 leading-[0.9] tracking-tighter mb-6 font-serif">
                        {getLocalizedText(heroSection, 'title')}
                    </h1>

                    {heroSection.imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6 relative max-w-2xl"
                        >
                            <div className={`absolute -top-3 -inset-s-3 w-full h-full border-2 border-neutral-900`} />
                            <img
                                src={heroSection.imageUrl}
                                alt={getLocalizedText(heroSection, 'title')}
                                className="w-full h-48 object-cover relative"
                            />
                        </motion.div>
                    )}

                    {((heroSection.subTitleEn || heroSection.subTitleAr) || (heroSection.descriptionEn || heroSection.descriptionAr)) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                {(heroSection.subTitleEn || heroSection.subTitleAr) && (
                                    <p className="text-xl font-bold text-third-900 mb-2">
                                        {getLocalizedText(heroSection, 'subTitle')}
                                    </p>
                                )}
                            </div>
                            <div>
                                {(heroSection.descriptionEn || heroSection.descriptionAr) && (
                                    <p className="text-base text-third-500 leading-relaxed">
                                        {getLocalizedText(heroSection, 'description')}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mb-8">
                        {heroSection.primaryCtaTitleEn && heroSection.primaryCtaUrl && (
                            <Link
                                to={heroSection.primaryCtaUrl}
                                className="inline-block px-8 py-3 bg-neutral-900 text-neutral-50 text-lg font-bold hover:bg-neutral-900/80 transition-colors relative group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {getLocalizedText(heroSection, 'primaryCtaTitle')}
                                    <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
                                </span>
                                <div className={`absolute inset-0 border-2 border-neutral-900 ${isRTL ? 'translate-x-1' : 'translate-x-1'} translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform`} />
                            </Link>
                        )}

                        {heroSection.secondaryCtaTitleEn && heroSection.secondaryCtaUrl && (
                            <Link
                                to={heroSection.secondaryCtaUrl}
                                className="inline-block px-8 py-3 bg-neutral-50 border-2 border-neutral-900 text-third-900 text-lg font-bold hover:bg-neutral-100 transition-colors relative group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <FiPlay />
                                    {getLocalizedText(heroSection, 'secondaryCtaTitle')}
                                </span>
                                <div className={`absolute inset-0 border-2 border-neutral-900 ${isRTL ? 'translate-x-1' : 'translate-x-1'} translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform`} />
                            </Link>
                        )}
                    </div>

                    {stats.length > 0 && (
                        <div className="pt-6 border-t-2 border-neutral-900">
                            <div className={`grid gap-4 ${stats.length === 1 ? 'grid-cols-1 max-w-xs' :
                                stats.length === 2 ? 'grid-cols-2' :
                                    stats.length === 3 ? 'grid-cols-3' :
                                        'grid-cols-4'
                                }`}>
                                {stats.map((stat, index) => (
                                    <div key={index}>
                                        <div className="text-4xl font-black text-primary-600 mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs uppercase tracking-wider text-third-500">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC CURVES
   ============================================ */
export function HeroOption3({ heroSection, isRTL, t, getLocalizedText }) {
    const stats = [
        { value: heroSection.propertiesSold, label: t('home.hero.propertiesSold', 'Sold'), show: heroSection.propertiesSold > 0 },
        { value: heroSection.propertiesRented, label: t('home.hero.propertiesRented', 'Rented'), show: heroSection.propertiesRented > 0 },
        { value: heroSection.happyClients, label: t('home.hero.happyClients', 'Clients'), show: heroSection.happyClients > 0 },
        { value: heroSection.citiesCovered, label: t('home.hero.citiesCovered', 'Cities'), show: heroSection.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <section className="relative min-h-screen-minus-header flex items-center overflow-hidden bg-linear-to-br from-primary-50 via-primary-100 to-primary-200 py-8">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -inset-s-1/4 w-64 h-64 bg-linear-to-br from-primary-300/30 to-primary-400/30 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{ scale: [1.1, 1, 1.1], rotate: [45, 0, 45] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -inset-e-1/4 w-64 h-64 bg-linear-to-br from-accent-300/30 to-primary-300/30 rounded-full blur-2xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    // className={isRTL ? 'lg:col-inset-s-2' : ''}
                    >
                        {heroSection.yearsExperience > 0 && (
                            <div className="inline-block px-4 py-2 bg-neutral-50/60 backdrop-blur-sm rounded-full mb-4 border border-primary-300/50">
                                <span className="text-primary-700 font-semibold text-xs">
                                    ✨ {heroSection.yearsExperience}+ {t('common.years', 'Years')}
                                </span>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent">
                            {getLocalizedText(heroSection, 'title')}
                        </h1>

                        {(heroSection.subTitleEn || heroSection.subTitleAr) && (
                            <p className="text-xl text-neutral-800 mb-4 font-light">
                                {getLocalizedText(heroSection, 'subTitle')}
                            </p>
                        )}

                        {(heroSection.descriptionEn || heroSection.descriptionAr) && (
                            <p className="text-base text-neutral-700 mb-6 leading-relaxed max-w-lg">
                                {getLocalizedText(heroSection, 'description')}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3 mb-6">
                            {heroSection.primaryCtaTitleEn && heroSection.primaryCtaUrl && (
                                <Link
                                    to={heroSection.primaryCtaUrl}
                                    className="group px-6 py-3 w-full md:w-fit justify-center bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 text-sm"
                                >
                                    {getLocalizedText(heroSection, 'primaryCtaTitle')}
                                    <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </Link>
                            )}
                            {heroSection.secondaryCtaTitleEn && heroSection.secondaryCtaUrl && (
                                <Link
                                    to={heroSection.secondaryCtaUrl}
                                    className="px-6 py-3 w-full md:w-fit justify-center bg-neutral-50/60 backdrop-blur-sm hover:bg-neutral-50/80 text-neutral-900 rounded-full font-semibold flex items-center gap-2 border border-primary-300/50 transition-all text-sm"
                                >
                                    <FiPlay />
                                    {getLocalizedText(heroSection, 'secondaryCtaTitle')}
                                </Link>
                            )}
                        </div>

                        {stats.length > 0 && (
                            <div className={`grid gap-3 ${stats.length === 1 ? 'grid-cols-1 max-w-xs' :
                                stats.length === 2 ? 'grid-cols-2' :
                                    stats.length === 3 ? 'grid-cols-3' :
                                        'grid-cols-2 sm:grid-cols-4'
                                }`}>
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-neutral-50/60 backdrop-blur-sm rounded-2xl p-4 border border-primary-300/50">
                                        <div className="text-2xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent mb-1">
                                            {stat.value}+
                                        </div>
                                        <div className="text-xs text-neutral-700">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {heroSection.imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`relative`}
                        >
                            <div className="relative">
                                <div className={`absolute inset-0 bg-linear-to-br from-primary-700/30 to-accent-500/30 rounded-2xl transform ${isRTL ? '-rotate-3' : 'rotate-3'}`} />
                                <img
                                    src={heroSection.imageUrl}
                                    alt={getLocalizedText(heroSection, 'title')}
                                    className="relative w-full  aspect-video object-cover rounded-2xl shadow-xl"
                                />
                            </div>

                            {heroSection.yearsExperience > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className={`absolute h-20 aspect-square -bottom-4 -inset-s-4 bg-neutral-50 rounded-2xl p-4 shadow-lg border border-primary-300/50 hidden lg:flex flex-col justify-center items-center`}
                                >
                                    <div className="text-2xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent mb-1">
                                        {heroSection.yearsExperience}+
                                    </div>
                                    <div className="text-xs text-neutral-700 font-medium">
                                        {t('common.years', 'Years')}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 4: MODERN GLASS MORPHISM
   ============================================ */
export function HeroOption4({ heroSection, isRTL, t, getLocalizedText }) {
    const stats = [
        {
            value: heroSection.propertiesSold,
            label: t('home.hero.propertiesSold', 'Sold'),
            icon: <FiHome className="text-white text-lg" />,
            gradient: 'from-accent-500 to-accent-600',
            show: heroSection.propertiesSold > 0
        },
        {
            value: heroSection.propertiesRented,
            label: t('home.hero.propertiesRented', 'Rented'),
            icon: <FiTrendingUp className="text-white text-lg" />,
            gradient: 'from-primary-500 to-primary-600',
            show: heroSection.propertiesRented > 0
        },
        {
            value: heroSection.happyClients,
            label: t('home.hero.happyClients', 'Clients'),
            icon: <FiCheck className="text-white text-lg" />,
            gradient: 'from-success-500 to-success-600',
            show: heroSection.happyClients > 0
        },
        {
            value: heroSection.citiesCovered,
            label: t('home.hero.citiesCovered', 'Cities'),
            icon: <FiMapPin className="text-white text-lg" />,
            gradient: 'from-warning-500 to-warning-600',
            show: heroSection.citiesCovered > 0
        },
    ].filter(stat => stat.show);

    return (
        <section className="relative h-screen-minus-header flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900" />

            <div className="absolute inset-0">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 inset-s-1/4 w-48 h-48 bg-linear-to-r from-accent-500/30 to-primary-500/30 rounded-full blur-[80px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 inset-e-1/4 w-48 h-48 bg-linear-to-r from-primary-500/30 to-accent-500/30 rounded-full blur-[80px]"
                />
            </div>

            {heroSection.imageUrl && (
                <div className="absolute inset-0">
                    <img
                        src={heroSection.imageUrl}
                        alt={getLocalizedText(heroSection, 'title')}
                        className="w-full h-full object-cover opacity-10"
                    />
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {heroSection.yearsExperience > 0 && (
                            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4">
                                <span className="text-accent-200 font-semibold text-xs">
                                    ⭐ {heroSection.yearsExperience}+ {t('common.years', 'Years')}
                                </span>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {getLocalizedText(heroSection, 'title')}
                        </h1>

                        {(heroSection.subTitleEn || heroSection.subTitleAr) && (
                            <p className="text-xl text-accent-200 mb-4 max-w-2xl mx-auto">
                                {getLocalizedText(heroSection, 'subTitle')}
                            </p>
                        )}

                        {(heroSection.descriptionEn || heroSection.descriptionAr) && (
                            <p className="text-base text-accent-300/80 mb-6 max-w-2xl mx-auto leading-relaxed">
                                {getLocalizedText(heroSection, 'description')}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            {heroSection.primaryCtaTitleEn && heroSection.primaryCtaUrl && (
                                <Link
                                    to={heroSection.primaryCtaUrl}
                                    className="group px-6 py-3 bg-linear-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/30 transition-all hover:scale-105 text-sm"
                                >
                                    {getLocalizedText(heroSection, 'primaryCtaTitle')}
                                    <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </Link>
                            )}
                            {heroSection.secondaryCtaTitleEn && heroSection.secondaryCtaUrl && (
                                <Link
                                    to={heroSection.secondaryCtaUrl}
                                    className="px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-xl font-semibold flex items-center gap-2 border border-white/20 transition-all text-sm"
                                >
                                    <FiPlay />
                                    {getLocalizedText(heroSection, 'secondaryCtaTitle')}
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    {stats.length > 0 && (
                        <div className={`grid gap-3 ${stats.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                            stats.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
                                stats.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
                                    'grid-cols-4 max-w-3xl mx-auto'
                            }`}>
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + (index * 0.1) }}
                                    className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all group"
                                >
                                    <div className={`w-10 h-10 bg-linear-to-br ${stat.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">
                                        {stat.value}+
                                    </div>
                                    <div className="text-accent-300 text-xs font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}