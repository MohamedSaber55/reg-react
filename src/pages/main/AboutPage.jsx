import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import Loading from '@/components/layout/Loading';
import { motion } from 'framer-motion';
import {
    FiTarget,
    FiHeart,
    FiUsers,
    FiMapPin,
    FiKey,
    FiHome
} from 'react-icons/fi';
import { fetchAboutSections } from '@/store/slices/aboutSectionSlice';
import { fetchServiceSections } from '@/store/slices/serviceSectionSlice';
import { fetchFAQs } from '@/store/slices/faqSlice';
import { fetchActiveTestimonials } from '@/store/slices/testimonialSlice';
import DynamicIcon from '@/components/common/DynamicIconLazy';
// import TestimonialsSwiper from '@/components/common/TestimonialsSwiper';
import { fetchHeroSections } from '@/store/slices/heroSectionSlice';
import { TestimonialsSection } from '@/components/common/TestimonialsSwiper';
import { useComprehensivePageTracking } from '@/hooks/useMetaPixelPageView';
import metaPixelEvents from '@/utils/metaPixelTracking';

export default function AboutPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const [expandedFaq, setExpandedFaq] = useState(null);

    // Redux state
    const { heroSections, loading: heroLoading } = useAppSelector((state) => state.heroSection);
    const { aboutSections, loading: aboutLoading } = useAppSelector((state) => state.aboutSection);
    const { serviceSections, loading: servicesLoading } = useAppSelector((state) => state.serviceSection);
    const { faqs, loading: faqsLoading } = useAppSelector((state) => state.faq);
    const { activeTestimonials, loading: testimonialsLoading } = useAppSelector((state) => state.testimonial);

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchHeroSections({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchAboutSections({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchServiceSections({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchFAQs());
        dispatch(fetchActiveTestimonials({ pageSize: 10, pageNumber: 1 }));
    }, [dispatch]);

    // Get first about section
    const aboutSection = aboutSections?.[0];
    const serviceSection = serviceSections?.[0];
    const heroSection = heroSections?.find(h => h.isActive) || heroSections?.[0];

    useComprehensivePageTracking('About Us', {
        language: currentLang,
        rtl: isRTL,
        section: 'about'
    });

    const handleFaqToggle = (faqId) => {
        setExpandedFaq(expandedFaq === faqId ? null : faqId);
        if (expandedFaq !== faqId) {
            metaPixelEvents.trackCustomEvent('FAQExpand', {
                faq_id: faqId,
                page_name: 'About Us'
            });
        }
        console.log('====================================');
        console.log(expandedFaq === faqId ? null : faqId);
        console.log('====================================');
    };

    // Helper to get localized text
    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    const loading = aboutLoading || servicesLoading || faqsLoading || testimonialsLoading || heroLoading;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className=" layer flex items-center justify-center  w-full aspect-21/5 bg-linear-to-r from-primary-600/60 to-primary-800/60     py-20">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-bold text-white mb-4 font-serif">
                                {getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us')}
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                {getLocalizedText(aboutSection, 'subTitle') || t('about.subtitle', 'Discover Our Story, Values, and Mission')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Our Story Section */}
                {aboutSection && (
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-third-900   mb-6 font-serif">
                                    {t('about.story.title', 'Our Story')}
                                </h2>
                                <div className="text-lg text-third-500   leading-relaxed space-y-4">
                                    {getLocalizedText(aboutSection, 'description')?.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                            {aboutSection.imageUrl && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <img
                                        src={aboutSection.imageUrl}
                                        alt={getLocalizedText(aboutSection, 'title')}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}

                {/* Mission & Vision - Cards similar to Contact Info Cards */}
                {aboutSection && (aboutSection.missionAr || aboutSection.missionEn || aboutSection.visionAr || aboutSection.visionEn) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {(aboutSection.missionAr || aboutSection.missionEn) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-neutral-50   rounded-2xl p-8 border border-neutral-200"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary-100   rounded-xl flex items-center justify-center">
                                        <FiTarget className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-third-900   font-serif">
                                        {t('about.mission.title', 'Our Mission')}
                                    </h3>
                                </div>
                                <p className="text-third-500   leading-relaxed">
                                    {getLocalizedText(aboutSection, 'mission')}
                                </p>
                            </motion.div>
                        )}

                        {(aboutSection.visionAr || aboutSection.visionEn) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-neutral-50   rounded-2xl p-8 border border-neutral-200"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-accent-100   rounded-xl flex items-center justify-center">
                                        <FiHeart className="text-2xl text-accent-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-third-900   font-serif">
                                        {t('about.vision.title', 'Our Vision')}
                                    </h3>
                                </div>
                                <p className="text-third-500   leading-relaxed">
                                    {getLocalizedText(aboutSection, 'vision')}
                                </p>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Core Values - Similar to Contact Info Cards */}
                {aboutSection?.values && aboutSection.values.length > 0 && (
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-third-900   mb-4 font-serif">
                                {t('about.values.title', 'Our Core Values')}
                            </h2>
                            <p className="text-third-500">
                                {t('about.values.subtitle', 'Principles that guide our every decision and action')}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {aboutSection.values
                                .filter(value => value.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((value, index) => (
                                    <motion.div
                                        key={value.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-neutral-50   rounded-2xl p-6 border border-neutral-200   hover:border-primary-500   transition-all"
                                    >
                                        {value.icon && (
                                            <div className="w-14 h-14 bg-primary-100   rounded-xl flex items-center justify-center mb-4">
                                                <DynamicIcon
                                                    icon={value.icon}
                                                    className="text-2xl text-primary-600"
                                                    size="1.5em"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-third-900   mb-3 font-serif">
                                            {getLocalizedText(value, 'title')}
                                        </h3>
                                        <p className="text-third-500   leading-relaxed">
                                            {getLocalizedText(value, 'description')}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Services Section */}
                {serviceSection?.serviceItems && serviceSection.serviceItems.length > 0 && (
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold text-third-900   mb-4 font-serif">
                                {getLocalizedText(serviceSection, 'title') || t('about.services.title', 'Our Services')}
                            </h2>
                            {serviceSection.subTitleEn || serviceSection.subTitleAr ? (
                                <p className="text-third-500   max-w-2xl mx-auto">
                                    {getLocalizedText(serviceSection, 'subTitle')}
                                </p>
                            ) : null}
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serviceSection.serviceItems
                                .filter(item => item.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-neutral-50   rounded-2xl p-6 border border-neutral-200   hover:border-accent-500   transition-all"
                                    >
                                        {service.icon && (
                                            <div className="w-14 h-14 bg-accent-100   rounded-xl flex items-center justify-center mb-4">
                                                <DynamicIcon
                                                    icon={service.icon}
                                                    className="text-2xl text-accent-600"
                                                    size="1.5em"
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-bold text-third-900   mb-3 font-serif">
                                            {getLocalizedText(service, 'title')}
                                        </h3>
                                        <p className="text-third-500   mb-4 leading-relaxed">
                                            {getLocalizedText(service, 'description')}
                                        </p>
                                        {(service.extraTextEn || service.extraTextAr) && (
                                            <div className="mt-4 pt-4 border-t border-neutral-200">
                                                <p className="text-primary-600  font-medium">
                                                    {getLocalizedText(service, 'extraText')}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Testimonials Swiper - New Modern Component */}
                <TestimonialsSection
                    option={3} // This matches your existing design
                    testimonials={activeTestimonials}
                    isRTL={isRTL}
                    t={t}
                    getLocalizedText={getLocalizedText}
                    sectionTitle="What Our Clients Say"
                />

                {/* Stats Section */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-neutral-50   rounded-2xl p-6 text-center border border-neutral-200"
                        >
                            <div className="w-12 h-12 bg-primary-100   rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiUsers className="text-2xl text-primary-600" />
                            </div>
                            <div className="text-3xl font-bold text-third-900   mb-2">{heroSection?.happyClients}+</div>
                            <p className="text-third-500">{t('home.hero.happyClients', 'Happy Clients')}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-neutral-50   rounded-2xl p-6 text-center border border-neutral-200"
                        >
                            <div className="w-12 h-12 bg-success-100   rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiHome className="text-2xl text-success-600" />
                            </div>
                            <div className="text-3xl font-bold text-third-900   mb-2">{heroSection?.propertiesSold}+</div>
                            <p className="text-third-500">{t('home.hero.propertiesSold', 'Properties Sold')}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-neutral-50   rounded-2xl p-6 text-center border border-neutral-200"
                        >
                            <div className="w-12 h-12 bg-accent-100   rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiKey className="text-2xl text-accent-600" />
                            </div>
                            <div className="text-3xl font-bold text-third-900   mb-2">{heroSection?.propertiesRented}+</div>
                            <p className="text-third-500">{t('home.hero.propertiesRented', 'Properties Rented')}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-neutral-50   rounded-2xl p-6 text-center border border-neutral-200"
                        >
                            <div className="w-12 h-12 bg-warning-100   rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiMapPin className="text-2xl text-warning-600" />
                            </div>
                            <div className="text-3xl font-bold text-third-900   mb-2">{heroSection?.citiesCovered}+</div>
                            <p className="text-third-500">{t('home.hero.citiesCovered', 'Cities Covered')}</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* FAQs - Same styling as Contact Page */}
                {faqs && faqs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-50   rounded-2xl p-8 border border-neutral-200"
                    >
                        <h3 className="text-2xl font-bold text-third-900   mb-6 font-serif">
                            {t('about.faqs.title', 'Frequently Asked Questions')}
                        </h3>
                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="border border-neutral-200   rounded-xl overflow-hidden"
                                >
                                    <button
                                        onClick={() => handleFaqToggle(faq.id)}
                                        className="w-full flex items-center justify-between p-4 bg-neutral-50  hover:bg-primary-50   transition-all text-start"
                                    >
                                        <span className="font-semibold text-third-900">
                                            {getLocalizedText(faq, 'question')}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg
                                                className="w-5 h-5 text-primary-600"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </motion.div>
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 bg-neutral-50   border-t border-neutral-200">
                                                <p className="text-third-500   leading-relaxed">
                                                    {getLocalizedText(faq, 'answer')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}