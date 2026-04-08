import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchSocialMediaLinks } from '@/store/slices/socialMediaLinksSlice';
import { fetchContactPhones } from '@/store/slices/contactPhoneSlice';
import { fetchContactEmails } from '@/store/slices/contactEmailSlice';
import { fetchAddresses } from '@/store/slices/addressSlice';
import { fetchPropertyTypes } from '@/store/slices/propertyTypeSlice';
import { TrackedEmailLink, TrackedLink, TrackedPhoneLink } from '../tracking';

/* ============================================
   OPTION 1: MODERN CINEMATIC FOOTER
   ============================================
   Matches Hero Option 1:
   - Dark background
   - Bronze accent highlights
   - Diagonal elements
   - Sophisticated editorial feel
*/

export function FooterOption1() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // Redux state
    const { socialMediaLinks } = useAppSelector((state) => state.socialMediaLinks);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);

    const socialLinks = socialMediaLinks?.[0];
    const primaryPhone = contactPhones?.[0];
    const primaryEmail = contactEmails?.[0];
    const primaryAddress = addresses?.[0];

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]);

    // Helper to get localized text
    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    // Dynamic social media links array
    const dynamicSocialLinks = [];
    if (socialLinks) {
        if (socialLinks.facebookIsActive && socialLinks.facebookUrl) {
            dynamicSocialLinks.push({ icon: FiFacebook, href: socialLinks.facebookUrl, name: 'Facebook' });
        }
        if (socialLinks.twitterIsActive && socialLinks.twitterUrl) {
            dynamicSocialLinks.push({ icon: FiTwitter, href: socialLinks.twitterUrl, name: 'Twitter' });
        }
        if (socialLinks.instagramIsActive && socialLinks.instagramUrl) {
            dynamicSocialLinks.push({ icon: FiInstagram, href: socialLinks.instagramUrl, name: 'Instagram' });
        }
        if (socialLinks.linkedInIsActive && socialLinks.linkedInUrl) {
            dynamicSocialLinks.push({ icon: FiLinkedin, href: socialLinks.linkedInUrl, name: 'LinkedIn' });
        }
        if (socialLinks.youTubeIsActive && socialLinks.youTubeUrl) {
            dynamicSocialLinks.push({ icon: FiYoutube, href: socialLinks.youTubeUrl, name: 'YouTube' });
        }
    }

    const links = [
        { href: '/', label: t('navigation.home') },
        { href: '/properties', label: t('navigation.properties') },
        { href: '/about-us', label: t('navigation.about') },
        { href: '/contact-us', label: t('navigation.contact') }
    ];

    return (
        <footer className="relative bg-secondary-950 text-neutral-300 border-t border-primary-500/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 object-contain"
                            />
                            <div className="h-px flex-1 bg-primary-500/30" />
                        </div>
                        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                            {t('footer.description', 'Your trusted partner in finding the perfect home. We make real estate dreams come true with innovative technology and personalized service.')}
                        </p>
                        {dynamicSocialLinks.length > 0 && (
                            <div className="flex gap-2">
                                {dynamicSocialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-secondary-800 hover:bg-primary-600 border border-secondary-700 p-2 rounded hover:scale-110 transition-all duration-300"
                                        title={social.name}
                                    >
                                        <social.icon size={16} className="text-neutral-400 hover:text-white transition-colors" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                            <span className="w-6 h-px bg-primary-500" />
                            {t('footer.quickLinks', 'Quick Links')}
                        </h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-neutral-400 hover:text-primary-500 transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <FiChevronRight className={`text-primary-500 ${isRTL ? 'rotate-180' : ''}`} size={14} />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types - Dynamic from Redux */}
                    {propertyTypes && propertyTypes.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                                <span className="w-6 h-px bg-primary-500" />
                                {t('footer.propertyTypes', 'Property Types')}
                            </h3>
                            <ul className="space-y-3">
                                {propertyTypes.slice(0, 4).map((type) => (
                                    <li key={type.id}>
                                        <Link
                                            to={`/properties?propertyTypeId=${type.id}&page=1`}
                                            className="text-neutral-400 hover:text-primary-500 transition-colors flex items-center gap-2 group text-sm"
                                        >
                                            <FiChevronRight className={`text-primary-500 ${isRTL ? 'rotate-180' : ''}`} size={14} />
                                            {getLocalizedText(type, 'name')}
                                        </Link>
                                    </li>
                                ))}
                                {propertyTypes.length > 6 && (
                                    <li>
                                        <Link
                                            to="/properties?page=1"
                                            className="text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-2 group text-sm font-medium"
                                        >
                                            <FiChevronRight className={`${isRTL ? 'rotate-180' : ''}`} size={14} />
                                            {t('footer.viewAll', 'View All')}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                            <span className="w-6 h-px bg-primary-500" />
                            {t('footer.contactUs', 'Contact Us')}
                        </h3>
                        <ul className="space-y-4">
                            {/* Address */}
                            {primaryAddress ? (
                                <li className="flex items-start gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiMapPin className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-neutral-400 leading-relaxed">
                                        {isRTL ? primaryAddress.streetAr : primaryAddress.streetEn}
                                        {(primaryAddress.cityEn || primaryAddress.cityAr) && (
                                            <>
                                                <br />
                                                {isRTL ? primaryAddress.cityAr : primaryAddress.cityEn}
                                                {(primaryAddress.countryEn || primaryAddress.countryAr) &&
                                                    `, ${isRTL ? primaryAddress.countryAr : primaryAddress.countryEn}`
                                                }
                                            </>
                                        )}
                                    </span>
                                </li>
                            ) : (
                                <li className="flex items-start gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiMapPin className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-neutral-400 leading-relaxed">
                                        123 Real Estate Blvd<br />
                                        New York, NY 10001
                                    </span>
                                </li>
                            )}

                            {/* Phone */}
                            {primaryPhone ? (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiPhone className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`tel:${primaryPhone.phoneNumber}`}
                                        className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
                                    >
                                        {primaryPhone.phoneNumber}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiPhone className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <a href="tel:+15551234567" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                        +1 (555) 123-4567
                                    </a>
                                </li>
                            )}

                            {/* Email */}
                            {primaryEmail ? (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiMail className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`mailto:${primaryEmail.email}`}
                                        className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
                                    >
                                        {primaryEmail.email}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-secondary-800 p-2 rounded border border-secondary-700">
                                        <FiMail className="text-primary-500 shrink-0" size={16} />
                                    </div>
                                    <a href="mailto:info@dreamhome.com" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                                        info@dreamhome.com
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-secondary-800 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-neutral-500">
                            &copy; {currentYear} {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                        </p>

                        {/* Add this line for company credit */}
                        <p className="text-sm text-neutral-600">
                            {t("footer.by")}  <a href="https://apex-software.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-400 transition-colors">Apex Software</a>
                        </p>

                        <div className="flex gap-6 text-sm">
                            <Link to="/privacy" className="text-neutral-400 hover:text-primary-500 transition-colors">
                                {t('footer.privacy', 'Privacy Policy')}
                            </Link>
                            <Link to="/terms" className="text-neutral-400 hover:text-primary-500 transition-colors">
                                {t('footer.terms', 'Terms of Service')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST FOOTER
   ============================================
   Matches Hero Option 2:
   - Bold borders and geometric layout
   - High contrast black/white
   - Offset shadow effect
   - Raw, unpolished aesthetic
*/

export function FooterOption2() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // Redux state
    const { socialMediaLinks } = useAppSelector((state) => state.socialMediaLinks);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);

    const socialLinks = socialMediaLinks?.[0];
    const primaryPhone = contactPhones?.[0];
    const primaryEmail = contactEmails?.[0];
    const primaryAddress = addresses?.[0];

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]);

    // Helper to get localized text
    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    // Dynamic social media links array
    const dynamicSocialLinks = [];
    if (socialLinks) {
        if (socialLinks.facebookIsActive && socialLinks.facebookUrl) {
            dynamicSocialLinks.push({ icon: FiFacebook, href: socialLinks.facebookUrl, name: 'Facebook' });
        }
        if (socialLinks.twitterIsActive && socialLinks.twitterUrl) {
            dynamicSocialLinks.push({ icon: FiTwitter, href: socialLinks.twitterUrl, name: 'Twitter' });
        }
        if (socialLinks.instagramIsActive && socialLinks.instagramUrl) {
            dynamicSocialLinks.push({ icon: FiInstagram, href: socialLinks.instagramUrl, name: 'Instagram' });
        }
        if (socialLinks.linkedInIsActive && socialLinks.linkedInUrl) {
            dynamicSocialLinks.push({ icon: FiLinkedin, href: socialLinks.linkedInUrl, name: 'LinkedIn' });
        }
        if (socialLinks.youTubeIsActive && socialLinks.youTubeUrl) {
            dynamicSocialLinks.push({ icon: FiYoutube, href: socialLinks.youTubeUrl, name: 'YouTube' });
        }
    }

    const links = [
        { href: '/', label: t('navigation.home') },
        { href: '/properties', label: t('navigation.properties') },
        { href: '/about-us', label: t('navigation.about') },
        { href: '/contact-us', label: t('navigation.contact') }
    ];

    return (
        <footer className="relative bg-neutral-50 text-third-900 border-t-4 border-neutral-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="relative">
                        <div className="mb-6">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 object-contain"
                            />
                        </div>
                        <p className="text-sm text-third-600 mb-6 leading-relaxed">
                            {t('footer.description', 'Your trusted partner in finding the perfect home. We make real estate dreams come true with innovative technology and personalized service.')}
                        </p>
                        {dynamicSocialLinks.length > 0 && (
                            <div className="flex gap-2">
                                {dynamicSocialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white border-2 border-neutral-900 p-2 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
                                        title={social.name}
                                    >
                                        <social.icon size={16} className="text-third-900" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="relative">
                        <h3 className="font-bold text-third-900 text-lg mb-6 border-b-2 border-neutral-900 pb-2">
                            {t('footer.quickLinks', 'Quick Links')}
                        </h3>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-third-600 hover:text-primary-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        <span className="w-2 h-2 bg-primary-600" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types - Dynamic from Redux */}
                    {propertyTypes && propertyTypes.length > 0 && (
                        <div className="relative">
                            <h3 className="font-bold text-third-900 text-lg mb-6 border-b-2 border-neutral-900 pb-2">
                                {t('footer.propertyTypes', 'Property Types')}
                            </h3>
                            <ul className="space-y-2">
                                {propertyTypes.slice(0, 4).map((type) => (
                                    <li key={type.id}>
                                        <Link
                                            to={`/properties?propertyTypeId=${type.id}&page=1`}
                                            className="text-third-600 hover:text-primary-600 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <span className="w-2 h-2 bg-primary-600" />
                                            {getLocalizedText(type, 'name')}
                                        </Link>
                                    </li>
                                ))}
                                {propertyTypes.length > 6 && (
                                    <li>
                                        <Link
                                            to="/properties?page=1"
                                            className="text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-2 text-sm font-bold"
                                        >
                                            <span className="w-3 h-0.5 bg-primary-600" />
                                            {t('footer.viewAll', 'View All')}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="relative">
                        <h3 className="font-bold text-third-900 text-lg mb-6 border-b-2 border-neutral-900 pb-2">
                            {t('footer.contactUs', 'Contact Us')}
                        </h3>
                        <ul className="space-y-4">
                            {/* Address */}
                            {primaryAddress ? (
                                <li className="flex items-start gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiMapPin className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-third-600 leading-relaxed">
                                        {isRTL ? primaryAddress.streetAr : primaryAddress.streetEn}
                                        {(primaryAddress.cityEn || primaryAddress.cityAr) && (
                                            <>
                                                <br />
                                                {isRTL ? primaryAddress.cityAr : primaryAddress.cityEn}
                                                {(primaryAddress.countryEn || primaryAddress.countryAr) &&
                                                    `, ${isRTL ? primaryAddress.countryAr : primaryAddress.countryEn}`
                                                }
                                            </>
                                        )}
                                    </span>
                                </li>
                            ) : (
                                <li className="flex items-start gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiMapPin className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-third-600 leading-relaxed">
                                        123 Real Estate Blvd<br />
                                        New York, NY 10001
                                    </span>
                                </li>
                            )}

                            {/* Phone */}
                            {primaryPhone ? (
                                <li className="flex items-center gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiPhone className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`tel:${primaryPhone.phoneNumber}`}
                                        className="text-sm text-third-600 hover:text-primary-600 transition-colors font-medium"
                                    >
                                        {primaryPhone.phoneNumber}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiPhone className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <a href="tel:+15551234567" className="text-sm text-third-600 hover:text-primary-600 transition-colors font-medium">
                                        +1 (555) 123-4567
                                    </a>
                                </li>
                            )}

                            {/* Email */}
                            {primaryEmail ? (
                                <li className="flex items-center gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiMail className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`mailto:${primaryEmail.email}`}
                                        className="text-sm text-third-600 hover:text-primary-600 transition-colors font-medium"
                                    >
                                        {primaryEmail.email}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3">
                                    <div className="border-2 border-neutral-900 p-2">
                                        <FiMail className="text-primary-600 shrink-0" size={16} />
                                    </div>
                                    <a href="mailto:info@dreamhome.com" className="text-sm text-third-600 hover:text-primary-600 transition-colors font-medium">
                                        info@dreamhome.com
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t-2 border-neutral-900 pt-6 relative">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-third-600 font-medium">
                            &copy; {currentYear} {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                        </p>

                        {/* Add this line for company credit */}
                        <p className="text-sm text-third-600">
                            {t("footer.by")}  <a href="https://apex-software.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 transition-colors font-medium">Apex Software</a>
                        </p>

                        <div className="flex gap-6 text-sm">
                            <Link to="/privacy" className="text-third-600 hover:text-primary-600 transition-colors font-medium">
                                {t('footer.privacy', 'Privacy Policy')}
                            </Link>
                            <Link to="/terms" className="text-third-600 hover:text-primary-600 transition-colors font-medium">
                                {t('footer.terms', 'Terms of Service')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC FOOTER
   ============================================
   Matches Hero Option 3:
   - Rounded corners and soft shadows
   - Warm bronze gradients
   - Glass morphism elements
   - Inviting, friendly aesthetic
*/

export function FooterOption3() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // Redux state
    const { socialMediaLinks } = useAppSelector((state) => state.socialMediaLinks);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);

    const socialLinks = socialMediaLinks?.[0];
    const primaryPhone = contactPhones?.[0];
    const primaryEmail = contactEmails?.[0];
    const primaryAddress = addresses?.[0];

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]);

    // Helper to get localized text
    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    // Dynamic social media links array
    const dynamicSocialLinks = [];
    if (socialLinks) {
        if (socialLinks.facebookIsActive && socialLinks.facebookUrl) {
            dynamicSocialLinks.push({ icon: FiFacebook, href: socialLinks.facebookUrl, name: 'Facebook' });
        }
        if (socialLinks.twitterIsActive && socialLinks.twitterUrl) {
            dynamicSocialLinks.push({ icon: FiTwitter, href: socialLinks.twitterUrl, name: 'Twitter' });
        }
        if (socialLinks.instagramIsActive && socialLinks.instagramUrl) {
            dynamicSocialLinks.push({ icon: FiInstagram, href: socialLinks.instagramUrl, name: 'Instagram' });
        }
        if (socialLinks.linkedInIsActive && socialLinks.linkedInUrl) {
            dynamicSocialLinks.push({ icon: FiLinkedin, href: socialLinks.linkedInUrl, name: 'LinkedIn' });
        }
        if (socialLinks.youTubeIsActive && socialLinks.youTubeUrl) {
            dynamicSocialLinks.push({ icon: FiYoutube, href: socialLinks.youTubeUrl, name: 'YouTube' });
        }
    }

    const links = [
        { href: '/', label: t('navigation.home') },
        { href: '/properties', label: t('navigation.properties') },
        { href: '/about-us', label: t('navigation.about') },
        { href: '/contact-us', label: t('navigation.contact') }
    ];

    return (
        <footer className="relative bg-linear-to-b from-primary-50 to-primary-100 text-neutral-800">
            {/* Decorative Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -inset-s-20 w-40 h-40 bg-primary-300/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -inset-e-20 w-40 h-40 bg-accent-300/20 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Company Info */}
                    <div>
                        <div className="mb-6">
                            {/* Logo — tracked as logo click */}
                            <TrackedLink
                                href="/"
                                trackEvent="logo"
                                trackLocation="footer"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="h-12 object-contain"
                                />
                            </TrackedLink>
                        </div>
                        <p className="text-sm text-neutral-700 mb-6 leading-relaxed">
                            {t('footer.description', 'Your trusted partner in finding the perfect home. We make real estate dreams come true with innovative technology and personalized service.')}
                        </p>

                        {/* Social media icons — tracked via TrackedLink with 'external' event */}
                        {dynamicSocialLinks.length > 0 && (
                            <div className="flex gap-2">
                                {dynamicSocialLinks.map((social, index) => (
                                    <TrackedLink
                                        key={index}
                                        href={social.href}
                                        trackName={social.name}
                                        trackLocation="footer"
                                        trackEvent="external"
                                        title={social.name}
                                        className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-full hover:bg-primary-500 hover:text-white hover:scale-110 transition-all duration-300"
                                    >
                                        <social.icon size={16} className="text-primary-600" />
                                    </TrackedLink>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 text-lg mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            {t('footer.quickLinks', 'Quick Links')}
                        </h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <TrackedLink
                                        href={link.href}
                                        trackName={link.label}
                                        trackLocation="footer"
                                        trackEvent="footer"
                                        className="text-neutral-700 hover:text-primary-700 transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <FiArrowRight
                                            className={`text-primary-500 ${isRTL ? 'rotate-180' : ''} opacity-0 group-hover:opacity-100 transition-all`}
                                            size={14}
                                        />
                                        {link.label}
                                    </TrackedLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types — tracked as footer nav links */}
                    {propertyTypes && propertyTypes.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-neutral-900 text-lg mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                                {t('footer.propertyTypes', 'Property Types')}
                            </h3>
                            <ul className="space-y-3">
                                {propertyTypes.slice(0, 4).map((type) => (
                                    <li key={type.id}>
                                        <TrackedLink
                                            href={`/properties?propertyTypeId=${type.id}&page=1`}
                                            trackName={getLocalizedText(type, 'name')}
                                            trackLocation="footer"
                                            trackEvent="footer"
                                            additionalParams={{ property_type_id: type.id }}
                                            className="text-neutral-700 hover:text-primary-700 transition-colors flex items-center gap-2 group text-sm"
                                        >
                                            <FiArrowRight
                                                className={`text-primary-500 ${isRTL ? 'rotate-180' : ''} opacity-0 group-hover:opacity-100 transition-all`}
                                                size={14}
                                            />
                                            {getLocalizedText(type, 'name')}
                                        </TrackedLink>
                                    </li>
                                ))}
                                {propertyTypes.length > 6 && (
                                    <li>
                                        <TrackedLink
                                            href="/properties?page=1"
                                            trackName="View All Property Types"
                                            trackLocation="footer"
                                            trackEvent="footer"
                                            className="text-primary-700 hover:text-primary-800 transition-colors flex items-center gap-2 group text-sm font-semibold"
                                        >
                                            <FiArrowRight className={`${isRTL ? 'rotate-180' : ''}`} size={14} />
                                            {t('footer.viewAll', 'View All')}
                                        </TrackedLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-neutral-900 text-lg mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                            {t('footer.contactUs', 'Contact Us')}
                        </h3>
                        <ul className="space-y-4">

                            {/* Address — not clickable, no tracking needed */}
                            {primaryAddress ? (
                                <li className="flex items-start gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiMapPin className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-neutral-700 leading-relaxed">
                                        {isRTL ? primaryAddress.streetAr : primaryAddress.streetEn}
                                        {(primaryAddress.cityEn || primaryAddress.cityAr) && (
                                            <>
                                                <br />
                                                {isRTL ? primaryAddress.cityAr : primaryAddress.cityEn}
                                                {(primaryAddress.countryEn || primaryAddress.countryAr) &&
                                                    `, ${isRTL ? primaryAddress.countryAr : primaryAddress.countryEn}`
                                                }
                                            </>
                                        )}
                                    </span>
                                </li>
                            ) : (
                                <li className="flex items-start gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiMapPin className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-neutral-700 leading-relaxed">
                                        123 Real Estate Blvd<br />
                                        New York, NY 10001
                                    </span>
                                </li>
                            )}

                            {/* Phone — tracked via TrackedPhoneLink */}
                            {primaryPhone ? (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiPhone className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <TrackedPhoneLink
                                        phoneNumber={primaryPhone.phoneNumber}
                                        location="footer"
                                        showIcon={false}
                                        className="text-sm text-neutral-700 hover:text-primary-700 transition-colors"
                                    />
                                </li>
                            ) : (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiPhone className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <TrackedPhoneLink
                                        phoneNumber="+15551234567"
                                        location="footer"
                                        showIcon={false}
                                        className="text-sm text-neutral-700 hover:text-primary-700 transition-colors"
                                    />
                                </li>
                            )}

                            {/* Email — tracked via TrackedEmailLink */}
                            {primaryEmail ? (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiMail className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <TrackedEmailLink
                                        email={primaryEmail.email}
                                        location="footer"
                                        showIcon={false}
                                        className="text-sm text-neutral-700 hover:text-primary-700 transition-colors"
                                    />
                                </li>
                            ) : (
                                <li className="flex items-center gap-3 group">
                                    <div className="bg-white/60 backdrop-blur-sm border border-primary-300/50 p-2 rounded-lg group-hover:bg-primary-500 transition-colors">
                                        <FiMail className="text-primary-600 group-hover:text-white shrink-0" size={16} />
                                    </div>
                                    <TrackedEmailLink
                                        email="info@dreamhome.com"
                                        location="footer"
                                        showIcon={false}
                                        className="text-sm text-neutral-700 hover:text-primary-700 transition-colors"
                                    />
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-primary-300/50 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-neutral-600">
                            &copy; {currentYear} {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                        </p>

                        {/* Company credit — tracked as external link */}
                        <p className="text-sm text-neutral-600">
                            {t("footer.by")}
                            <TrackedLink
                                href="https://apex-software.vercel.app/"
                                trackName="Apex Software"
                                trackLocation="footer"
                                trackEvent="external"
                                className="text-primary-700 hover:text-primary-800 transition-colors"
                            >
                                Apex Software
                            </TrackedLink>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM FOOTER
   ============================================
   Matches Hero Option 4:
   - Dark navy background with gradient orbs
   - Frosted glass elements
   - Professional depth
   - Modern tech aesthetic
*/

export function FooterOption4() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // Redux state
    const { socialMediaLinks } = useAppSelector((state) => state.socialMediaLinks);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);

    const socialLinks = socialMediaLinks?.[0];
    const primaryPhone = contactPhones?.[0];
    const primaryEmail = contactEmails?.[0];
    const primaryAddress = addresses?.[0];

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]);

    // Helper to get localized text
    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    // Dynamic social media links array
    const dynamicSocialLinks = [];
    if (socialLinks) {
        if (socialLinks.facebookIsActive && socialLinks.facebookUrl) {
            dynamicSocialLinks.push({ icon: FiFacebook, href: socialLinks.facebookUrl, name: 'Facebook' });
        }
        if (socialLinks.twitterIsActive && socialLinks.twitterUrl) {
            dynamicSocialLinks.push({ icon: FiTwitter, href: socialLinks.twitterUrl, name: 'Twitter' });
        }
        if (socialLinks.instagramIsActive && socialLinks.instagramUrl) {
            dynamicSocialLinks.push({ icon: FiInstagram, href: socialLinks.instagramUrl, name: 'Instagram' });
        }
        if (socialLinks.linkedInIsActive && socialLinks.linkedInUrl) {
            dynamicSocialLinks.push({ icon: FiLinkedin, href: socialLinks.linkedInUrl, name: 'LinkedIn' });
        }
        if (socialLinks.youTubeIsActive && socialLinks.youTubeUrl) {
            dynamicSocialLinks.push({ icon: FiYoutube, href: socialLinks.youTubeUrl, name: 'YouTube' });
        }
    }

    const links = [
        { href: '/', label: t('navigation.home') },
        { href: '/properties', label: t('navigation.properties') },
        { href: '/about-us', label: t('navigation.about') },
        { href: '/contact-us', label: t('navigation.contact') }
    ];

    return (
        <footer className="relative bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 text-accent-200 overflow-hidden">
            {/* Gradient Orbs */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -inset-s-20 w-60 h-60 bg-linear-to-r from-accent-500/10 to-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -inset-e-20 w-60 h-60 bg-linear-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="mb-6">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-12 object-contain"
                            />
                        </div>
                        <p className="text-sm text-accent-300/80 mb-6 leading-relaxed">
                            {t('footer.description', 'Your trusted partner in finding the perfect home. We make real estate dreams come true with innovative technology and personalized service.')}
                        </p>
                        {dynamicSocialLinks.length > 0 && (
                            <div className="flex gap-2">
                                {dynamicSocialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                        title={social.name}
                                    >
                                        <social.icon size={16} className="text-accent-200" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-linear-to-r from-primary-500 to-accent-500" />
                            {t('footer.quickLinks', 'Quick Links')}
                        </h3>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-accent-300 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                                    >
                                        <FiChevronRight className={`text-primary-400 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} size={14} />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types - Dynamic from Redux */}
                    {propertyTypes && propertyTypes.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-linear-to-r from-primary-500 to-accent-500" />
                                {t('footer.propertyTypes', 'Property Types')}
                            </h3>
                            <ul className="space-y-3">
                                {propertyTypes.slice(0, 4).map((type) => (
                                    <li key={type.id}>
                                        <Link
                                            to={`/properties?propertyTypeId=${type.id}&page=1`}
                                            className="text-accent-300 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                                        >
                                            <FiChevronRight className={`text-primary-400 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} size={14} />
                                            {getLocalizedText(type, 'name')}
                                        </Link>
                                    </li>
                                ))}
                                {propertyTypes.length > 6 && (
                                    <li>
                                        <Link
                                            to="/properties?page=1"
                                            className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 group text-sm font-medium"
                                        >
                                            <FiChevronRight className={`${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} size={14} />
                                            {t('footer.viewAll', 'View All')}
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-linear-to-r from-primary-500 to-accent-500" />
                            {t('footer.contactUs', 'Contact Us')}
                        </h3>
                        <ul className="space-y-4">
                            {/* Address */}
                            {primaryAddress ? (
                                <li className="flex items-start gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiMapPin className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-accent-300/80 leading-relaxed">
                                        {isRTL ? primaryAddress.streetAr : primaryAddress.streetEn}
                                        {(primaryAddress.cityEn || primaryAddress.cityAr) && (
                                            <>
                                                <br />
                                                {isRTL ? primaryAddress.cityAr : primaryAddress.cityEn}
                                                {(primaryAddress.countryEn || primaryAddress.countryAr) &&
                                                    `, ${isRTL ? primaryAddress.countryAr : primaryAddress.countryEn}`
                                                }
                                            </>
                                        )}
                                    </span>
                                </li>
                            ) : (
                                <li className="flex items-start gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiMapPin className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <span className="text-sm text-accent-300/80 leading-relaxed">
                                        123 Real Estate Blvd<br />
                                        New York, NY 10001
                                    </span>
                                </li>
                            )}

                            {/* Phone */}
                            {primaryPhone ? (
                                <li className="flex items-center gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiPhone className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`tel:${primaryPhone.phoneNumber}`}
                                        className="text-sm text-accent-300/80 hover:text-white transition-colors"
                                    >
                                        {primaryPhone.phoneNumber}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiPhone className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <a href="tel:+15551234567" className="text-sm text-accent-300/80 hover:text-white transition-colors">
                                        +1 (555) 123-4567
                                    </a>
                                </li>
                            )}

                            {/* Email */}
                            {primaryEmail ? (
                                <li className="flex items-center gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiMail className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <a
                                        href={`mailto:${primaryEmail.email}`}
                                        className="text-sm text-accent-300/80 hover:text-white transition-colors"
                                    >
                                        {primaryEmail.email}
                                    </a>
                                </li>
                            ) : (
                                <li className="flex items-center gap-3">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                                        <FiMail className="text-primary-400 shrink-0" size={16} />
                                    </div>
                                    <a href="mailto:info@dreamhome.com" className="text-sm text-accent-300/80 hover:text-white transition-colors">
                                        info@dreamhome.com
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-accent-400/60">
                            &copy; {currentYear} {t('footer.copyright', 'DreamHome Real Estate. All rights reserved.')}
                        </p>

                        {/* Add this line for company credit */}
                        <p className="text-sm text-accent-400/60">
                            {t("footer.by")} <a href="https://apex-software.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">Apex Software</a>
                        </p>

                        <div className="flex gap-6 text-sm">
                            <Link to="/privacy" className="text-accent-400/80 hover:text-white transition-colors">
                                {t('footer.privacy', 'Privacy Policy')}
                            </Link>
                            <Link to="/terms" className="text-accent-400/80 hover:text-white transition-colors">
                                {t('footer.terms', 'Terms of Service')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Original footer component with option selector
export const Footer = ({ option = 3 }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentYear = new Date().getFullYear();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // Redux state
    const { socialMediaLinks } = useAppSelector((state) => state.socialMediaLinks);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { addresses } = useAppSelector((state) => state.address);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);

    // Fetch data on mount
    useEffect(() => {
        dispatch(fetchSocialMediaLinks({ pageSize: 1, pageNumber: 1 }));
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());
        dispatch(fetchAddresses());
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 20 }));
    }, [dispatch]);

    const getLocalizedText = (item, field) => {
        return isRTL ? item?.[`${field}Ar`] : item?.[`${field}En`];
    };

    // Prepare props for footer options
    const footerProps = {
        t,
        i18n,
        isRTL,
        getLocalizedText,
        socialMediaLinks: socialMediaLinks?.[0],
        contactPhones: contactPhones?.[0],
        contactEmails: contactEmails?.[0],
        addresses: addresses?.[0],
        propertyTypes,
        currentYear,
        links: [
            { href: '/', label: t('navigation.home') },
            { href: '/properties', label: t('navigation.properties') },
            { href: '/about-us', label: t('navigation.about') },
            { href: '/contact-us', label: t('navigation.contact') }
        ]
    };

    // Return selected footer option
    switch (option) {
        case 1:
            return <FooterOption1 />;
        case 2:
            return <FooterOption2 />;
        case 3:
            return <FooterOption3 />;
        case 4:
            return <FooterOption4 />;
        default:
            return <FooterOption1 />;
    }
};