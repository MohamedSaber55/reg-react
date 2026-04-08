import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiTarget,
    FiHeart,
    FiUsers,
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiLinkedin,
    FiYoutube,
    FiMapPin,
    FiKey,
    FiHome,
    FiChevronDown
} from 'react-icons/fi';
import DynamicIcon from '@/components/common/DynamicIconLazy';
import TestimonialsSwiper from '@/components/common/TestimonialsSwiper';

/* ============================================
   OPTION 3: SOFT ORGANIC CURVES
   ============================================
   Full page with flowing curves and soft gradients
*/

export function AboutPageOption3({
    aboutSection,
    serviceSection,
    heroSection,
    faqs,
    activeTestimonials,
    socialLinks,
    isRTL,
    t,
    getLocalizedText
}) {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    const stats = [
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Happy Clients'), icon: FiUsers, gradient: 'from-primary-500 to-primary-600', show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Properties Sold'), icon: FiHome, gradient: 'from-success-500 to-success-600', show: heroSection?.propertiesSold > 0 },
        { value: heroSection?.propertiesRented, label: t('home.hero.propertiesRented', 'Properties Rented'), icon: FiKey, gradient: 'from-accent-500 to-accent-600', show: heroSection?.propertiesRented > 0 },
        { value: heroSection?.citiesCovered, label: t('home.hero.citiesCovered', 'Cities Covered'), icon: FiMapPin, gradient: 'from-warning-500 to-warning-600', show: heroSection?.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                {/* Animated Blob Shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1/2 -inset-s-1/4 w-200 h-200 bg-linear-to-br from-primary-300/30 to-primary-400/30     rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-1/2 -inset-e-1/4 w-500 h-500 bg-linear-to-br from-accent-300/30 to-primary-300/30     rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
                        {aboutSection?.imageUrl && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className={`relative`}
                            >
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-linear-to-br from-primary-400/20 to-accent-400/20     rounded-[3rem] transform ${isRTL ? '-rotate-6' : 'rotate-6'}`} />
                                    <img
                                        src={aboutSection.imageUrl}
                                        alt={title}
                                        className="relative w-full h-125 object-cover rounded-[3rem] shadow-2xl"
                                    />
                                </div>
                            </motion.div>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-6 py-3 bg-neutral-50/60  /60 backdrop-blur-sm rounded-full mb-8 border border-primary-300/50">
                                <span className="text-primary-700   font-semibold text-sm">
                                    ✨ {t('about.ourStory', 'Our Story')}
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent">
                                {title}
                            </h1>

                            {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                                <p className="text-2xl text-neutral-800   mb-8 font-light">
                                    {getLocalizedText(aboutSection, 'subTitle')}
                                </p>
                            )}

                            {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                                <p className="text-lg text-neutral-700   mb-12 leading-relaxed max-w-xl">
                                    {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                                </p>
                            )}

                            {/* Mission/Vision Pills */}
                            {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                        <div className="bg-neutral-50/60  /60 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50">
                                            <FiTarget className="text-3xl text-primary-700  mb-3" />
                                            <div className="text-lg font-bold text-third-900   mb-2">
                                                {t('about.mission.title', 'Mission')}
                                            </div>
                                            <div className="text-sm text-neutral-700   line-clamp-3">
                                                {getLocalizedText(aboutSection, 'mission')}
                                            </div>
                                        </div>
                                    )}

                                    {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                        <div className="bg-neutral-50/60  /60 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50">
                                            <FiHeart className="text-3xl text-accent-700   mb-3" />
                                            <div className="text-lg font-bold text-third-900   mb-2">
                                                {t('about.vision.title', 'Vision')}
                                            </div>
                                            <div className="text-sm text-neutral-700   line-clamp-3">
                                                {getLocalizedText(aboutSection, 'vision')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                <section className="py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-5xl font-bold bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent mb-4 font-serif">
                                    {t('about.story.title', 'Our Story')}
                                </h2>
                                <div className="h-1 w-20 bg-linear-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
                            </motion.div>

                            <div className="space-y-6">
                                {getLocalizedText(aboutSection, 'description')?.split('\n').map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-lg text-neutral-700   leading-relaxed text-center"
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Values Section */}
            {aboutSection?.values && aboutSection.values.length > 0 && (
                <section className="py-24 bg-white/50   backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent mb-4 font-serif">
                                {t('about.values.title', 'Our Core Values')}
                            </h2>
                            <div className="h-1 w-20 bg-linear-to-r from-primary-500 to-accent-500 mx-auto rounded-full mb-4" />
                            <p className="text-xl text-neutral-700   max-w-2xl mx-auto">
                                {t('about.values.subtitle', 'Principles that guide us')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {aboutSection.values
                                .filter(value => value.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((value, index) => (
                                    <motion.div
                                        key={value.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-8 border border-primary-300/50   hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        {value.icon && (
                                            <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-primary-600     rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                                <DynamicIcon icon={value.icon} className="text-3xl text-white" size="2em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                                            {getLocalizedText(value, 'title')}
                                        </h3>
                                        <p className="text-neutral-700   leading-relaxed">
                                            {getLocalizedText(value, 'description')}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            {serviceSection?.serviceItems && serviceSection.serviceItems.length > 0 && (
                <section className="py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent mb-4 font-serif">
                                {getLocalizedText(serviceSection, 'title') || t('about.services.title', 'Our Services')}
                            </h2>
                            <div className="h-1 w-20 bg-linear-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {serviceSection.serviceItems
                                .filter(item => item.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-8 border border-accent-300/50   hover:shadow-2xl hover:scale-105 transition-all"
                                    >
                                        {service.icon && (
                                            <div className="w-16 h-16 bg-linear-to-br from-accent-500 to-accent-600     rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                                <DynamicIcon icon={service.icon} className="text-3xl text-white" size="2em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                                            {getLocalizedText(service, 'title')}
                                        </h3>
                                        <p className="text-neutral-700   leading-relaxed">
                                            {getLocalizedText(service, 'description')}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            {stats.length > 0 && (
                <section className="py-24 bg-white/50   backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className={`w-20 h-20 bg-linear-to-br ${stat.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                                        <stat.icon className="text-3xl text-white" />
                                    </div>
                                    <div className="text-5xl font-bold bg-linear-to-br from-primary-700 to-primary-800     bg-clip-text text-transparent mb-2 font-serif">
                                        {stat.value}+
                                    </div>
                                    <p className="text-neutral-700   font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {activeTestimonials && activeTestimonials.length > 0 && (
                <section className="py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <TestimonialsSwiper
                            testimonials={activeTestimonials}
                            t={t}
                            getLocalizedText={getLocalizedText}
                        />
                    </div>
                </section>
            )}

            {/* FAQs */}
            {faqs && faqs.length > 0 && (
                <section className="py-24 bg-white/50   backdrop-blur-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent mb-4 font-serif">
                                {t('about.faqs.title', 'FAQs')}
                            </h2>
                            <div className="h-1 w-20 bg-linear-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
                        </motion.div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl border border-primary-300/50   overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-start hover:bg-primary-50/50   transition-all"
                                    >
                                        <span className="font-bold text-lg text-third-900   pe-4">
                                            {getLocalizedText(faq, 'question')}
                                        </span>
                                        <FiChevronDown
                                            className={`text-2xl text-primary-600  shrink-0 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className="px-6 pb-6 text-neutral-700   leading-relaxed">
                                            {getLocalizedText(faq, 'answer')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Social Media */}
            {socialLinks && (
                <section className="py-16 bg-linear-to-br from-primary-100 to-accent-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold bg-linear-to-br from-primary-700 to-primary-800     bg-clip-text text-transparent font-serif mb-2">
                                {t('contact.connectWithUs', 'Connect With Us')}
                            </h3>
                            <p className="text-neutral-700">{t('about.followUs', 'Follow us on social media')}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {socialLinks.facebookIsActive && socialLinks.facebookUrl && (
                                <a href={socialLinks.facebookUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-info-600 hover:bg-info-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                    <FiFacebook className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.instagramIsActive && socialLinks.instagramUrl && (
                                <a href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                    <FiInstagram className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.twitterIsActive && socialLinks.twitterUrl && (
                                <a href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-info-400 hover:bg-info-500 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                    <FiTwitter className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.linkedInIsActive && socialLinks.linkedInUrl && (
                                <a href={socialLinks.linkedInUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-info-800 hover:bg-info-900 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                    <FiLinkedin className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.youTubeIsActive && socialLinks.youTubeUrl && (
                                <a href={socialLinks.youTubeUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-error-600 hover:bg-error-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                    <FiYoutube className="text-2xl" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

/* ============================================
   OPTION 4: MODERN GLASS MORPHISM
   ============================================
   Full page with frosted glass and vibrant gradients
*/

export function AboutPageOption4({
    aboutSection,
    serviceSection,
    heroSection,
    faqs,
    activeTestimonials,
    socialLinks,
    isRTL,
    t,
    getLocalizedText
}) {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    const stats = [
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Happy Clients'), icon: FiUsers, gradient: 'from-primary-500 to-primary-600', show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Properties Sold'), icon: FiHome, gradient: 'from-success-500 to-success-600', show: heroSection?.propertiesSold > 0 },
        { value: heroSection?.propertiesRented, label: t('home.hero.propertiesRented', 'Properties Rented'), icon: FiKey, gradient: 'from-accent-500 to-accent-600', show: heroSection?.propertiesRented > 0 },
        { value: heroSection?.citiesCovered, label: t('home.hero.citiesCovered', 'Cities Covered'), icon: FiMapPin, gradient: 'from-warning-500 to-warning-600', show: heroSection?.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900" />

                <div className="absolute inset-0">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-accent-500/30 to-primary-500/30 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-primary-500/30 to-accent-500/30 rounded-full blur-[120px]"
                    />
                </div>

                {aboutSection?.imageUrl && (
                    <div className="absolute inset-0">
                        <img src={aboutSection.imageUrl} alt={title} className="w-full h-full object-cover opacity-10" />
                    </div>
                )}

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                                <span className="text-accent-200 font-semibold text-sm">
                                    ⭐ {t('about.ourStory', 'Our Story')}
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                                {title}
                            </h1>

                            {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                                <p className="text-2xl text-accent-200 mb-6 max-w-3xl mx-auto">
                                    {getLocalizedText(aboutSection, 'subTitle')}
                                </p>
                            )}

                            {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                                <p className="text-lg text-accent-300/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                                    {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                                </p>
                            )}
                        </motion.div>

                        {/* Mission/Vision Glass Cards */}
                        {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FiTarget className="text-white text-2xl" />
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-4">
                                            {t('about.mission.title', 'Our Mission')}
                                        </div>
                                        <div className="text-accent-300 leading-relaxed">
                                            {getLocalizedText(aboutSection, 'mission')}
                                        </div>
                                    </motion.div>
                                )}

                                {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-linear-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <FiHeart className="text-white text-2xl" />
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-4">
                                            {t('about.vision.title', 'Our Vision')}
                                        </div>
                                        <div className="text-accent-300 leading-relaxed">
                                            {getLocalizedText(aboutSection, 'vision')}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                <section className="py-24 bg-linear-to-br from-secondary-950 via-accent-950 to-secondary-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                    {t('about.story.title', 'Our Story')}
                                </h2>
                            </motion.div>

                            <div className="space-y-6 text-accent-300">
                                {getLocalizedText(aboutSection, 'description')?.split('\n').map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-lg leading-relaxed"
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Values Section */}
            {aboutSection?.values && aboutSection.values.length > 0 && (
                <section className="py-24 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                {t('about.values.title', 'Our Core Values')}
                            </h2>
                            <p className="text-xl text-accent-300">
                                {t('about.values.subtitle', 'Principles that guide us')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {aboutSection.values
                                .filter(value => value.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((value, index) => (
                                    <motion.div
                                        key={value.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group"
                                    >
                                        {value.icon && (
                                            <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <DynamicIcon icon={value.icon} className="text-2xl text-white" size="1.5em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                                            {getLocalizedText(value, 'title')}
                                        </h3>
                                        <p className="text-accent-300 leading-relaxed">
                                            {getLocalizedText(value, 'description')}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            {serviceSection?.serviceItems && serviceSection.serviceItems.length > 0 && (
                <section className="py-24 bg-linear-to-br from-secondary-950 via-accent-950 to-secondary-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                {getLocalizedText(serviceSection, 'title') || t('about.services.title', 'Our Services')}
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {serviceSection.serviceItems
                                .filter(item => item.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group"
                                    >
                                        {service.icon && (
                                            <div className="w-14 h-14 bg-linear-to-br from-accent-500 to-warning-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <DynamicIcon icon={service.icon} className="text-2xl text-white" size="1.5em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                                            {getLocalizedText(service, 'title')}
                                        </h3>
                                        <p className="text-accent-300 leading-relaxed">
                                            {getLocalizedText(service, 'description')}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            {stats.length > 0 && (
                <section className="py-24 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group text-center"
                                >
                                    <div className={`w-14 h-14 bg-linear-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="text-white text-2xl" />
                                    </div>
                                    <div className="text-5xl font-bold text-white mb-2">
                                        {stat.value}+
                                    </div>
                                    <div className="text-accent-300 font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQs */}
            {faqs && faqs.length > 0 && (
                <section className="py-24 bg-linear-to-br from-secondary-950 via-accent-950 to-secondary-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                {t('about.faqs.title', 'FAQs')}
                            </h2>
                        </motion.div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-start hover:bg-white/5 transition-all"
                                    >
                                        <span className="font-bold text-lg text-white pe-4">
                                            {getLocalizedText(faq, 'question')}
                                        </span>
                                        <FiChevronDown
                                            className={`text-2xl text-accent-300 shrink-0 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className="px-6 pb-6 text-accent-300 leading-relaxed">
                                            {getLocalizedText(faq, 'answer')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Social Media */}
            {socialLinks && (
                <section className="py-16 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 border-t border-white/10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-white font-serif mb-2">
                                {t('contact.connectWithUs', 'Connect With Us')}
                            </h3>
                            <p className="text-accent-300">{t('about.followUs', 'Follow us on social media')}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            {socialLinks.facebookIsActive && socialLinks.facebookUrl && (
                                <a href={socialLinks.facebookUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110">
                                    <FiFacebook className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.instagramIsActive && socialLinks.instagramUrl && (
                                <a href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110">
                                    <FiInstagram className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.twitterIsActive && socialLinks.twitterUrl && (
                                <a href={socialLinks.twitterUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110">
                                    <FiTwitter className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.linkedInIsActive && socialLinks.linkedInUrl && (
                                <a href={socialLinks.linkedInUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110">
                                    <FiLinkedin className="text-2xl" />
                                </a>
                            )}
                            {socialLinks.youTubeIsActive && socialLinks.youTubeUrl && (
                                <a href={socialLinks.youTubeUrl} target="_blank" rel="noopener noreferrer"
                                    className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110">
                                    <FiYoutube className="text-2xl" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}