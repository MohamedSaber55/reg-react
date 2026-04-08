// app/(main)/properties/[id]/PropertyDetailsClient.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPropertyById, clearCurrentProperty } from '@/store/slices/propertySlice';
import { fetchContactPhones } from '@/store/slices/contactPhoneSlice';
import { fetchContactEmails } from '@/store/slices/contactEmailSlice';
import { createTicket } from '@/store/slices/ticketSlice';
import { formatPrice, formatPriceFull } from '@/utils/priceUtils';
import { Alert } from '@/components/common/Alert';
import Loading from '@/components/layout/Loading';
import defaultPropertyImage from '/default-property.jpeg';
import {
    FiMapPin,
    FiMaximize,
    FiHome,
    FiCheckCircle,
    FiX,
    FiPhone,
    FiMail,
    FiShare2,
} from 'react-icons/fi';
import { FaBed, FaBath, FaCar, FaSwimmingPool, FaTree, FaShieldAlt, FaBuilding } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { FaElevator } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
// next/image removed;

export default function PropertyDetailsClient({ propertyId }) {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const resolvedPropertyId = typeof params?.id === 'string' && params.id !== 'placeholder'
        ? params.id
        : propertyId;
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const { currentProperty, operationLoading } = useAppSelector((state) => state.property);
    const { contactPhones } = useAppSelector((state) => state.contactPhone);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const { operationLoading: ticketLoading } = useAppSelector((state) => state.ticket);

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [alert, setAlert] = useState(null);

    // Get active images or use default
    const getActiveImages = () => {
        if (!currentProperty?.images || currentProperty.images.length === 0) {
            return [{
                id: 'default-image',
                imageUrl: defaultPropertyImage.src,
                isActive: true
            }];
        }

        const activeImages = currentProperty.images.filter(img => img.isActive);
        return activeImages.length > 0 ? activeImages : [{
            id: 'default-image',
            imageUrl: defaultPropertyImage.src,
            isActive: true
        }];
    };

    const activeImages = currentProperty ? getActiveImages() : [];

    // Formik validation schema
    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .min(2, t('property.nameMinLength', 'Name must be at least 2 characters'))
            .max(100, t('property.nameMaxLength', 'Name must be less than 100 characters'))
            .required(t('property.nameRequired', 'Name is required')),
        email: Yup.string()
            .trim()
            .email(t('property.emailInvalid', 'Email is invalid'))
            .required(t('property.emailRequired', 'Email is required')),
        phone: Yup.string()
            .trim()
            .matches(/^[\d\s+()-]+$/, t('property.phoneInvalid', 'Phone number is invalid'))
            .min(8, t('property.phoneMinLength', 'Phone must be at least 8 digits'))
            .required(t('property.phoneRequired', 'Phone is required')),
        message: Yup.string()
            .trim()
            .min(10, t('property.messageMinLength', 'Message must be at least 10 characters'))
            .max(1000, t('property.messageMaxLength', 'Message must be less than 1000 characters'))
            .required(t('property.messageRequired', 'Message is required'))
    });

    // Formik form
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            message: ''
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const property = currentProperty;
                const title = isRTL ? property.titleAr : property.titleEn;
                const cityName = isRTL ? property.location?.cityAr : property.location?.cityEn;
                const areaName = isRTL ? property.location?.areaAr : property.location?.areaEn;

                const formattedPrice = formatPriceFull(property.price, {
                    t: t,
                    currency: 'models.currency'
                });

                const detailedMessage = `
${values.message}

---
Property Inquiry Details:
---
Property: ${title}
Location: ${areaName ? `${areaName}, ` : ''}${cityName || 'N/A'}
Price: ${formattedPrice || 'N/A'}
Type: ${property.propertyTypeName || 'N/A'}
Area: ${property.area || 'N/A'} ${t('properties.sqm')}
Bedrooms: ${property.bedrooms || 'N/A'}
Bathrooms: ${property.bathrooms || 'N/A'}
Property ID: ${property.id}
                `.trim();

                const ticketData = {
                    name: values.name.trim(),
                    message: detailedMessage,
                    ticketReasonId: 1,
                    ticketStatusId: 1,
                    emails: [
                        {
                            address: values.email.trim()
                        }
                    ],
                    phones: [
                        {
                            number: values.phone.trim()
                        }
                    ]
                };

                await dispatch(createTicket(ticketData)).unwrap();

                setAlert({
                    type: 'success',
                    message: t('property.messageSentSuccess', 'Your message has been sent successfully! We will contact you soon.')
                });

                toast.success(
                    t('property.messageSentSuccess', 'Your message has been sent successfully! We will contact you soon.')
                );

                resetForm();

                setTimeout(() => {
                    setAlert(null);
                }, 10000);

            } catch (error) {
                console.error('Error submitting form:', error);

                setAlert({
                    type: 'error',
                    message: error || t('property.messageSentError', 'Failed to send message. Please try again.')
                });

                toast.error(
                    error || t('property.messageSentError', 'Failed to send message. Please try again.')
                );

                setTimeout(() => {
                    setAlert(null);
                }, 10000);
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(() => {
        if (resolvedPropertyId && resolvedPropertyId !== 'placeholder') {
            dispatch(fetchPropertyById(resolvedPropertyId));
        }
        dispatch(fetchContactPhones());
        dispatch(fetchContactEmails());

        return () => {
            dispatch(clearCurrentProperty());
        };
    }, [dispatch, resolvedPropertyId]);

    const displayPhones = contactPhones.slice(0, 2);
    const displayEmails = contactEmails.slice(0, 2);

    if (operationLoading || !currentProperty) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const property = currentProperty;
    const title = isRTL ? property.titleAr : property.titleEn;
    const description = isRTL ? property.descriptionAr : property.descriptionEn;
    const cityName = isRTL ? property.location?.cityAr : property.location?.cityEn;
    const areaName = isRTL ? property.location?.areaAr : property.location?.areaEn;
    const address = isRTL ? property.location?.addressAr : property.location?.addressEn;

    const displayPrice = formatPrice(property.price, {
        t: t,
        currency: 'models.currency'
    });

    const pricePerSqm = property.area && property.price
        ? formatPrice(property.price / property.area, {
            t: t,
            currency: 'models.currency'
        })
        : null;

    const hasDefaultImage = activeImages[0]?.id === 'default-image';

    const amenities = [
        { icon: FaBed, label: t('property.bedrooms'), value: property.bedrooms, show: true },
        { icon: FaBath, label: t('property.bathrooms'), value: property.bathrooms, show: true },
        { icon: FiMaximize, label: t('property.area'), value: `${property.area} ${t('properties.sqm')}`, show: true },
        { icon: FaBuilding, label: t('property.floors'), value: property.totalFloors, show: property.totalFloors > 0 },
        { icon: FaCar, label: t('property.parking'), value: t('property.available'), show: property.hasParking },
        { icon: FaSwimmingPool, label: t('property.pool'), value: t('property.available'), show: property.hasPool },
        { icon: FaTree, label: t('property.garden'), value: t('property.available'), show: property.hasGarden },
        { icon: FaElevator, label: t('property.elevator'), value: t('property.available'), show: property.hasElevator },
        { icon: FaShieldAlt, label: t('property.security'), value: t('property.available'), show: property.hasSecurity },
    ];

    const features = [
        { label: t('property.groundFloor'), value: property.isGroundFloor, show: true },
        { label: t('property.hasGarden'), value: property.hasGarden, show: property.hasGarden },
        { label: t('property.hasElevator'), value: property.hasElevator, show: property.hasElevator },
        { label: t('property.hasParking'), value: property.hasParking, show: property.hasParking },
        { label: t('property.hasPool'), value: property.hasPool, show: property.hasPool },
        { label: t('property.hasSecurity'), value: property.hasSecurity, show: property.hasSecurity },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Gallery Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {hasDefaultImage ? (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center">
                                        <div
                                            className="w-full h-full cursor-pointer"
                                            onClick={() => {
                                                setSelectedImageIndex(0);
                                                setShowFullImage(true);
                                            }}
                                        >
                                            <img src={defaultPropertyImage}
                                                alt={title}
                                                className="w-full h-full object-cover"
                                                width={1200}
                                                height={800} />
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white p-6 text-center">
                                            <div className="text-lg font-semibold mb-2">
                                                {t('property.noImagesAvailable', 'No Images Available')}
                                            </div>
                                            <div className="text-sm opacity-90">
                                                {t('property.defaultImageDisplayed', 'Default property image displayed')}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Swiper
                                            modules={[Navigation, Pagination, Thumbs]}
                                            navigation
                                            pagination={{ clickable: true }}
                                            dir={isRTL ? 'rtl' : 'ltr'}
                                            key={isRTL ? 'rtl' : 'ltr'}
                                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                            className="main-swiper rounded-2xl overflow-hidden"
                                            onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
                                        >
                                            {activeImages.map((image, index) => (
                                                <SwiperSlide key={image.id}>
                                                    <div
                                                        className="w-full aspect-video cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedImageIndex(index);
                                                            setShowFullImage(true);
                                                        }}
                                                    >
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={`${title} - Image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = defaultPropertyImage.src;
                                                            }}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>

                                        {activeImages.length > 1 && (
                                            <Swiper
                                                modules={[FreeMode, Thumbs]}
                                                onSwiper={setThumbsSwiper}
                                                spaceBetween={10}
                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                slidesPerView={4}
                                                freeMode={true}
                                                watchSlidesProgress={true}
                                                breakpoints={{
                                                    640: { slidesPerView: 5 },
                                                    768: { slidesPerView: 6 },
                                                    1024: { slidesPerView: 6 },
                                                }}
                                                className="thumbs-swiper"
                                            >
                                                {activeImages.map((image) => (
                                                    <SwiperSlide key={image.id}>
                                                        <div className="cursor-pointer rounded-lg overflow-hidden aspect-video border-2 border-transparent hover:border-primary-500 transition-all">
                                                            <img
                                                                src={image.imageUrl}
                                                                alt={title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = defaultPropertyImage.src;
                                                                }}
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {property.propertyStatusName && (
                                            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                                                {property.propertyStatusName}
                                            </span>
                                        )}
                                        {property.transactionTypeName && (
                                            <span className="px-3 py-1 bg-accent-100 text-accent-700 text-sm font-semibold rounded-full">
                                                {property.transactionTypeName}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-4xl font-bold text-third-900 mb-3 font-serif">
                                        {title}
                                    </h1>
                                    <p className="flex items-center gap-2 text-third-500 text-lg">
                                        <FiMapPin className="text-primary-600" />
                                        {address && `${address}, `}
                                        {areaName && cityName ? `${areaName}, ${cityName}` : cityName || areaName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-3 bg-neutral-100 rounded-xl hover:bg-primary-100 transition-all">
                                        <FiShare2 className="text-xl text-third-900" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-neutral-400">
                                <span className="text-4xl font-bold text-primary-600">
                                    {displayPrice}
                                </span>
                                {pricePerSqm && (
                                    <span className="text-sm text-third-500">
                                        ({pricePerSqm}/m²)
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            {amenities.filter(a => a.show && typeof a.value === 'number').map((amenity, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 text-center hover:shadow-lg transition-all"
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <amenity.icon className="text-2xl text-primary-600" />
                                    </div>
                                    <div className="text-2xl font-bold text-third-900 mb-1">
                                        {amenity.value}
                                    </div>
                                    <div className="text-sm text-third-500">
                                        {amenity.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Description */}
                        {description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                            >
                                <h2 className="text-2xl font-bold text-third-900 mb-4 font-serif flex items-center gap-2">
                                    <FiHome className="text-primary-600" />
                                    {t('property.description', 'Description')}
                                </h2>
                                <p className="text-third-500 leading-relaxed whitespace-pre-wrap">
                                    {description}
                                </p>
                            </motion.div>
                        )}

                        {/* Property Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                        >
                            <h2 className="text-2xl font-bold text-third-900 mb-6 font-serif">
                                {t('property.details', 'Property Details')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.propertyTypeName && (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                        <span className="text-third-500">
                                            {t('property.type', 'Property Type')}
                                        </span>
                                        <span className="font-semibold text-third-900">
                                            {property.propertyTypeName}
                                        </span>
                                    </div>
                                )}
                                {property.furnishingStatusName && (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                        <span className="text-third-500">
                                            {t('property.furnishing', 'Furnishing')}
                                        </span>
                                        <span className="font-semibold text-third-900">
                                            {property.furnishingStatusName}
                                        </span>
                                    </div>
                                )}
                                {property.finishingLevelName && (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                        <span className="text-third-500">
                                            {t('property.finishing', 'Finishing Level')}
                                        </span>
                                        <span className="font-semibold text-third-900">
                                            {property.finishingLevelName}
                                        </span>
                                    </div>
                                )}
                                {property.totalFloors > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                                        <span className="text-third-500">
                                            {t('property.totalFloors', 'Total Floors')}
                                        </span>
                                        <span className="font-semibold text-third-900">
                                            {property.totalFloors}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Amenities & Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                        >
                            <h2 className="text-2xl font-bold text-third-900 mb-6 font-serif">
                                {t('property.amenities', 'Amenities & Features')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {amenities.filter(a => a.show && typeof a.value === 'string').map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl"
                                    >
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <amenity.icon className="text-lg text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-third-900">
                                                {amenity.label}
                                            </div>
                                            <div className="text-sm text-third-500">
                                                {amenity.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {features.filter(f => f.show && f.value).map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl"
                                    >
                                        <FiCheckCircle className="text-2xl text-success-500" />
                                        <span className="font-medium text-third-900">
                                            {feature.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24 bg-neutral-50 rounded-2xl p-6 border border-neutral-400"
                        >
                            <h3 className="text-2xl font-bold text-third-900 mb-6 font-serif">
                                {t('property.contactAgent', 'Contact Agent')}
                            </h3>

                            {alert && (
                                <div className="mb-4">
                                    <Alert
                                        variant={alert.type}
                                        dismissible
                                        onDismiss={() => setAlert(null)}
                                    >
                                        {alert.message}
                                    </Alert>
                                </div>
                            )}

                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder={t('property.yourName', 'Your Name')}
                                        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.name && formik.errors.name
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all`}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder={t('property.yourEmail', 'Your Email')}
                                        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.email && formik.errors.email
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all`}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder={t('property.yourPhone', 'Your Phone')}
                                        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.phone && formik.errors.phone
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all`}
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formik.values.message}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows={4}
                                        placeholder={t('property.yourMessage', 'Your Message')}
                                        className={`w-full px-4 py-3 rounded-xl bg-neutral-50 border ${formik.touched.message && formik.errors.message
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all resize-none`}
                                    ></textarea>
                                    {formik.touched.message && formik.errors.message && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting || ticketLoading || !formik.isValid}
                                    className="w-full px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {formik.isSubmitting || ticketLoading
                                        ? t('property.sending', 'Sending...')
                                        : t('property.sendMessage', 'Send Message')
                                    }
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-neutral-400 space-y-3">
                                {displayPhones.map((phone) => (
                                    <a
                                        key={phone.id}
                                        href={`tel:${phone.phoneNumber}`}
                                        className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-all"
                                    >
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                                            <FiPhone className="text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-third-500">
                                                {t('property.callUs', 'Call Us')}
                                            </div>
                                            <div className="font-semibold text-third-900 truncate">
                                                {phone.phoneNumber}
                                            </div>
                                        </div>
                                    </a>
                                ))}

                                {displayEmails.map((email) => (
                                    <a
                                        key={email.id}
                                        href={`mailto:${email.email}`}
                                        className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-all"
                                    >
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                                            <FiMail className="text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-third-500">
                                                {t('property.emailUs', 'Email Us')}
                                            </div>
                                            <div className="font-semibold text-third-900 truncate">
                                                {email.email}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Full Image Modal */}
            <AnimatePresence>
                {showFullImage && activeImages.length > 0 && !hasDefaultImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowFullImage(false)}
                    >
                        <button
                            onClick={() => setShowFullImage(false)}
                            className="absolute top-4 inset-e-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                        >
                            <FiX className="text-2xl text-white" />
                        </button>

                        <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                initialSlide={selectedImageIndex}
                                className="full-image-swiper"
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                {activeImages.map((image) => (
                                    <SwiperSlide key={image.id}>
                                        <div className="flex items-center justify-center h-[80vh]">
                                            <img
                                                src={image.imageUrl}
                                                alt={title}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = defaultPropertyImage.src;
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Swiper Styles */}
            <style jsx global>{`
                .main-swiper .swiper-button-next,
                .main-swiper .swiper-button-prev,
                .full-image-swiper .swiper-button-next,
                .full-image-swiper .swiper-button-prev {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    padding: 12px;
                    color: var(--color-primary-600);
                }

                .main-swiper .swiper-button-next::after,
                .main-swiper .swiper-button-prev::after,
                .full-image-swiper .swiper-button-next::after,
                .full-image-swiper .swiper-button-prev::after {
                    font-size: 20px;
                    font-weight: bold;
                }

                .main-swiper .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.5;
                }

                .main-swiper .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: var(--color-primary-500);
                }

                .thumbs-swiper .swiper-slide-thumb-active {
                    opacity: 1;
                }

                .thumbs-swiper .swiper-slide-thumb-active > div {
                    border-color: var(--color-primary-500);
                }
            `}</style>
        </div>
    );
}