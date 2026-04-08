
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
    FiChevronDown
} from 'react-icons/fi';

/* ============================================
   OPTION 3: SOFT ORGANIC CURVES
   ============================================
   Full Contact page with soft, inviting design
*/

export function ContactPageOption3({
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
        <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
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
                        className="absolute -bottom-1/2 -inset-e-1/4 w-250 h-250 bg-linear-to-br from-accent-300/30 to-primary-300/30     rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-block px-6 py-3 bg-neutral-50/60  /60 backdrop-blur-sm rounded-full mb-8 border border-primary-300/50">
                            <span className="text-primary-700   font-semibold text-sm">
                                ✨ {t('contact.getInTouch', 'Get In Touch')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent">
                            {title}
                        </h1>

                        <p className="text-2xl text-neutral-800   max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {/* Phones */}
                            {contactPhones?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   hover:shadow-2xl transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600     rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <FiPhone className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900   mb-4 font-serif">
                                        {t('contact.phone', 'Phone')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactPhones.map((phone) => (
                                            <a
                                                key={phone.id}
                                                href={`tel:${phone.phoneNumber}`}
                                                className="block p-3 bg-neutral-50/50  /50 rounded-xl hover:bg-primary-100   transition-all text-third-900   font-medium"
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
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   hover:shadow-2xl transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-accent-500 to-accent-600     rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <FiMail className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900   mb-4 font-serif">
                                        {t('contact.email', 'Email')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactEmails.map((email) => (
                                            <a
                                                key={email.id}
                                                href={`mailto:${email.email}`}
                                                className="block p-3 bg-neutral-50/50  /50 rounded-xl hover:bg-accent-100   transition-all text-third-900   font-medium break-all"
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
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   hover:shadow-2xl transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-success-500 to-success-600     rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <FiMapPin className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900   mb-4 font-serif">
                                        {t('contact.address', 'Address')}
                                    </h3>
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="p-3 bg-neutral-50/50  /50 rounded-xl">
                                                <p className="font-bold text-third-900   mb-1">
                                                    {isRTL ? address.streetAr : address.streetEn}
                                                </p>
                                                <p className="text-neutral-700   text-sm">
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
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   hover:shadow-2xl transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-warning-500 to-warning-600     rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <FiClock className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900   mb-4 font-serif">
                                        {t('contact.businessHours', 'Hours')}
                                    </h3>
                                    <div className="space-y-2">
                                        {businessHours.map((hour) => (
                                            <div key={hour.id} className="flex justify-between p-3 bg-neutral-50/50  /50 rounded-xl">
                                                <span className="font-bold text-third-900">{getDayName(hour.day)}</span>
                                                {hour.isWorkingDay ? (
                                                    <span className="text-neutral-700   text-sm">
                                                        {formatTime(hour.from)} - {formatTime(hour.to)}
                                                    </span>
                                                ) : (
                                                    <span className="text-error-500 text-sm font-semibold">{t('contact.closed', 'Closed')}</span>
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
                                    className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   hover:shadow-2xl transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-accent-500     rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <FiShare2 className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900   mb-4 font-serif">
                                        {t('contact.connectWithUs', 'Connect')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activePlatforms.map((platform) => {
                                            const Icon = platform.icon;
                                            return (
                                                <a
                                                    key={platform.key}
                                                    href={platform.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-12 h-12 ${platform.bgColor} text-white rounded-2xl flex items-center justify-center hover:scale-110 transition-all shadow-lg`}
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
                                className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-8 border border-primary-300/50   shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600     rounded-2xl flex items-center justify-center shadow-lg">
                                        <FiMessageCircle className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-third-900   font-serif">
                                        {t('contact.sendMessage', 'Send Message')}
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-third-900   mb-2">
                                                {t('contact.yourName', 'Name')} <span className="text-primary-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl bg-neutral-50/50  /50 border-2 ${formErrors.name ? 'border-error-500' : 'border-primary-300/50   focus:border-primary-500'
                                                    } text-third-900   outline-none transition-all`}
                                            />
                                            {formErrors.name && <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-third-900   mb-2">
                                                {t('contact.yourEmail', 'Email')} <span className="text-primary-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl bg-neutral-50/50  /50 border-2 ${formErrors.email ? 'border-error-500' : 'border-primary-300/50   focus:border-primary-500'
                                                    } text-third-900   outline-none transition-all`}
                                            />
                                            {formErrors.email && <p className="mt-1 text-sm text-error-500">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-third-900   mb-2">
                                            {t('contact.yourPhone', 'Phone')} <span className="text-primary-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50/50  /50 border-2 ${formErrors.phone ? 'border-error-500' : 'border-primary-300/50   focus:border-primary-500'
                                                } text-third-900   outline-none transition-all`}
                                        />
                                        {formErrors.phone && <p className="mt-1 text-sm text-error-500">{formErrors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-third-900   mb-2">
                                            {t('contact.yourMessage', 'Message')} <span className="text-primary-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50/50  /50 border-2 ${formErrors.message ? 'border-error-500' : 'border-primary-300/50   focus:border-primary-500'
                                                } text-third-900   outline-none transition-all resize-none`}
                                        />
                                        {formErrors.message && <p className="mt-1 text-sm text-error-500">{formErrors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={ticketLoading}
                                        className="w-full px-8 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700         text-white font-bold rounded-2xl transition-all hover:scale-105 disabled:opacity-50 shadow-xl flex items-center justify-center gap-3"
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
                                    className="mt-8 bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-8 border border-primary-300/50"
                                >
                                    <h3 className="text-2xl font-bold text-third-900   mb-6 font-serif">
                                        {t('contact.faq', 'FAQs')}
                                    </h3>
                                    <div className="space-y-4">
                                        {faqs.map((faq) => (
                                            <div key={faq.id} className="bg-neutral-50/50  /50 rounded-2xl border border-primary-300/50   overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                    className="w-full flex justify-between items-center p-4 hover:bg-primary-50   transition-all text-start"
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
                                                    <div className="px-4 pb-4 text-neutral-700">
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
                    <section className="py-24 bg-white/50   backdrop-blur-sm">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-bold bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent mb-4 font-serif">
                                    {isRTL ? mapSection.titleAr : mapSection.titleEn}
                                </h2>
                                <div className="h-1 w-20 bg-linear-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl overflow-hidden border border-primary-300/50   shadow-2xl"
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
                                    <div className="p-6 bg-neutral-50/50  /50 flex gap-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${mapSection.latitude},${mapSection.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-2xl transition-all text-center shadow-lg flex items-center justify-center gap-2"
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
   OPTION 4: MODERN GLASS MORPHISM
   ============================================
   Full Contact page with premium glass effects
*/

export function ContactPageOption4({
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
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

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                            <span className="text-accent-200 font-semibold text-sm">
                                ⭐ {t('contact.getInTouch', 'Get In Touch')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {title}
                        </h1>

                        <p className="text-2xl text-accent-200 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 bg-linear-to-br from-secondary-950 via-accent-950 to-secondary-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {/* Phones */}
                            {contactPhones?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4">
                                        <FiPhone className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif">
                                        {t('contact.phone', 'Phone')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactPhones.map((phone) => (
                                            <a
                                                key={phone.id}
                                                href={`tel:${phone.phoneNumber}`}
                                                className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white font-medium"
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
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4">
                                        <FiMail className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif">
                                        {t('contact.email', 'Email')}
                                    </h3>
                                    <div className="space-y-2">
                                        {contactEmails.map((email) => (
                                            <a
                                                key={email.id}
                                                href={`mailto:${email.email}`}
                                                className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white font-medium break-all"
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
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mb-4">
                                        <FiMapPin className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif">
                                        {t('contact.address', 'Address')}
                                    </h3>
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="p-3 bg-white/5 rounded-xl">
                                                <p className="font-bold text-white mb-1">
                                                    {isRTL ? address.streetAr : address.streetEn}
                                                </p>
                                                <p className="text-accent-300 text-sm">
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
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center mb-4">
                                        <FiClock className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif">
                                        {t('contact.businessHours', 'Hours')}
                                    </h3>
                                    <div className="space-y-2">
                                        {businessHours.map((hour) => (
                                            <div key={hour.id} className="flex justify-between p-3 bg-white/5 rounded-xl">
                                                <span className="font-bold text-white">{getDayName(hour.day)}</span>
                                                {hour.isWorkingDay ? (
                                                    <span className="text-accent-300 text-sm">
                                                        {formatTime(hour.from)} - {formatTime(hour.to)}
                                                    </span>
                                                ) : (
                                                    <span className="text-error-400 text-sm font-semibold">{t('contact.closed', 'Closed')}</span>
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
                                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-4">
                                        <FiShare2 className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif">
                                        {t('contact.connectWithUs', 'Connect')}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {activePlatforms.map((platform) => {
                                            const Icon = platform.icon;
                                            return (
                                                <a
                                                    key={platform.key}
                                                    href={platform.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110"
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
                                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                                        <FiMessageCircle className="text-2xl text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white font-serif">
                                        {t('contact.sendMessage', 'Send Message')}
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                {t('contact.yourName', 'Name')} <span className="text-accent-300">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border-2 ${formErrors.name ? 'border-error-400' : 'border-white/20 focus:border-primary-500'
                                                    } text-white outline-none transition-all`}
                                            />
                                            {formErrors.name && <p className="mt-1 text-sm text-error-400">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-white mb-2">
                                                {t('contact.yourEmail', 'Email')} <span className="text-accent-300">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border-2 ${formErrors.email ? 'border-error-400' : 'border-white/20 focus:border-primary-500'
                                                    } text-white outline-none transition-all`}
                                            />
                                            {formErrors.email && <p className="mt-1 text-sm text-error-400">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            {t('contact.yourPhone', 'Phone')} <span className="text-accent-300">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl bg-white/5 border-2 ${formErrors.phone ? 'border-error-400' : 'border-white/20 focus:border-primary-500'
                                                } text-white outline-none transition-all`}
                                        />
                                        {formErrors.phone && <p className="mt-1 text-sm text-error-400">{formErrors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            {t('contact.yourMessage', 'Message')} <span className="text-accent-300">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className={`w-full px-4 py-3 rounded-xl bg-white/5 border-2 ${formErrors.message ? 'border-error-400' : 'border-white/20 focus:border-primary-500'
                                                } text-white outline-none transition-all resize-none`}
                                        />
                                        {formErrors.message && <p className="mt-1 text-sm text-error-400">{formErrors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={ticketLoading}
                                        className="w-full px-8 py-4 bg-linear-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-2xl transition-all hover:scale-105 disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3"
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
                                    className="mt-6 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-6 font-serif">
                                        {t('contact.faq', 'FAQs')}
                                    </h3>
                                    <div className="space-y-4">
                                        {faqs.map((faq) => (
                                            <div key={faq.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                    className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-all text-start"
                                                >
                                                    <span className="font-bold text-white">
                                                        {isRTL ? faq.questionAr : faq.questionEn}
                                                    </span>
                                                    <FiChevronDown
                                                        className={`text-2xl text-accent-300 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''
                                                            }`}
                                                    />
                                                </button>
                                                {expandedFAQ === faq.id && (
                                                    <div className="px-4 pb-4 text-accent-300">
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
                    <section className="py-24 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-bold text-white mb-4 font-serif">
                                    {isRTL ? mapSection.titleAr : mapSection.titleEn}
                                </h2>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20"
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
                                    <div className="p-6 bg-white/5 flex gap-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${mapSection.latitude},${mapSection.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-6 py-4 bg-linear-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-2xl transition-all text-center shadow-2xl flex items-center justify-center gap-2"
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