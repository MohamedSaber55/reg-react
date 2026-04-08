
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiSend,
    FiMessageCircle,
    FiMap,
    FiShare2,
    FiFacebook,
    FiInstagram,
    FiTwitter,
    FiYoutube,
    FiLinkedin,
    FiChevronDown
} from 'react-icons/fi';
import {
    FaWhatsapp,
    FaTelegram,
    FaTiktok,
    FaSnapchatGhost,
    FaPinterest,
    FaReddit,
    FaMedium,
    FaTumblr,
    FaViber,
    FaWeixin,
    FaLine,
    FaHome,
    FaBuilding
} from 'react-icons/fa';

/* ============================================
   OPTION 1: MODERN CINEMATIC SPLIT
   ============================================
   Full Contact page with editorial aesthetic
*/

export function ContactPageOption1({
    contactPage,
    contactPhones,
    contactEmails,
    addresses,
    businessHours,
    faqs,
    mapSections,
    socialLinks,
    activePlatforms,
    socialMediaPlatforms,
    propertyPlatforms,
    isRTL,
    t,
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    ticketLoading,
    getDayName,
    formatTime
}) {
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const title = contactPage ? (isRTL ? contactPage.titleAr : contactPage.titleEn) : t('contact.title', 'Contact Us');
    const subtitle = contactPage ? (isRTL ? contactPage.subtitleAr : contactPage.subtitleEn) : t('contact.subtitle', 'Get in touch');

    return (
        <div className="min-h-screen bg-secondary-950">
            {/* Hero Section - Cinematic Split */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-r from-secondary-950 via-secondary-900 to-secondary-950" />
                    <div className="absolute inset-0 bg-[url('/banner.jpeg')] bg-cover bg-center opacity-10" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="h-px w-12 bg-primary-500" />
                            <span className="text-primary-500 text-sm tracking-[0.2em] uppercase font-medium">
                                {t('contact.getInTouch', 'Get In Touch')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif">
                            {title}
                        </h1>

                        <p className="text-xl text-neutral-300 mb-8 max-w-2xl">
                            {subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-white   py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Phones */}
                            {contactPhones?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-secondary-900   p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
                                            <FiPhone className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            {t('contact.phone', 'Phone')}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {contactPhones.map((phone) => (
                                            <a
                                                key={phone.id}
                                                href={`tel:${phone.phoneNumber}`}
                                                className="block p-3 bg-secondary-950   text-neutral-300 hover:bg-primary-500 hover:text-white transition-all"
                                            >
                                                {phone.phoneNumber}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Emails */}
                            {contactEmails?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-secondary-900   p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
                                            <FiMail className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            {t('contact.email', 'Email')}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {contactEmails.map((email) => (
                                            <a
                                                key={email.id}
                                                href={`mailto:${email.email}`}
                                                className="block p-3 bg-secondary-950   text-neutral-300 hover:bg-primary-500 hover:text-white transition-all break-all"
                                            >
                                                {email.email}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Addresses */}
                            {addresses?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-secondary-900   p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
                                            <FiMapPin className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            {t('contact.address', 'Address')}
                                        </h3>
                                    </div>
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="p-3 bg-secondary-950">
                                                <p className="text-white font-medium mb-1">
                                                    {isRTL ? address.streetAr : address.streetEn}
                                                </p>
                                                <p className="text-neutral-400 text-sm">
                                                    {isRTL ? address.cityAr : address.cityEn}, {isRTL ? address.countryAr : address.countryEn}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Business Hours */}
                            {businessHours?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-secondary-900   p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
                                            <FiClock className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            {t('contact.businessHours', 'Hours')}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {businessHours.map((hour) => (
                                            <div key={hour.id} className="flex justify-between p-3 bg-secondary-950">
                                                <span className="text-white font-medium">{getDayName(hour.day)}</span>
                                                {hour.isWorkingDay ? (
                                                    <span className="text-neutral-400 text-sm">
                                                        {formatTime(hour.from)} - {formatTime(hour.to)}
                                                    </span>
                                                ) : (
                                                    <span className="text-error-500 text-sm">{t('contact.closed', 'Closed')}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Social Links */}
                            {socialLinks && activePlatforms?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-secondary-900   p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary-500 flex items-center justify-center">
                                            <FiShare2 className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-serif">
                                            {t('contact.connectWithUs', 'Connect')}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activePlatforms.map((platform) => {
                                            const Icon = platform.icon;
                                            return (
                                                <a
                                                    key={platform.key}
                                                    href={platform.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-12 h-12 ${platform.bgColor} text-white flex items-center justify-center hover:scale-110 transition-all`}
                                                    title={platform.label}
                                                >
                                                    <Icon className="text-xl" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-neutral-50   p-8 border-t-4 border-primary-500"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <FiMessageCircle className="text-3xl text-primary-600" />
                                    <h3 className="text-2xl font-bold text-third-900   font-serif">
                                        {t('contact.sendMessage', 'Send Message')}
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wider text-third-900   mb-2">
                                                {t('contact.yourName', 'Name')} <span className="text-primary-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-neutral-50  border-2 ${formErrors.name ? 'border-error-500' : 'border-neutral-400   focus:border-primary-500'
                                                    } text-third-900   outline-none transition-all`}
                                            />
                                            {formErrors.name && <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wider text-third-900   mb-2">
                                                {t('contact.yourEmail', 'Email')} <span className="text-primary-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-neutral-50  border-2 ${formErrors.email ? 'border-error-500' : 'border-neutral-400   focus:border-primary-500'
                                                    } text-third-900   outline-none transition-all`}
                                            />
                                            {formErrors.email && <p className="mt-1 text-sm text-error-500">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-third-900   mb-2">
                                            {t('contact.yourPhone', 'Phone')} <span className="text-primary-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-neutral-50  border-2 ${formErrors.phone ? 'border-error-500' : 'border-neutral-400   focus:border-primary-500'
                                                } text-third-900   outline-none transition-all`}
                                        />
                                        {formErrors.phone && <p className="mt-1 text-sm text-error-500">{formErrors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-third-900   mb-2">
                                            {t('contact.yourMessage', 'Message')} <span className="text-primary-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 bg-neutral-50  border-2 ${formErrors.message ? 'border-error-500' : 'border-neutral-400   focus:border-primary-500'
                                                } text-third-900   outline-none transition-all resize-none`}
                                        />
                                        {formErrors.message && <p className="mt-1 text-sm text-error-500">{formErrors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={ticketLoading}
                                        className="w-full px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        <FiSend className="text-xl" />
                                        {ticketLoading ? t('contact.sending', 'Sending...') : t('contact.sendMessage', 'Send Message')}
                                    </button>
                                </form>
                            </motion.div>

                            {/* FAQs */}
                            {faqs?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mt-8 bg-neutral-50   p-8 border-t-4 border-primary-500"
                                >
                                    <h3 className="text-2xl font-bold text-third-900   mb-6 font-serif">
                                        {t('contact.faq', 'FAQs')}
                                    </h3>
                                    <div className="space-y-4">
                                        {faqs.map((faq, index) => (
                                            <div key={faq.id} className="border-s-4 border-primary-500 bg-neutral-50">
                                                <button
                                                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                    className="w-full flex justify-between items-center p-4 text-start hover:bg-primary-50   transition-all"
                                                >
                                                    <span className="font-bold text-third-900">
                                                        {isRTL ? faq.questionAr : faq.questionEn}
                                                    </span>
                                                    <FiChevronDown
                                                        className={`text-2xl text-primary-500 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                                {expandedFAQ === faq.id && (
                                                    <div className="px-4 pb-4 text-third-500">
                                                        {isRTL ? faq.answerAr : faq.answerEn}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {mapSections?.length > 0 && (() => {
                const mapSection = mapSections[0];
                return (
                    <section className="bg-secondary-950 py-24">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                    {isRTL ? mapSection.titleAr : mapSection.titleEn}
                                </h2>
                                <div className="h-1 w-20 bg-primary-500 mx-auto" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-secondary-900"
                            >
                                <div className="relative w-full h-125">
                                    {mapSection.embedCode ? (
                                        <div dangerouslySetInnerHTML={{ __html: mapSection.embedCode }} className="w-full h-full" />
                                    ) : mapSection.latitude && mapSection.longitude ? (
                                        <iframe
                                            src={`https://maps.google.com/maps?q=${mapSection.latitude},${mapSection.longitude}&z=15&output=embed`}
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                            title={isRTL ? mapSection.titleAr : mapSection.titleEn}
                                        />
                                    ) : null}
                                </div>

                                {mapSection.latitude && mapSection.longitude && (
                                    <div className="p-6 bg-secondary-950 flex gap-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${mapSection.latitude},${mapSection.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-6 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold text-center transition-all flex items-center justify-center gap-2"
                                        >
                                            <FiMapPin className="text-xl" />
                                            {t('contact.openInGoogleMaps', 'Open in Maps')}
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </section>
                );
            })()}
        </div>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST
   ============================================
   Full Contact page with stark brutalist design
*/

export function ContactPageOption2({
    contactPage,
    contactPhones,
    contactEmails,
    addresses,
    businessHours,
    faqs,
    mapSections,
    socialLinks,
    activePlatforms,
    socialMediaPlatforms,
    propertyPlatforms,
    isRTL,
    t,
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    ticketLoading,
    getDayName,
    formatTime
}) {
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const title = contactPage ? (isRTL ? contactPage.titleAr : contactPage.titleEn) : t('contact.title', 'Contact Us');

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Grid Background */}
            <div
                className="fixed inset-0 opacity-[0.03]   pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center py-20 border-b-4 border-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        className="max-w-6xl"
                    >
                        <div className="inline-block mb-8 px-8 py-4 bg-neutral-900   text-neutral-50  relative">
                            <span className="relative z-10 text-lg font-bold uppercase tracking-wider">
                                {t('contact.getInTouch', 'Get In Touch')}
                            </span>
                            <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2" />
                        </div>

                        <h1 className="text-[clamp(3rem,12vw,10rem)] font-black text-third-900   leading-[0.85] tracking-tighter mb-12 font-serif">
                            {title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="relative py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Contact Info - Left Column */}
                        <div className="lg:col-span-4 border-e-4 border-neutral-900">
                            {/* Phones */}
                            {contactPhones?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-8 border-b-4 border-neutral-900"
                                >
                                    <div className="text-5xl font-black mb-4 opacity-20">01</div>
                                    <h3 className="text-2xl font-black uppercase mb-4 text-third-900">
                                        {t('contact.phone', 'Phone')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactPhones.map((phone) => (
                                            <a
                                                key={phone.id}
                                                href={`tel:${phone.phoneNumber}`}
                                                className="block p-3 border-2 border-neutral-900   hover:bg-neutral-900 hover:text-neutral-50     transition-all font-bold"
                                            >
                                                {phone.phoneNumber}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Emails */}
                            {contactEmails?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="p-8 border-b-4 border-neutral-900"
                                >
                                    <div className="text-5xl font-black mb-4 opacity-20">02</div>
                                    <h3 className="text-2xl font-black uppercase mb-4 text-third-900">
                                        {t('contact.email', 'Email')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactEmails.map((email) => (
                                            <a
                                                key={email.id}
                                                href={`mailto:${email.email}`}
                                                className="block p-3 border-2 border-neutral-900   hover:bg-neutral-900 hover:text-neutral-50     transition-all font-bold break-all"
                                            >
                                                {email.email}
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Addresses */}
                            {addresses?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="p-8 border-b-4 border-neutral-900"
                                >
                                    <div className="text-5xl font-black mb-4 opacity-20">03</div>
                                    <h3 className="text-2xl font-black uppercase mb-4 text-third-900">
                                        {t('contact.address', 'Address')}
                                    </h3>
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="p-3 border-2 border-neutral-900">
                                                <p className="font-bold text-third-900   mb-1">
                                                    {isRTL ? address.streetAr : address.streetEn}
                                                </p>
                                                <p className="text-third-500   text-sm">
                                                    {isRTL ? address.cityAr : address.cityEn}, {isRTL ? address.countryAr : address.countryEn}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Business Hours */}
                            {businessHours?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="p-8 border-b-4 border-neutral-900"
                                >
                                    <div className="text-5xl font-black mb-4 opacity-20">04</div>
                                    <h3 className="text-2xl font-black uppercase mb-4 text-third-900">
                                        {t('contact.businessHours', 'Hours')}
                                    </h3>
                                    <div className="space-y-2">
                                        {businessHours.map((hour) => (
                                            <div key={hour.id} className="flex justify-between p-3 border-2 border-neutral-900">
                                                <span className="font-black text-third-900">{getDayName(hour.day)}</span>
                                                {hour.isWorkingDay ? (
                                                    <span className="text-third-500   text-sm font-bold">
                                                        {formatTime(hour.from)} - {formatTime(hour.to)}
                                                    </span>
                                                ) : (
                                                    <span className="text-error-500 text-sm font-bold">{t('contact.closed', 'CLOSED')}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Social Links */}
                            {socialLinks && activePlatforms?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="p-8"
                                >
                                    <div className="text-5xl font-black mb-4 opacity-20">05</div>
                                    <h3 className="text-2xl font-black uppercase mb-4 text-third-900">
                                        {t('contact.connectWithUs', 'Social')}
                                    </h3>
                                    <div className="flex flex-wrap gap-0">
                                        {activePlatforms.map((platform, index) => {
                                            const Icon = platform.icon;
                                            return (
                                                <a
                                                    key={platform.key}
                                                    href={platform.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-16 h-16 border-4 border-neutral-900   flex items-center justify-center hover:bg-neutral-900 hover:text-neutral-50     transition-all"
                                                    title={platform.label}
                                                >
                                                    <Icon className="text-2xl" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Contact Form - Right Column */}
                        <div className="lg:col-span-8 p-8 lg:p-12">
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-6xl font-black uppercase mb-12 text-third-900   tracking-tighter">
                                    {t('contact.sendMessage', 'Send Message')}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black uppercase mb-2 text-third-900">
                                                {t('contact.yourName', 'Name')} *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-4 border-4 ${formErrors.name ? 'border-error-500' : 'border-neutral-900  '
                                                    } bg-neutral-50  text-third-900   font-bold outline-none transition-all focus:bg-neutral-900 focus:text-neutral-50    `}
                                            />
                                            {formErrors.name && <p className="mt-2 text-sm font-bold text-error-500">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black uppercase mb-2 text-third-900">
                                                {t('contact.yourEmail', 'Email')} *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-4 border-4 ${formErrors.email ? 'border-error-500' : 'border-neutral-900  '
                                                    } bg-neutral-50  text-third-900   font-bold outline-none transition-all focus:bg-neutral-900 focus:text-neutral-50    `}
                                            />
                                            {formErrors.email && <p className="mt-2 text-sm font-bold text-error-500">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black uppercase mb-2 text-third-900">
                                            {t('contact.yourPhone', 'Phone')} *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-4 border-4 ${formErrors.phone ? 'border-error-500' : 'border-neutral-900  '
                                                } bg-neutral-50  text-third-900   font-bold outline-none transition-all focus:bg-neutral-900 focus:text-neutral-50    `}
                                        />
                                        {formErrors.phone && <p className="mt-2 text-sm font-bold text-error-500">{formErrors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black uppercase mb-2 text-third-900">
                                            {t('contact.yourMessage', 'Message')} *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full px-4 py-4 border-4 ${formErrors.message ? 'border-error-500' : 'border-neutral-900  '
                                                } bg-neutral-50  text-third-900   font-bold outline-none transition-all resize-none focus:bg-neutral-900 focus:text-neutral-50    `}
                                        />
                                        {formErrors.message && <p className="mt-2 text-sm font-bold text-error-500">{formErrors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={ticketLoading}
                                        className="px-12 py-6 bg-neutral-900   text-neutral-50  text-xl font-black uppercase hover:bg-neutral-900/80   transition-all disabled:opacity-50 relative group"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {ticketLoading ? t('contact.sending', 'SENDING...') : t('contact.sendMessage', 'SEND')}
                                            <FiSend />
                                        </span>
                                        <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </motion.div>

                            {/* FAQs */}
                            {faqs?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mt-16 pt-16 border-t-4 border-neutral-900"
                                >
                                    <h3 className="text-5xl font-black uppercase mb-8 text-third-900">
                                        {t('contact.faq', 'FAQs')}
                                    </h3>
                                    <div className="space-y-0">
                                        {faqs.map((faq) => (
                                            <div key={faq.id} className="border-t-4 border-neutral-900">
                                                <button
                                                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                    className="w-full p-6 text-start hover:bg-neutral-900 hover:text-neutral-50     transition-all flex justify-between items-center"
                                                >
                                                    <span className="font-black text-lg">{isRTL ? faq.questionAr : faq.questionEn}</span>
                                                    <div className={`text-3xl transform transition-transform ${expandedFAQ === faq.id ? 'rotate-45' : ''}`}>
                                                        +
                                                    </div>
                                                </button>
                                                {expandedFAQ === faq.id && (
                                                    <div className="px-6 pb-6 text-third-500">
                                                        {isRTL ? faq.answerAr : faq.answerEn}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {mapSections?.length > 0 && (() => {
                const mapSection = mapSections[0];
                return (
                    <section className="border-t-4 border-neutral-900   py-0">
                        <div className="relative w-full h-125 border-b-4 border-neutral-900">
                            {mapSection.embedCode ? (
                                <div dangerouslySetInnerHTML={{ __html: mapSection.embedCode }} className="w-full h-full" />
                            ) : mapSection.latitude && mapSection.longitude ? (
                                <iframe
                                    src={`https://maps.google.com/maps?q=${mapSection.latitude},${mapSection.longitude}&z=15&output=embed`}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    title={isRTL ? mapSection.titleAr : mapSection.titleEn}
                                />
                            ) : null}
                        </div>

                        {mapSection.latitude && mapSection.longitude && (
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${mapSection.latitude},${mapSection.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-12 py-6 bg-neutral-900   text-neutral-50  font-black uppercase hover:bg-neutral-900/80   transition-all relative group"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <FiMapPin className="text-2xl" />
                                        {t('contact.openInGoogleMaps', 'Open in Maps')}
                                    </span>
                                    <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                                </a>
                            </div>
                        )}
                    </section>
                );
            })()}
        </div>
    );
}