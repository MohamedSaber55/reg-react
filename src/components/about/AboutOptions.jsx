import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiTarget,
    FiHeart,
    FiUsers,
    FiAward,
    FiCheckCircle,
    FiActivity,
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
   OPTION 1: MODERN CINEMATIC SPLIT
   ============================================
   Full page design with editorial magazine aesthetic
*/

export function AboutPageOption1({
    aboutSection,
    serviceSection,
    heroSection,
    faqs,
    activeTestimonials,
    isRTL,
    t,
    getLocalizedText
}) {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');
    const titleWords = title.split(' ');

    const stats = [
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Happy Clients'), icon: FiUsers, show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Properties Sold'), icon: FiHome, show: heroSection?.propertiesSold > 0 },
        { value: heroSection?.propertiesRented, label: t('home.hero.propertiesRented', 'Properties Rented'), icon: FiKey, show: heroSection?.propertiesRented > 0 },
        { value: heroSection?.citiesCovered, label: t('home.hero.citiesCovered', 'Cities Covered'), icon: FiMapPin, show: heroSection?.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <div className="min-h-screen bg-secondary-950">
            {/* Hero Section - Cinematic Split */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0" dir={isRTL ? 'rtl' : 'ltr'}>
                    {aboutSection?.imageUrl && (
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
                                <img src={aboutSection.imageUrl} alt={title} className="w-full h-full object-cover scale-110" />
                                <div className={`absolute inset-0 ${isRTL ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-transparent to-secondary-950/80`} />
                            </div>
                            <div className={`absolute inset-0  inset-s-[60%] bg-secondary-950`} />
                        </>
                    )}
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.9 }}
                            >
                                <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="h-px w-12 bg-primary-500" />
                                    <span className="text-primary-500 text-sm tracking-[0.2em] uppercase font-medium">
                                        {t('about.ourStory', 'Our Story')}
                                    </span>
                                </div>

                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95] tracking-tight font-serif">
                                    {titleWords.length > 0 && (
                                        <>
                                            <span className="block">{titleWords[0]}</span>
                                            {titleWords.length > 1 && (
                                                <span className="block text-primary-500">{titleWords.slice(1).join(' ')}</span>
                                            )}
                                        </>
                                    )}
                                </h1>

                                {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                                    <p className="text-xl text-neutral-300 mb-6 max-w-lg font-light leading-relaxed">
                                        {getLocalizedText(aboutSection, 'subTitle')}
                                    </p>
                                )}
                            </motion.div>
                        </div>

                        {/* Floating Mission/Vision Cards */}
                        <div className="lg:col-span-5 relative h-100 hidden lg:block">
                            {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className={`absolute top-0 inset-e-0 bg-primary-500 text-white p-8 shadow-2xl w-64`}
                                >
                                    <FiTarget className="text-3xl mb-4" />
                                    <div className="text-xl font-bold mb-3 font-serif">
                                        {t('about.mission.title', 'Our Mission')}
                                    </div>
                                    <div className="text-sm opacity-90 line-clamp-4">
                                        {getLocalizedText(aboutSection, 'mission')}
                                    </div>
                                </motion.div>
                            )}

                            {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className={`absolute bottom-0 inset-e-10 bg-white text-neutral-950 p-8 shadow-2xl w-64`}
                                >
                                    <FiHeart className="text-3xl text-accent-600 mb-4" />
                                    <div className="text-xl font-bold mb-3 font-serif">
                                        {t('about.vision.title', 'Our Vision')}
                                    </div>
                                    <div className="text-sm text-neutral-700 line-clamp-4">
                                        {getLocalizedText(aboutSection, 'vision')}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="bg-white   py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-third-900   mb-6 font-serif">
                                {t('about.story.title', 'Our Story')}
                            </h2>
                            <div className="h-1 w-20 bg-primary-500 mx-auto" />
                        </motion.div>

                        {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                            <div className="prose prose-lg max-w-none text-third-500">
                                {getLocalizedText(aboutSection, 'description')?.split('\n').map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="mb-6 text-lg leading-relaxed"
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            {aboutSection?.values && aboutSection.values.length > 0 && (
                <section className="bg-secondary-950 py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-white mb-6 font-serif">
                                {t('about.values.title', 'Our Core Values')}
                            </h2>
                            <div className="h-1 w-20 bg-primary-500 mx-auto mb-4" />
                            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                                {t('about.values.subtitle', 'Principles that guide our every decision')}
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
                                        className="bg-secondary-900 p-8 group hover:bg-secondary-800 transition-all"
                                    >
                                        {value.icon && (
                                            <div className="w-16 h-16 bg-primary-500 flex items-center justify-center mb-6">
                                                <DynamicIcon icon={value.icon} className="text-3xl text-white" size="2em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-white mb-4 font-serif">
                                            {getLocalizedText(value, 'title')}
                                        </h3>
                                        <p className="text-neutral-300 leading-relaxed">
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
                <section className="bg-white   py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-third-900   mb-6 font-serif">
                                {getLocalizedText(serviceSection, 'title') || t('about.services.title', 'Our Services')}
                            </h2>
                            <div className="h-1 w-20 bg-primary-500 mx-auto" />
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
                                        className="bg-neutral-50   p-8 border-t-4 border-primary-500 hover:shadow-2xl transition-all"
                                    >
                                        {service.icon && (
                                            <div className="w-16 h-16 bg-primary-100   flex items-center justify-center mb-6">
                                                <DynamicIcon icon={service.icon} className="text-3xl text-primary-600" size="2em" />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-third-900   mb-4 font-serif">
                                            {getLocalizedText(service, 'title')}
                                        </h3>
                                        <p className="text-third-500   leading-relaxed">
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
                <section className="bg-primary-600   py-20">
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
                                    <stat.icon className="text-5xl text-white mx-auto mb-4" />
                                    <div className="text-5xl font-bold text-white mb-2 font-serif">{stat.value}+</div>
                                    <p className="text-primary-100 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            {activeTestimonials && activeTestimonials.length > 0 && (
                <section className="bg-secondary-950 py-24">
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
                <section className="bg-white   py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-5xl font-bold text-third-900   mb-6 font-serif">
                                {t('about.faqs.title', 'Frequently Asked Questions')}
                            </h2>
                            <div className="h-1 w-20 bg-primary-500 mx-auto" />
                        </motion.div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-s-4 border-primary-500 bg-neutral-50   overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-start hover:bg-primary-50   transition-all"
                                    >
                                        <span className="font-bold text-lg text-third-900 pe-4">
                                            {getLocalizedText(faq, 'question')}
                                        </span>
                                        <FiChevronDown
                                            className={`text-2xl text-primary-600  shrink-0 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className="px-6 pb-6 text-third-500   leading-relaxed">
                                            {getLocalizedText(faq, 'answer')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST
   ============================================
   Full page with stark, bold brutalist design
*/

export function AboutPageOption2({
    aboutSection,
    serviceSection,
    heroSection,
    faqs,
    isRTL,
    t,
    getLocalizedText
}) {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    const stats = [
        { value: heroSection?.happyClients, label: t('home.hero.happyClients', 'Clients'), show: heroSection?.happyClients > 0 },
        { value: heroSection?.propertiesSold, label: t('home.hero.propertiesSold', 'Sold'), show: heroSection?.propertiesSold > 0 },
        { value: heroSection?.propertiesRented, label: t('home.hero.propertiesRented', 'Rented'), show: heroSection?.propertiesRented > 0 },
        { value: heroSection?.citiesCovered, label: t('home.hero.citiesCovered', 'Cities'), show: heroSection?.citiesCovered > 0 },
    ].filter(stat => stat.show);

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Grid Background */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-neutral-900) 1px, transparent 1px), linear-gradient(90deg, var(--color-neutral-900) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        className="max-w-6xl"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <div className="inline-block mb-8 px-8 py-4 bg-neutral-900 text-neutral-50  relative">
                            <span className="relative z-10 text-lg font-bold uppercase tracking-wider">
                                {t('about.ourStory', 'Our Story')}
                            </span>
                            <div className={`absolute inset-0 border-4 border-neutral-900 translate-x-2 translate-y-2`} />
                        </div>

                        <h1 className="text-[clamp(3rem,12vw,10rem)] font-black text-third-900   leading-[0.85] tracking-tighter mb-12 font-serif">
                            {title}
                        </h1>

                        {aboutSection?.imageUrl && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mb-16 relative"
                            >
                                <div className={`absolute -top-6 -inset-s-6 w-full h-full border-4 border-neutral-900`} />
                                <img src={aboutSection.imageUrl} alt={title} className="w-full max-w-2xl h-96 object-cover relative" />
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                                    <p className="text-2xl font-bold text-third-900   mb-4">
                                        {getLocalizedText(aboutSection, 'subTitle')}
                                    </p>
                                )}
                            </div>
                            <div>
                                {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                                    <p className="text-lg text-third-500   leading-relaxed">
                                        {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission/Vision Section */}
            {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                <section className="relative py-24 border-t-4 border-neutral-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-12 bg-neutral-900   text-neutral-50  relative"
                                >
                                    <div className="absolute top-8 inset-e-8 text-6xl font-black opacity-10">01</div>
                                    <h2 className="text-4xl font-black uppercase mb-6">
                                        {t('about.mission.title', 'Mission')}
                                    </h2>
                                    <p className="text-lg leading-relaxed">
                                        {getLocalizedText(aboutSection, 'mission')}
                                    </p>
                                </motion.div>
                            )}

                            {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-12 border-4 border-neutral-900   relative"
                                >
                                    <div className="absolute top-8 inset-e-8 text-6xl font-black opacity-10 text-third-900">02</div>
                                    <h2 className="text-4xl font-black uppercase mb-6 text-third-900">
                                        {t('about.vision.title', 'Vision')}
                                    </h2>
                                    <p className="text-lg text-third-500   leading-relaxed">
                                        {getLocalizedText(aboutSection, 'vision')}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Values Section */}
            {aboutSection?.values && aboutSection.values.length > 0 && (
                <section className="py-24 bg-neutral-900   text-neutral-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-6xl font-black uppercase mb-16 tracking-tighter"
                        >
                            {t('about.values.title', 'Core Values')}
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
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
                                        className="p-8 border-e-4 border-bg   last:border-e-0 hover:bg-neutral-50 hover:text-third-900     transition-all group"
                                    >
                                        <div className="text-5xl font-black mb-4 opacity-20">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>
                                        <h3 className="text-2xl font-black uppercase mb-4">
                                            {getLocalizedText(value, 'title')}
                                        </h3>
                                        <p className="leading-relaxed opacity-90">
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
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-6xl font-black uppercase mb-16 tracking-tighter text-third-900"
                        >
                            {getLocalizedText(serviceSection, 'title') || t('about.services.title', 'Services')}
                        </motion.h2>

                        <div className="space-y-0">
                            {serviceSection.serviceItems
                                .filter(item => item.isActive)
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, x: -40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-t-4 border-neutral-900   p-8 hover:bg-neutral-900 hover:text-neutral-50     transition-all group"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="text-5xl font-black opacity-20 min-w-15">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-black uppercase mb-4 text-third-900   group-hover:text-neutral-50">
                                                    {getLocalizedText(service, 'title')}
                                                </h3>
                                                <p className="text-lg text-third-500   group-hover:text-neutral-50/80 leading-relaxed">
                                                    {getLocalizedText(service, 'description')}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats Section */}
            {stats.length > 0 && (
                <section className="py-24 border-t-4 border-neutral-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 border-e-4 border-neutral-900   last:border-e-0 text-center"
                                >
                                    <div className="text-6xl font-black text-third-900   mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm uppercase tracking-wider text-third-500   font-bold">
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
                <section className="py-24 bg-neutral-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl font-black uppercase mb-16 text-neutral-50"
                        >
                            {t('about.faqs.title', 'FAQs')}
                        </motion.h2>

                        <div className="space-y-0">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-t-4 border-bg   overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                        className="w-full p-6 text-start hover:bg-neutral-50 hover:text-third-900     transition-all flex items-center justify-between"
                                    >
                                        <span className="font-black text-lg text-neutral-50">
                                            {getLocalizedText(faq, 'question')}
                                        </span>
                                        <div className={`text-2xl transform transition-transform ${expandedFaq === faq.id ? 'rotate-45' : ''}`}>
                                            +
                                        </div>
                                    </button>
                                    {expandedFaq === faq.id && (
                                        <div className="px-6 pb-6 text-neutral-50/80   leading-relaxed">
                                            {getLocalizedText(faq, 'answer')}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}