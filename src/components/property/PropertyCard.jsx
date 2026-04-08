import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FiMapPin,
    FiMaximize,
    FiShare2,
    FiCalendar,
    FiChevronRight,
    FiEye,
    FiX,
    FiHome,
    FiPhone
} from 'react-icons/fi';
import { FaBath, FaBed, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import defaultPropertyImage from '/default-property.jpeg';
import { formatPrice } from '@/utils/priceUtils';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/* ============================================
   OPTION 1: MODERN CINEMATIC PROPERTY CARD
   ============================================ */

export function PropertyCardOption1({ property, viewMode = 'grid' }) {
    const { t } = useTranslation();
    const { currentLang } = useAppSelector((state) => state.language);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const isArabic = currentLang === 'ar';
    const isRTL = currentLang === 'ar';

    const [showShare, setShowShare] = useState(false);

    const primaryPhone = contactPhones?.[0];
    const phoneNumber = primaryPhone?.phoneNumber || '';

    const title = isArabic ? property.titleAr : property.titleEn;
    const description = isArabic ? property.descriptionAr : property.descriptionEn;
    const cityName = isArabic ? property.location?.cityAr : property.location?.cityEn;
    const areaName = isArabic ? property.location?.areaAr : property.location?.areaEn;

    const imageUrl = property.images && property.images.length > 0
        ? property.images[0].imageUrl
        : defaultPropertyImage.src;

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        const propertyUrl = `${window.location.origin}/properties/${property.id}`;
        const location = areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName;
        const price = formatPrice(property.price, { t: t, currency: 'models.currency' });

        const message = `${t('properties.whatsappMessage.greeting', 'Hello! I am interested in this property:')}\n\n` +
            `${title}\n` +
            `${t('properties.whatsappMessage.location', 'Location')}: ${location}\n` +
            `${t('properties.whatsappMessage.price', 'Price')}: ${price}\n` +
            `${t('properties.whatsappMessage.bedrooms', 'Bedrooms')}: ${property.bedrooms || 0}\n` +
            `${t('properties.whatsappMessage.bathrooms', 'Bathrooms')}: ${property.bathrooms || 0}\n` +
            `${t('properties.whatsappMessage.area', 'Area')}: ${property.area || 0} ${t('properties.sqm', 'm²')}\n\n` +
            `${t('properties.whatsappMessage.link', 'View property')}: ${propertyUrl}`;

        return encodeURIComponent(message);
    };

    const handleWhatsAppClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const message = generateWhatsAppMessage();
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleCallClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleShare = async (e, platform) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}/properties/${property.id}`;
        const text = `Check out this property: ${title}`;

        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                break;
        }
        setShowShare(false);
    };

    // Grid View
    if (viewMode === 'grid') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <Link to={`/properties/${property.id}`}>
                    <div className="relative bg-secondary-950 overflow-hidden border border-secondary-800 hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl group">
                        {/* Diagonal Top Right Accent */}
                        <div
                            className="absolute top-0 inset-e-0 w-32 h-16 opacity-10"
                            style={{
                                background: `linear-gradient(${isRTL ? '225deg' : '135deg'}, var(--color-primary-500) 40%, transparent 40%)`,
                            }}
                        />

                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden">
                            <motion.img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                onError={(e) => {
                                    e.target.src = defaultPropertyImage.src;
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-secondary-950/80 via-transparent to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute top-3 inset-s-3 flex flex-col gap-2">
                                {property.propertyStatusName && (
                                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold shadow-lg">
                                        {property.propertyStatusName}
                                    </span>
                                )}
                                {property.isFeatured && (
                                    <span className="px-3 py-1 bg-warning-500 text-white text-xs font-semibold shadow-lg">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-3 inset-e-3 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowShare(!showShare);
                                    }}
                                    className="w-10 h-10 bg-secondary-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-secondary-700 transition-all hover:scale-110"
                                >
                                    <FiShare2 className="text-lg text-neutral-300" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Property Type Badge */}
                            {property.propertyTypeName && (
                                <div className="flex items-center gap-2 mb-3">
                                    <FiHome className="w-4 h-4 text-primary-500" />
                                    <span className="text-xs text-neutral-400 uppercase tracking-wider">
                                        {property.propertyTypeName}
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors font-serif">
                                {title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-sm text-neutral-400 mb-4">
                                <FiMapPin className="w-4 h-4 me-2 shrink-0" />
                                <span className="line-clamp-1">
                                    {areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName}
                                </span>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="text-center p-2 bg-secondary-800">
                                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-white">
                                        <FaBed className="w-4 h-4" />
                                        {property.bedrooms || 0}
                                    </div>
                                    <div className="text-xs text-neutral-400 mt-1">Beds</div>
                                </div>
                                <div className="text-center p-2 bg-secondary-800">
                                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-white">
                                        <FaBath className="w-4 h-4" />
                                        {property.bathrooms || 0}
                                    </div>
                                    <div className="text-xs text-neutral-400 mt-1">Baths</div>
                                </div>
                                <div className="text-center p-2 bg-secondary-800">
                                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-white">
                                        <FiMaximize className="w-4 h-4" />
                                        {property.area ? property.area.toLocaleString() : 0}
                                    </div>
                                    <div className="text-xs text-neutral-400 mt-1">Sq m</div>
                                </div>
                            </div>

                            {/* WhatsApp and Call Buttons */}
                            {phoneNumber && (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button
                                        onClick={handleWhatsAppClick}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-success-500 hover:bg-success-600 text-white font-medium transition-colors"
                                    >
                                        <FaWhatsapp className="w-4 h-4" />
                                        <span className="text-sm">WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={handleCallClick}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-info-500 hover:bg-info-600 text-white font-medium transition-colors"
                                    >
                                        <FiPhone className="w-4 h-4" />
                                        <span className="text-sm">Call</span>
                                    </button>
                                </div>
                            )}

                            {/* Price and CTA */}
                            <div className="pt-4 border-t border-secondary-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold text-primary-500">
                                        {formatPrice(property.price, {
                                            t: t,
                                            currency: 'models.currency'
                                        })}
                                    </div>
                                    {property.transactionTypeName && (
                                        <div className="text-xs text-neutral-400 mt-1">
                                            {property.transactionTypeName}
                                        </div>
                                    )}
                                </div>
                                <button className="flex items-center gap-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors group/btn">
                                    <span>View</span>
                                    <FiChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Share Menu Popup */}
                <AnimatePresence>
                    {showShare && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-14 inset-e-3 z-50 bg-secondary-900 shadow-2xl border border-secondary-700 p-3 min-w-48"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-secondary-800">
                                <span className="text-sm font-semibold text-white">Share Property</span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowShare(false);
                                    }}
                                    className="text-neutral-400 hover:text-white"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={(e) => handleShare(e, 'whatsapp')}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary-800 transition-colors text-start"
                                >
                                    <FaWhatsapp className="w-5 h-5 text-success-500" />
                                    <span className="text-sm text-neutral-300">WhatsApp</span>
                                </button>
                                <button
                                    onClick={(e) => handleShare(e, 'facebook')}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary-800 transition-colors text-start"
                                >
                                    <svg className="w-5 h-5 text-info-500" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm text-neutral-300">Facebook</span>
                                </button>
                                <button
                                    onClick={(e) => handleShare(e, 'twitter')}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary-800 transition-colors text-start"
                                >
                                    <svg className="w-5 h-5 text-sky-500" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    <span className="text-sm text-neutral-300">Twitter</span>
                                </button>
                                <button
                                    onClick={(e) => handleShare(e, 'copy')}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary-800 transition-colors text-start"
                                >
                                    <FiShare2 className="w-5 h-5 text-neutral-400" />
                                    <span className="text-sm text-neutral-300">Copy Link</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }

    // List View - Similar changes applied
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative group"
        >
            <Link to={`/properties/${property.id}`}>
                <div className="relative bg-secondary-950 overflow-hidden border border-secondary-800 hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Container */}
                        <div className="relative md:w-64 h-56 md:h-auto overflow-hidden shrink-0">
                            <motion.img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                onError={(e) => {
                                    e.target.src = defaultPropertyImage.src;
                                }}
                            />

                            {/* Badges */}
                            <div className="absolute top-3 inset-s-3 flex flex-col gap-2">
                                {property.propertyStatusName && (
                                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-semibold">
                                        {property.propertyStatusName}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors font-serif">
                                            {title}
                                        </h3>
                                        <div className="flex items-center text-sm text-neutral-400">
                                            <FiMapPin className="w-4 h-4 me-2 shrink-0" />
                                            <span>
                                                {areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-2xl font-bold text-primary-500">
                                            {formatPrice(property.price, {
                                                t: t,
                                                currency: 'models.currency'
                                            })}
                                        </div>
                                        {property.transactionTypeName && (
                                            <div className="text-sm text-neutral-400 mt-1">
                                                {property.transactionTypeName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {description && (
                                    <p className="text-neutral-400 mb-4 line-clamp-2 grow">
                                        {description}
                                    </p>
                                )}

                                {/* Features */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="flex items-center gap-3 p-3 bg-secondary-800">
                                        <FaBed className="w-5 h-5 text-primary-500" />
                                        <div>
                                            <div className="font-bold text-white">
                                                {property.bedrooms || 0}
                                            </div>
                                            <div className="text-xs text-neutral-400">
                                                Beds
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary-800">
                                        <FaBath className="w-5 h-5 text-primary-500" />
                                        <div>
                                            <div className="font-bold text-white">
                                                {property.bathrooms || 0}
                                            </div>
                                            <div className="text-xs text-neutral-400">
                                                Baths
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-secondary-800">
                                        <FiMaximize className="w-5 h-5 text-primary-500" />
                                        <div>
                                            <div className="font-bold text-white">
                                                {property.area ? property.area.toLocaleString() : 0}
                                            </div>
                                            <div className="text-xs text-neutral-400">
                                                Sq m
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp and Call Buttons */}
                                {phoneNumber && (
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-success-500 hover:bg-success-600 text-white font-medium transition-colors"
                                        >
                                            <FaWhatsapp className="w-5 h-5" />
                                            <span>WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={handleCallClick}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-info-500 hover:bg-info-600 text-white font-medium transition-colors"
                                        >
                                            <FiPhone className="w-5 h-5" />
                                            <span>Call</span>
                                        </button>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-secondary-800">
                                    <div className="flex items-center gap-3">
                                        {property.propertyTypeName && (
                                            <div className="flex items-center gap-1 text-sm text-neutral-400">
                                                <FiHome className="w-4 h-4" />
                                                {property.propertyTypeName}
                                            </div>
                                        )}
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors group/btn">
                                        <span>View Details</span>
                                        <FiChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// NOTE: The same changes need to be applied to PropertyCardOption2, PropertyCardOption3, and PropertyCardOption4
// I'll show the complete implementation for Option 3 as an example (since it matches your homepage)

/* ============================================
   OPTION 3: SOFT ORGANIC PROPERTY CARD (COMPLETE)
   ============================================ */


export function PropertyCardOption3({ property, viewMode = 'grid' }) {
    const { t } = useTranslation();
    const { currentLang } = useAppSelector((state) => state.language);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const isArabic = currentLang === 'ar';
    const isRTL = currentLang === 'ar';

    const [showShare, setShowShare] = useState(false);

    const primaryPhone = contactPhones?.[0];
    const phoneNumber = primaryPhone?.phoneNumber || '';

    const title = isArabic ? property.titleAr : property.titleEn;
    const description = isArabic ? property.descriptionAr : property.descriptionEn;
    const cityName = isArabic ? property.location?.cityAr : property.location?.cityEn;
    const areaName = isArabic ? property.location?.areaAr : property.location?.areaEn;

    const imageUrl = property.images && property.images.length > 0
        ? property.images[0].imageUrl
        : defaultPropertyImage.src;

    // ─── Tracking helpers ────────────────────────────────────────────────────
    const trackCardView = () => {
        metaPixelEvents.viewProperty(
            property.id,
            title,
            property.propertyTypeName || 'property',
            property.price,
            'EGP'
        );
    };

    const trackCTAClick = (ctaName) => {
        metaPixelEvents.ctaClick(
            ctaName,
            `/properties/${property.id}`,
            viewMode === 'list' ? 'property_card_list' : 'property_card_grid'
        );
    };
    // ─────────────────────────────────────────────────────────────────────────

    // Generate WhatsApp message
    const generateWhatsAppMessage = () => {
        const propertyUrl = `${window.location.origin}/properties/${property.id}`;
        const location = areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName;
        const price = formatPrice(property.price, { t: t, currency: 'models.currency' });

        const message = `${t('properties.whatsappMessage.greeting', 'Hello! I am interested in this property:')}\n\n` +
            `${title}\n` +
            `${t('properties.whatsappMessage.location', 'Location')}: ${location}\n` +
            `${t('properties.whatsappMessage.price', 'Price')}: ${price}\n` +
            `${t('properties.whatsappMessage.bedrooms', 'Bedrooms')}: ${property.bedrooms || 0}\n` +
            `${t('properties.whatsappMessage.bathrooms', 'Bathrooms')}: ${property.bathrooms || 0}\n` +
            `${t('properties.whatsappMessage.area', 'Area')}: ${property.area || 0} ${t('properties.sqm', 'm²')}\n\n` +
            `${t('properties.whatsappMessage.link', 'View property')}: ${propertyUrl}`;

        return encodeURIComponent(message);
    };

    const handleWhatsAppClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Track WhatsApp contact event with property context
        metaPixelEvents.whatsappClick(phoneNumber, viewMode === 'list' ? 'property_card_list' : 'property_card_grid');
        metaPixelEvents.contact('whatsapp', {
            property_id: property.id,
            property_name: title,
            property_price: property.price,
        });

        const message = generateWhatsAppMessage();
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleCallClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Track phone call contact event with property context
        metaPixelEvents.phoneClick(phoneNumber, viewMode === 'list' ? 'property_card_list' : 'property_card_grid');
        metaPixelEvents.contact('phone', {
            property_id: property.id,
            property_name: title,
            property_price: property.price,
        });

        window.location.href = `tel:${phoneNumber}`;
    };

    // Grid View
    if (viewMode === 'grid') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {/* Card wraps in Link — track on click */}
                <Link
                    to={`/properties/${property.id}`}
                    onClick={trackCardView}
                >
                    <div className="relative bg-white rounded-2xl overflow-hidden border border-primary-300/50 hover:border-primary-500/70 transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden">
                            <motion.img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-primary-900/40 via-transparent to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute top-4 inset-s-4 flex gap-2">
                                {property.propertyStatusName && (
                                    <span className="px-4 py-2 bg-white/80 backdrop-blur-sm text-primary-700 text-sm font-semibold rounded-full shadow-lg">
                                        {property.propertyStatusName}
                                    </span>
                                )}
                            </div>

                            {/* Price Badge */}
                            <div className="absolute bottom-4 inset-s-4 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                                <div className="text-xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                                    {formatPrice(property.price, { t: t, currency: 'models.currency' })}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
                                {title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-sm text-neutral-700 mb-4">
                                <FiMapPin className="w-4 h-4 me-2 shrink-0 text-primary-600" />
                                <span className="line-clamp-1">
                                    {areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName}
                                </span>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                                        <FaBed className="w-4 h-4 text-primary-700" />
                                        {property.bedrooms || 0}
                                    </div>
                                    {/* <div className="text-xs text-neutral-700 mt-1">{t("properties.beds")}</div> */}
                                </div>
                                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                                        <FaBath className="w-4 h-4 text-primary-700" />
                                        {property.bathrooms || 0}
                                    </div>
                                    {/* <div className="text-xs text-neutral-700 mt-1">{t("properties.baths")}</div> */}
                                </div>
                                <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                                        <FiMaximize className="w-4 h-4 text-primary-700" />
                                        {property.area ? property.area.toLocaleString() : 0}
                                    </div>
                                    {/* <div className="text-xs text-neutral-700 mt-1">{t("properties.sqm")}</div> */}
                                </div>
                            </div>

                            {/* WhatsApp and Call Buttons */}
                            {phoneNumber && (
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button
                                        onClick={handleWhatsAppClick}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-success-500 hover:bg-success-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-md"
                                    >
                                        <FaWhatsapp className="w-4 h-4" />
                                        <span className="text-sm">WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={handleCallClick}
                                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-info-500 hover:bg-info-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-md"
                                    >
                                        <FiPhone className="w-4 h-4" />
                                        <span className="text-sm">Call</span>
                                    </button>
                                </div>
                            )}

                            {/* View Property Button — tracked as CTA, stops propagation to avoid double-tracking */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    trackCTAClick('View Property');
                                    window.location.href = `/properties/${property.id}`;
                                }}
                                className="w-full py-3 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 group/btn"
                            >
                                <span>{t("properties.viewProperty")}</span>
                                <FiChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // List View
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {/* Card wraps in Link — track on click */}
            <Link
                to={`/properties/${property.id}`}
                onClick={trackCardView}
            >
                <div className="relative bg-linear-to-br from-primary-50 to-accent-50 rounded-2xl overflow-hidden border border-primary-300/50 hover:border-primary-500/70 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Container */}
                        <div className="relative md:w-64 h-56 md:h-auto overflow-hidden shrink-0">
                            <motion.img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-primary-900/40 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {property.propertyStatusName && (
                                                <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-primary-700 text-sm font-semibold rounded-full">
                                                    {property.propertyStatusName}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1">
                                            {title}
                                        </h3>
                                        <div className="flex items-center text-sm text-neutral-700">
                                            <FiMapPin className="w-4 h-4 me-2 shrink-0 text-primary-600" />
                                            <span>
                                                {areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-2xl font-bold bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                                            {formatPrice(property.price, { t: t, currency: 'models.currency' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {description && (
                                    <p className="text-neutral-700 mb-4 line-clamp-2 grow">
                                        {description}
                                    </p>
                                )}

                                {/* Features */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                        <FaBed className="w-5 h-5 text-primary-700" />
                                        <div>
                                            <div className="font-bold text-neutral-900">{property.bedrooms || 0}</div>
                                            <div className="text-xs text-neutral-700">{t("properties.beds")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                        <FaBath className="w-5 h-5 text-primary-700" />
                                        <div>
                                            <div className="font-bold text-neutral-900">{property.bathrooms || 0}</div>
                                            <div className="text-xs text-neutral-700">{t("properties.baths")}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-300/50">
                                        <FiMaximize className="w-5 h-5 text-primary-700" />
                                        <div>
                                            <div className="font-bold text-neutral-900">
                                                {property.area ? property.area.toLocaleString() : 0}
                                            </div>
                                            <div className="text-xs text-neutral-700">{t("properties.sqm")}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp and Call Buttons */}
                                {phoneNumber && (
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button
                                            onClick={handleWhatsAppClick}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-success-500 hover:bg-success-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-md"
                                        >
                                            <FaWhatsapp className="w-5 h-5" />
                                            <span>WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={handleCallClick}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-info-500 hover:bg-info-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-md"
                                        >
                                            <FiPhone className="w-5 h-5" />
                                            <span>Call</span>
                                        </button>
                                    </div>
                                )}

                                {/* Footer with Details CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-primary-300/50">
                                    <div className="flex items-center gap-2">
                                        <FiHome className="w-4 h-4 text-primary-700" />
                                        <span className="text-sm text-neutral-700">
                                            {property.propertyTypeName}
                                        </span>
                                    </div>
                                    {/* Details CTA — tracked separately, stops Link propagation */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            trackCTAClick('View Details');
                                            window.location.href = `/properties/${property.id}`;
                                        }}
                                        className="px-6 py-2 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-primary-500/30 flex items-center gap-2 group/btn"
                                    >
                                        <span>{t("properties.details")}</span>
                                        <FiChevronRight className={`w-4 h-4 ${isRTL ? " rotate-180 " : ""} group-hover/btn:translate-x-1 transition-transform`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Main PropertyCard component with option selector
export const PropertyCard = ({ property, viewMode = 'grid', designOption = 1 }) => {
    switch (designOption) {
        case 1:
            return <PropertyCardOption1 property={property} viewMode={viewMode} />;
        case 3:
            return <PropertyCardOption3 property={property} viewMode={viewMode} />;
        default:
            return <PropertyCardOption1 property={property} viewMode={viewMode} />;
    }
};