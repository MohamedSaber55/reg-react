import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/* ============================================
   OPTION 1: MODERN CINEMATIC (Matches Hero Option 1)
   ============================================ */
export function AboutOption1({ aboutSection, heroSection, isRTL, t, getLocalizedText }) {
    if (!aboutSection) return null;

    const stats = [
        {
            icon: <FiAward />,
            value: heroSection?.yearsExperience,
            label: t('home.about.yearsExperience', 'Years of Excellence'),
            show: heroSection?.yearsExperience > 0
        },
        {
            icon: <FiUsers />,
            value: heroSection?.happyClients,
            label: t('home.hero.happyClients', 'Happy Clients'),
            show: heroSection?.happyClients > 0
        },
        {
            icon: <FiTrendingUp />,
            value: heroSection?.propertiesSold,
            label: t('home.hero.propertiesSold', 'Properties Sold'),
            show: heroSection?.propertiesSold > 0
        },
    ].filter(stat => stat.show);

    return (
        <section className="h-screen-minus-header flex items-center bg-secondary-900 relative overflow-hidden">
            {/* Diagonal Background Element */}
            <div
                className="absolute top-0 inset-e-0 w-1/2 h-full opacity-5"
                style={{
                    background: `linear-gradient(${isRTL ? '225deg' : '135deg'}, transparent 40%, var(--color-primary-500) 40%)`,
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                    {/* Image with Floating Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`relative`}
                    >
                        {aboutSection.imageUrl && (
                            <div className="relative">
                                {/* Main Image */}
                                <img
                                    src={aboutSection.imageUrl}
                                    alt={getLocalizedText(aboutSection, 'title')}
                                    className="w-full h-64 md:h-80 object-cover"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-secondary-950/90 to-transparent" />

                                {/* Floating Stats */}
                                {stats.length > 0 && (
                                    <div className="absolute -bottom-4 inset-s-4 inset-e-4 grid grid-cols-3 gap-2">
                                        {stats.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="bg-primary-500 p-3 text-center"
                                            >
                                                <div className="text-lg mb-1 text-white">{stat.icon}</div>
                                                <div className="text-xl font-bold text-white mb-1">{stat.value}+</div>
                                                <div className="text-xs text-white/90 uppercase">{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Header Line */}
                        <div className={`flex items-center gap-3 mb-4`}>
                            <div className="h-px w-8 bg-primary-500" />
                            <span className="text-primary-500 text-xs tracking-[0.2em] uppercase font-medium">
                                {getLocalizedText(aboutSection, 'subTitle') || t('home.about.whoWeAre', 'Who We Are')}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-serif">
                            {getLocalizedText(aboutSection, 'title')}
                        </h2>

                        {/* Description */}
                        <p className="text-base text-neutral-300 leading-relaxed mb-6 line-clamp-6">
                            {getLocalizedText(aboutSection, 'description')}
                        </p>

                        {/* CTA Button */}
                        <Link
                            to="/about-us"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all hover:scale-105 group text-sm"
                        >
                            {t('home.cta.learnMore', 'Learn More')}
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST (Matches Hero Option 2)
   ============================================ */
export function AboutOption2({ aboutSection, heroSection, isRTL, t, getLocalizedText }) {
    if (!aboutSection) return null;

    const stats = [
        { value: heroSection?.yearsExperience, label: t('home.about.yearsExperience', 'Years'), show: heroSection?.yearsExperience > 0 },
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Clients'), show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Sold'), show: heroSection?.propertiesSold > 0 },
    ].filter(stat => stat.show);

    return (
        <section className="h-screen-minus-header flex items-center bg-neutral-50 relative">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {aboutSection.imageUrl && (
                            <>
                                {/* Offset Border */}
                                <div className={`absolute -top-4 -inset-s-4 w-full h-full border-4 border-neutral-900`} />

                                {/* Main Image */}
                                <img
                                    src={aboutSection.imageUrl}
                                    alt={getLocalizedText(aboutSection, 'title')}
                                    className="relative w-full h-64 md:h-80 object-cover border-4 border-neutral-900"
                                />

                                {/* Years Badge */}
                                {heroSection?.yearsExperience > 0 && (
                                    <div className={`absolute -bottom-4 inset-s-4 bg-primary-600 border-4 border-neutral-900 p-4`}>
                                        <div className="text-3xl font-black text-white mb-1">
                                            {heroSection.yearsExperience}+
                                        </div>
                                        <div className="text-xs font-bold text-white uppercase">
                                            {t('home.about.years', 'Years')}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-black text-third-900 leading-tight tracking-tighter mb-4 uppercase font-serif">
                            {getLocalizedText(aboutSection, 'title')}
                        </h2>

                        {/* Subtitle */}
                        {(aboutSection.subTitleEn || aboutSection.subTitleAr) && (
                            <p className="text-xl font-bold text-primary-600 mb-4">
                                {getLocalizedText(aboutSection, 'subTitle')}
                            </p>
                        )}

                        {/* Description */}
                        <p className="text-base text-third-500 leading-relaxed mb-6 line-clamp-6">
                            {getLocalizedText(aboutSection, 'description')}
                        </p>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-neutral-50 border-4 border-neutral-900 p-3 text-center relative group">
                                        <div className="text-2xl font-black text-primary-600">
                                            {stat.value}+
                                        </div>
                                        <div className="text-xs font-bold text-third-900 uppercase">
                                            {stat.label}
                                        </div>
                                        <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <Link
                            to="/about-us"
                            className="inline-block relative group"
                        >
                            <div className="relative z-10 px-8 py-4 bg-neutral-900 text-neutral-50 font-bold border-4 border-neutral-900 flex items-center gap-2 text-sm">
                                {t('home.cta.learnMore', 'Learn More')}
                                <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
                            </div>
                            <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC (Matches Hero Option 3)
   ============================================ */
export function AboutOption3({ aboutSection, heroSection, isRTL, t, getLocalizedText }) {
    if (!aboutSection) return null;

    const stats = [
        { value: heroSection?.yearsExperience, label: t('common.years', 'Years'), show: heroSection?.yearsExperience > 0 },
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Clients'), show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Properties'), show: heroSection?.propertiesSold > 0 },
    ].filter(stat => stat.show);

    return (
        <section className="flex items-center bg-linear-to-b from-neutral-50 to-primary-50 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 inset-s-0 w-64 h-64 bg-linear-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 inset-e-0 w-64 h-64 bg-linear-to-tl from-accent-200/30 to-primary-200/30 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`relative`}
                    >
                        {aboutSection.imageUrl && (
                            <div className="relative">
                                {/* Decorative Background */}
                                <div className={`absolute inset-0 bg-linear-to-br from-primary-400/50 to-accent-400/50 rounded-2xl transform ${isRTL ? '-rotate-3' : 'rotate-3'}`} />

                                {/* Main Image */}
                                <img
                                    src={aboutSection.imageUrl}
                                    alt={getLocalizedText(aboutSection, 'title')}
                                    className="relative w-full h-64 md:h-90 object-cover rounded-2xl shadow-xl"
                                />

                                {/* Years Badge */}
                                {heroSection?.yearsExperience > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className={`absolute -bottom-4 inset-s-4 bg-neutral-50 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary-500 z-50`}
                                    >
                                        <div className="text-2xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent mb-1">
                                            {heroSection.yearsExperience}+
                                        </div>
                                        <div className="text-xs text-neutral-700 font-medium">
                                            {t('common.years', 'Years of Excellence')}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Subtitle Badge */}
                        {(aboutSection.subTitleEn || aboutSection.subTitleAr) && (
                            <div className="inline-block px-4 py-2 bg-neutral-50/60 backdrop-blur-sm rounded-full mb-4 border border-primary-300/50">
                                <span className="text-primary-700 font-semibold text-xs">
                                    {getLocalizedText(aboutSection, 'subTitle')}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent">
                            {getLocalizedText(aboutSection, 'title')}
                        </h2>

                        {/* Description */}
                        <p className="text-base text-neutral-700 leading-relaxed mb-6 line-clamp-6">
                            {getLocalizedText(aboutSection, 'description')}
                        </p>

                        {/* Stats */}
                        {stats.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-neutral-50/60 backdrop-blur-sm rounded-xl p-3 border border-primary-300/50 text-center">
                                        <div className="text-2xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent mb-1">
                                            {stat.value}+
                                        </div>
                                        <div className="text-xs text-neutral-700 font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <Link
                            to="/about-us"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 group text-sm"
                        >
                            {t('home.cta.learnMore', 'Learn More')}
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM (Matches Hero Option 4)
   ============================================ */
export function AboutOption4({ aboutSection, heroSection, isRTL, t, getLocalizedText }) {
    if (!aboutSection) return null;

    const stats = [
        {
            icon: <FiAward />,
            value: heroSection?.yearsExperience,
            label: t('home.about.yearsExperience', 'Years'),
            show: heroSection?.yearsExperience > 0
        },
        {
            icon: <FiUsers />,
            value: heroSection?.happyClients,
            label: t('home.hero.happyClients', 'Clients'),
            show: heroSection?.happyClients > 0
        },
        {
            icon: <FiTrendingUp />,
            value: heroSection?.propertiesSold,
            label: t('home.hero.propertiesSold', 'Properties'),
            show: heroSection?.propertiesSold > 0
        },
    ].filter(stat => stat.show);

    return (
        <section className="h-screen-minus-header flex items-center bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 relative overflow-hidden">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 inset-s-1/4 w-64 h-64 bg-linear-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 inset-e-1/4 w-64 h-64 bg-linear-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-[80px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Subtitle Badge */}
                        {(aboutSection.subTitleEn || aboutSection.subTitleAr) && (
                            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4">
                                <span className="text-accent-200 font-semibold text-xs">
                                    {getLocalizedText(aboutSection, 'subTitle')}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {getLocalizedText(aboutSection, 'title')}
                        </h2>

                        {/* Description */}
                        <p className="text-base text-accent-200 leading-relaxed mb-6 line-clamp-6">
                            {getLocalizedText(aboutSection, 'description')}
                        </p>

                        {/* CTA */}
                        <Link
                            to="/about-us"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all hover:scale-105 group text-sm"
                        >
                            {t('home.cta.learnMore', 'Learn More')}
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>

                    {/* Image with Glass Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`relative ${isRTL ? 'lg:col-inset-s-1' : ''}`}
                    >
                        {aboutSection.imageUrl && (
                            <div className="relative">
                                {/* Main Image */}
                                <img
                                    src={aboutSection.imageUrl}
                                    alt={getLocalizedText(aboutSection, 'title')}
                                    className="w-full h-64 md:h-80 object-cover rounded-2xl"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-accent-950/80 to-transparent rounded-2xl" />

                                {/* Glass Stats Cards */}
                                {stats.length > 0 && (
                                    <div className="absolute -bottom-4 inset-s-4 inset-e-4 grid grid-cols-3 gap-2">
                                        {stats.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="bg-white/10 backdrop-blur-xl rounded-lg p-3 border border-white/20 text-center"
                                            >
                                                <div className="text-lg mb-2 text-primary-400">{stat.icon}</div>
                                                <div className="text-xl font-bold text-white mb-1">{stat.value}+</div>
                                                <div className="text-xs text-accent-200 font-medium">{stat.label}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}