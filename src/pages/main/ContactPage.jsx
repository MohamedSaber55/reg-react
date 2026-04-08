"use client"
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchContactPage } from '@/store/slices/contactPageSlice';
import { fetchContactPhones } from '@/store/slices/contactPhoneSlice';
import { fetchContactEmails } from '@/store/slices/contactEmailSlice';
import { fetchAddresses } from '@/store/slices/addressSlice';
import { fetchBusinessHours } from '@/store/slices/businessHourSlice';
import { fetchFAQs } from '@/store/slices/faqSlice';
import { fetchMapSections } from '@/store/slices/mapSectionSlice';
import { createTicket } from '@/store/slices/ticketSlice';
import { Alert } from '@/components/common/Alert';
import Loading from '@/components/layout/Loading';
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
    FiLinkedin
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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { fetchSocialMediaLinks } from '@/store/slices/socialMediaLinksSlice';
import { useComprehensivePageTracking, useFormTracking } from '@/hooks/useMetaPixelPageView';

export default function ContactUsPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const { contactPage, loading: pageLoading } = useAppSelector((state) => state.contactPage);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { businessHours } = useAppSelector((state) => state.businessHour);
    const { faqs } = useAppSelector((state) => state.faq);
    const { mapSections } = useAppSelector((state) => state.mapSection);
    const { operationLoading: ticketLoading } = useAppSelector((state) => state.ticket);
    const { socialMediaLinks, loading: socialLoading } = useAppSelector((state) => state.socialMediaLinks);
    const socialLinks = socialMediaLinks?.[0];

    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }

    const ticketReasons = [
        { id: 5, nameEn: "Other", nameAr: "أخرى" },
        { id: 3, nameEn: "Inquiry", nameAr: "استفسار" },
        { id: 1, nameEn: "Sale", nameAr: "بيع" },
        { id: 2, nameEn: "Purchase", nameAr: "شراء" },
        { id: 4, nameEn: "Complaint", nameAr: "شكوى" }
    ];

    useComprehensivePageTracking('Contact Us', {
        language: currentLang,
        rtl: isRTL
    });

    // Form tracking
    const { trackFormStart, trackFormSubmit, trackFormError } = useFormTracking('Contact Form', 'contact');

    // Track form start on first field interaction
    const [formStarted, setFormStarted] = useState(false);
    const handleFormStart = () => {
        if (!formStarted) {
            trackFormStart();
            setFormStarted(true);
        }
    };


    // Formik validation schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .min(2, t('validation.name.minLength', { min: 2 }))
            .max(100, t('validation.name.maxLength', { max: 100 }))
            .required(t('validation.name.required')),
        email: Yup.string()
            .trim()
            .email(t('validation.email.invalid'))
            .required(t('validation.email.required')),
        phone: Yup.string()
            .trim()
            .matches(/^[\d\s+()-]+$/, t('validation.phone.invalid'))
            .min(8, t('validation.phone.minLength', { min: 8 }))
            .required(t('validation.phone.required')),
        ticketReasonId: Yup.number()
            .required(t('validation.reason.required', 'Please select a reason')),
        message: Yup.string()
            .trim()
            .min(10, t('validation.message.minLength', { min: 10 }))
            .max(1000, t('validation.message.maxLength', { max: 1000 }))
            .required(t('validation.message.required'))
    });

    // Formik form
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            ticketReasonId: '',
            message: ''
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const ticketData = {
                    name: values.name.trim(),
                    message: values.message.trim(),
                    ticketStatusId: 1,
                    ticketReasonId: values.ticketReasonId,
                    emails: [{ address: values.email.trim() }],
                    phones: [{ number: values.phone.trim() }]
                };

                await dispatch(createTicket(ticketData)).unwrap();

                trackFormSubmit(true);

                // Show success alert
                setAlert({
                    type: 'success',
                    message: t('contact.messageSentSuccess', 'Your message has been sent successfully! We will contact you soon.')
                });

                toast.success(
                    t('contact.messageSentSuccess', 'Your message has been sent successfully! We will contact you soon.')
                );

                // Reset form
                resetForm();

                // Auto-hide alert after 10 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 10000);

            } catch (error) {
                console.error('Error submitting form:', error);

                // Show error alert
                setAlert({
                    type: 'error',
                    message: error || t('contact.messageSentError', 'Failed to send message. Please try again.')
                });

                trackFormSubmit(false);
                trackFormError('submission_error', error);

                toast.error(
                    error || t('contact.messageSentError', 'Failed to send message. Please try again.')
                );

                // Auto-hide alert after 10 seconds
                setTimeout(() => {
                    setAlert(null);
                }, 10000);
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        dispatch(fetchContactPage());
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchBusinessHours({ onlyWorkingDays: false }));
        dispatch(fetchFAQs());
        dispatch(fetchMapSections());
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
    }, [dispatch]);

    // Social media platforms configuration
    const socialPlatforms = [
        // Social Media Platforms
        {
            key: 'facebook',
            label: 'Facebook',
            icon: FiFacebook,
            color: 'text-info-600',
            bgColor: 'bg-info-600',
            isActive: socialLinks?.facebookIsActive,
            url: socialLinks?.facebookUrl
        },
        {
            key: 'instagram',
            label: 'Instagram',
            icon: FiInstagram,
            color: 'text-pink-600',
            bgColor: 'bg-linear-to-r from-purple-600 to-pink-600',
            isActive: socialLinks?.instagramIsActive,
            url: socialLinks?.instagramUrl
        },
        {
            key: 'twitter',
            label: 'Twitter',
            icon: FiTwitter,
            color: 'text-info-400',
            bgColor: 'bg-info-400',
            isActive: socialLinks?.twitterIsActive,
            url: socialLinks?.twitterUrl
        },
        {
            key: 'tikTok',
            label: 'TikTok',
            icon: FaTiktok,
            color: 'text-black',
            bgColor: 'bg-black',
            isActive: socialLinks?.tikTokIsActive,
            url: socialLinks?.tikTokUrl
        },
        {
            key: 'snapchat',
            label: 'Snapchat',
            icon: FaSnapchatGhost,
            color: 'text-warning-400',
            bgColor: 'bg-warning-400',
            isActive: socialLinks?.snapchatIsActive,
            url: socialLinks?.snapchatUrl
        },
        {
            key: 'linkedIn',
            label: 'LinkedIn',
            icon: FiLinkedin,
            color: 'text-info-700',
            bgColor: 'bg-info-700',
            isActive: socialLinks?.linkedInIsActive,
            url: socialLinks?.linkedInUrl
        },
        {
            key: 'youTube',
            label: 'YouTube',
            icon: FiYoutube,
            color: 'text-error-600',
            bgColor: 'bg-error-600',
            isActive: socialLinks?.youTubeIsActive,
            url: socialLinks?.youTubeUrl
        },
        {
            key: 'whatsApp',
            label: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'text-success-600',
            bgColor: 'bg-success-600',
            isActive: socialLinks?.whatsAppIsActive,
            url: socialLinks?.whatsAppUrl
        },
        {
            key: 'telegram',
            label: 'Telegram',
            icon: FaTelegram,
            color: 'text-info-500',
            bgColor: 'bg-info-500',
            isActive: socialLinks?.telegramIsActive,
            url: socialLinks?.telegramUrl
        },
        {
            key: 'pinterest',
            label: 'Pinterest',
            icon: FaPinterest,
            color: 'text-error-700',
            bgColor: 'bg-error-700',
            isActive: socialLinks?.pinterestIsActive,
            url: socialLinks?.pinterestUrl
        },
        {
            key: 'reddit',
            label: 'Reddit',
            icon: FaReddit,
            color: 'text-orange-600',
            bgColor: 'bg-orange-600',
            isActive: socialLinks?.redditIsActive,
            url: socialLinks?.redditUrl
        },
        {
            key: 'medium',
            label: 'Medium',
            icon: FaMedium,
            color: 'text-black',
            bgColor: 'bg-black',
            isActive: socialLinks?.mediumIsActive,
            url: socialLinks?.mediumUrl
        },
        {
            key: 'tumblr',
            label: 'Tumblr',
            icon: FaTumblr,
            color: 'text-info-800',
            bgColor: 'bg-info-800',
            isActive: socialLinks?.tumblrIsActive,
            url: socialLinks?.tumblrUrl
        },
        {
            key: 'viber',
            label: 'Viber',
            icon: FaViber,
            color: 'text-purple-700',
            bgColor: 'bg-purple-700',
            isActive: socialLinks?.viberIsActive,
            url: socialLinks?.viberUrl
        },
        {
            key: 'weChat',
            label: 'WeChat',
            icon: FaWeixin,
            color: 'text-success-500',
            bgColor: 'bg-success-500',
            isActive: socialLinks?.weChatIsActive,
            url: socialLinks?.weChatUrl
        },
        {
            key: 'line',
            label: 'Line',
            icon: FaLine,
            color: 'text-success-400',
            bgColor: 'bg-success-400',
            isActive: socialLinks?.lineIsActive,
            url: socialLinks?.lineUrl
        },
        // Property Platforms - Middle East
        {
            key: 'aqarmap',
            label: 'Aqarmap',
            icon: FaBuilding,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500',
            isActive: socialLinks?.aqarmapIsActive,
            url: socialLinks?.aqarmapUrl
        },
        {
            key: 'dubizzle',
            label: 'Dubizzle',
            icon: FaBuilding,
            color: 'text-info-600',
            bgColor: 'bg-info-600',
            isActive: socialLinks?.dubizzleIsActive,
            url: socialLinks?.dubizzleUrl
        },
        {
            key: 'propertyFinder',
            label: 'Property Finder',
            icon: FaBuilding,
            color: 'text-error-500',
            bgColor: 'bg-error-500',
            isActive: socialLinks?.propertyFinderIsActive,
            url: socialLinks?.propertyFinderUrl
        },
        {
            key: 'bayut',
            label: 'Bayut',
            icon: FaBuilding,
            color: 'text-warning-600',
            bgColor: 'bg-warning-600',
            isActive: socialLinks?.bayutIsActive,
            url: socialLinks?.bayutUrl
        },
        {
            key: 'justProperty',
            label: 'Just Property',
            icon: FaBuilding,
            color: 'text-purple-600',
            bgColor: 'bg-purple-600',
            isActive: socialLinks?.justPropertyIsActive,
            url: socialLinks?.justPropertyUrl
        },
        {
            key: 'olx',
            label: 'OLX',
            icon: FaBuilding,
            color: 'text-success-600',
            bgColor: 'bg-success-600',
            isActive: socialLinks?.olxIsActive,
            url: socialLinks?.olxUrl
        },
        // Property Platforms - International
        {
            key: 'zillow',
            label: 'Zillow',
            icon: FaBuilding,
            color: 'text-info-500',
            bgColor: 'bg-info-500',
            isActive: socialLinks?.zillowIsActive,
            url: socialLinks?.zillowUrl
        },
        {
            key: 'realtor',
            label: 'Realtor',
            icon: FaBuilding,
            color: 'text-info-700',
            bgColor: 'bg-info-700',
            isActive: socialLinks?.realtorIsActive,
            url: socialLinks?.realtorUrl
        },
        {
            key: 'trulia',
            label: 'Trulia',
            icon: FaBuilding,
            color: 'text-teal-600',
            bgColor: 'bg-teal-600',
            isActive: socialLinks?.truliaIsActive,
            url: socialLinks?.truliaUrl
        },
        {
            key: 'homesDotCom',
            label: 'Homes.com',
            icon: FaHome,
            color: 'text-error-600',
            bgColor: 'bg-error-600',
            isActive: socialLinks?.homesDotComIsActive,
            url: socialLinks?.homesDotComUrl
        }
    ];

    // Filter active platforms
    const activePlatforms = socialPlatforms.filter(platform =>
        platform.isActive && platform.url
    );

    // Group platforms by category
    const socialMediaPlatforms = activePlatforms.filter(p =>
        ['facebook', 'instagram', 'twitter', 'tikTok', 'snapchat', 'linkedIn', 'youTube',
            'whatsApp', 'telegram', 'pinterest', 'reddit', 'medium', 'tumblr', 'viber', 'weChat', 'line'].includes(p.key)
    );

    const propertyPlatforms = activePlatforms.filter(p =>
        ['aqarmap', 'dubizzle', 'propertyFinder', 'bayut', 'justProperty', 'olx',
            'zillow', 'realtor', 'trulia', 'homesDotCom'].includes(p.key)
    );

    const getDayName = (dayName) => {
        const days = {
            "Sunday": { en: 'Sunday', ar: 'الأحد' },
            "Monday": { en: 'Monday', ar: 'الاثنين' },
            "Tuesday": { en: 'Tuesday', ar: 'الثلاثاء' },
            "Wednesday": { en: 'Wednesday', ar: 'الأربعاء' },
            "Thursday": { en: 'Thursday', ar: 'الخميس' },
            "Friday": { en: 'Friday', ar: 'الجمعة' },
            "Saturday": { en: 'Saturday', ar: 'السبت' }
        };

        return isRTL ? days[dayName]?.ar : days[dayName]?.en;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const timeMatch = timeString.match(/(\d{2}):(\d{2}):(\d{2})/);
        if (!timeMatch) return timeString;

        const [, hours, minutes] = timeMatch;
        const hourNum = parseInt(hours, 10);

        const period = hourNum >= 12 ? t("common.time.pm") : t("common.time.am");
        const hour12 = hourNum % 12 || 12;

        return `${hour12}:${minutes} ${period}`;
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const title = contactPage ? (isRTL ? contactPage.titleAr : contactPage.titleEn) : t('contact.title', 'Contact Us');
    const subtitle = contactPage ? (isRTL ? contactPage.subtitleAr : contactPage.subtitleEn) : t('contact.subtitle', 'Get in touch with us');

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className="layer flex items-center justify-center w-full aspect-21/5 bg-linear-to-r from-primary-600/60 to-primary-800/60 py-20">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-bold text-white mb-4 font-serif">
                                {title}
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information - Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Phones */}
                        {contactPhones.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <FiPhone className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('contact.phone', 'Phone')}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {contactPhones.map((phone) => (
                                        <a
                                            key={phone.id}
                                            href={`tel:${phone.phoneNumber}`}
                                            className="block p-3 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-all"
                                        >
                                            <p className="text-third-900 font-medium">
                                                {phone.phoneNumber}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Emails */}
                        {contactEmails.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <FiMail className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('contact.email', 'Email')}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {contactEmails.map((email) => (
                                        <a
                                            key={email.id}
                                            href={`mailto:${email.email}`}
                                            className="block p-3 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-all break-all"
                                        >
                                            <p className="text-third-900 font-medium">
                                                {email.email}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Addresses */}
                        {addresses.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <FiMapPin className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('contact.address', 'Address')}
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className="p-3 bg-neutral-50 rounded-xl"
                                        >
                                            <p className="text-third-900 font-medium mb-1">
                                                {isRTL ? address.streetAr : address.streetEn}
                                            </p>
                                            <p className="text-third-500 text-sm">
                                                {isRTL ? address.cityAr : address.cityEn}, {isRTL ? address.countryAr : address.countryEn}
                                            </p>
                                            {(address.detailsEn || address.detailsAr) && (
                                                <p className="text-third-500 text-sm mt-2">
                                                    {isRTL ? address.detailsAr : address.detailsEn}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Business Hours */}
                        {businessHours.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <FiClock className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('contact.businessHours', 'Business Hours')}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {businessHours.map((hour) => (
                                        <div
                                            key={hour.id}
                                            className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl"
                                        >
                                            <span className="text-third-900 font-medium">
                                                {getDayName(hour.day)}
                                            </span>
                                            {hour.isWorkingDay ? (
                                                <span className="text-third-500 text-sm">
                                                    {formatTime(hour.from)} - {formatTime(hour.to)}
                                                </span>
                                            ) : (
                                                <span className="text-error-500 text-sm">
                                                    {t('contact.closed', 'Closed')}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Social Media Links - ALL Platforms */}
                        {socialLinks && activePlatforms.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <FiShare2 className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('contact.connectWithUs', 'Connect With Us')}
                                    </h3>
                                </div>

                                {/* Social Media Platforms */}
                                {socialMediaPlatforms.length > 0 && (
                                    <>
                                        <h4 className="text-sm font-semibold text-third-500 mb-3 uppercase tracking-wider">
                                            {t('contact.socialMedia', 'Social Media')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {socialMediaPlatforms.map((platform) => {
                                                const Icon = platform.icon;
                                                return (
                                                    <a
                                                        key={platform.key}
                                                        href={platform.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`w-10 h-10 ${platform.bgColor} text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all`}
                                                        title={platform.label}
                                                    >
                                                        <Icon className="text-lg" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {/* Property Platforms */}
                                {propertyPlatforms.length > 0 && (
                                    <>
                                        <h4 className="text-sm font-semibold text-third-500 mb-3 uppercase tracking-wider mt-4">
                                            {t('contact.propertyPlatforms', 'Property Platforms')}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {propertyPlatforms.map((platform) => {
                                                const Icon = platform.icon;
                                                return (
                                                    <a
                                                        key={platform.key}
                                                        href={platform.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`w-10 h-10 ${platform.bgColor} text-white rounded-lg flex items-center justify-center hover:scale-110 transition-all`}
                                                        title={platform.label}
                                                    >
                                                        <Icon className="text-lg" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Contact Form - Right Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-neutral-50 rounded-2xl p-8 border border-neutral-400"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <FiMessageCircle className="text-2xl text-primary-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-third-900 font-serif">
                                    {t('contact.sendMessage', 'Send us a Message')}
                                </h3>
                            </div>

                            {/* Alert Message */}
                            {alert && (
                                <div className="mb-6">
                                    <Alert
                                        variant={alert.type}
                                        dismissible
                                        onDismiss={() => setAlert(null)}
                                    >
                                        {alert.message}
                                    </Alert>
                                </div>
                            )}

                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-third-900 mb-2">
                                            {t('contact.yourName', 'Your Name')} <span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.name && formik.errors.name
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="mt-1 text-sm text-error-500">{formik.errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-third-900 mb-2">
                                            {t('contact.yourEmail', 'Your Email')} <span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.email && formik.errors.email
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="mt-1 text-sm text-error-500">{formik.errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-third-900 mb-2">
                                            {t('contact.yourPhone', 'Your Phone')} <span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.phone && formik.errors.phone
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <p className="mt-1 text-sm text-error-500">{formik.errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Ticket Reason Field - NEW */}
                                    <div>
                                        <label className="block text-sm font-medium text-third-900 mb-2">
                                            {t('contact.reason', 'Reason')} <span className="text-error-500">*</span>
                                        </label>
                                        <select
                                            id="ticketReasonId"
                                            name="ticketReasonId"
                                            value={formik.values.ticketReasonId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.ticketReasonId && formik.errors.ticketReasonId
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all cursor-pointer`}
                                        >
                                            <option value="">
                                                {t('contact.selectReason', 'Select a reason')}
                                            </option>
                                            {ticketReasons.map((reason) => (
                                                <option key={reason.id} value={reason.id}>
                                                    {isRTL ? reason.nameAr : reason.nameEn}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.ticketReasonId && formik.errors.ticketReasonId && (
                                            <p className="mt-1 text-sm text-error-500">{formik.errors.ticketReasonId}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('contact.yourMessage', 'Your Message')} <span className="text-error-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formik.values.message}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows={6}
                                        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.message && formik.errors.message
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all resize-none`}
                                    ></textarea>
                                    {formik.touched.message && formik.errors.message && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting || ticketLoading || !formik.isValid}
                                    className="w-full px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    <FiSend className="text-xl" />
                                    {formik.isSubmitting || ticketLoading
                                        ? t('contact.sending', 'Sending...')
                                        : t('contact.sendMessage', 'Send Message')
                                    }
                                </button>
                            </form>
                        </motion.div>

                        {/* FAQs Section */}
                        {faqs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 bg-neutral-50 rounded-2xl p-8 border border-neutral-400"
                            >
                                <h3 className="text-2xl font-bold text-third-900 mb-6 font-serif">
                                    {t('contact.faq', 'Frequently Asked Questions')}
                                </h3>
                                <div className="space-y-4">
                                    {faqs.map((faq) => (
                                        <div
                                            key={faq.id}
                                            className="border border-neutral-400 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                                className="w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-primary-50 transition-all text-start"
                                            >
                                                <span className="font-semibold text-third-900">
                                                    {isRTL ? faq.questionAr : faq.questionEn}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
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
                                            <AnimatePresence>
                                                {expandedFAQ === faq.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 bg-neutral-50 border-t border-neutral-400">
                                                            <p className="text-third-500 leading-relaxed">
                                                                {isRTL ? faq.answerAr : faq.answerEn}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Section */}
            {mapSections.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                >
                    {(() => {
                        const mapSection = mapSections[0];
                        return (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-third-900 mb-4 font-serif">
                                        {isRTL ? mapSection.titleAr : mapSection.titleEn}
                                    </h2>
                                    <p className="text-third-500">
                                        <span>{isRTL ? mapSection.addressTextAr : mapSection.addressTextEn}</span>
                                    </p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-neutral-50 overflow-hidden"
                                >
                                    {/* Map Embed */}
                                    <div className="relative w-full h-125 bg-neutral-200">
                                        {mapSection.embedCode ? (
                                    <div
                                        className="w-full h-full"
                                        dangerouslySetInnerHTML={{ __html: mapSection.embedCode.replace('<iframe ', '<iframe style="width:100%; height:100%; border:0;" ') }}
                                    />
                                        ) : mapSection.latitude && mapSection.longitude ? (
                                            <div className="w-full h-full">
                                                <iframe
                                                    src={`https://maps.google.com/maps?q=${mapSection.latitude},${mapSection.longitude}&z=15&output=embed`}
                                                    className="w-full h-full border-0"
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title={isRTL ? mapSection.titleAr : mapSection.titleEn}
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <FiMapPin className="text-6xl text-neutral-400 mx-auto mb-4" />
                                                    <p className="text-third-500">
                                                        {t('contact.mapNotAvailable', 'Map not available')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Map Footer with Actions */}
                                    {mapSection.latitude && mapSection.longitude && (
                                        <div className="p-6 bg-neutral-50 flex flex-col sm:flex-row gap-4 mt-8">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${mapSection.latitude},${mapSection.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all text-center shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                            >
                                                <FiMapPin className="text-xl" />
                                                {t('contact.openInGoogleMaps', 'Open in Google Maps')}
                                            </a>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${mapSection.latitude},${mapSection.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-6 py-4 bg-neutral-50 hover:bg-primary-50 text-third-900 font-bold rounded-xl transition-all border-2 border-neutral-400 text-center flex items-center justify-center gap-2"
                                            >
                                                <FiMap className="text-xl" />
                                                {t('contact.getDirections', 'Get Directions')}
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            </>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
}