import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiStar,
    FiChevronLeft,
    FiChevronRight,
    FiX,
    FiUser,
    FiMapPin,
    FiCalendar,
    FiCheckCircle,
    FiThumbsUp
} from 'react-icons/fi';
import { LuQuote } from 'react-icons/lu';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { useTranslation } from 'react-i18next';

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/* ============================================
   TESTIMONIAL CARD COMPONENT (REUSABLE)
   ============================================ */
const TestimonialCard = ({
    testimonial,
    designOption = 1,
    isModal = false,
    onClick = null
}) => {
    if (!testimonial) return null;
    const { t } = useTranslation();
    // Extract testimonial data safely
    const getTestimonialData = () => {
        const baseData = {
            id: testimonial.id || Math.random().toString(36),
            name: testimonial.name || testimonial.clientName || 'Anonymous',
            comment: testimonial.comment || testimonial.feedback || testimonial.message || '',
            rating: testimonial.rating || testimonial.stars || 5,
            location: testimonial.location || testimonial.city || '',
            date: testimonial.date || testimonial.createdAt || '',
            avatar: testimonial.avatar || testimonial.imageUrl || '',
            role: testimonial.role || testimonial.position || '',
            verified: testimonial.verified || testimonial.isVerified || false,
            property: testimonial.property || testimonial.propertyName || '',
        };

        return baseData;
    };

    const data = getTestimonialData();

    // Design-specific styling
    const designStyles = {
        1: {
            // Modern Cinematic
            card: `bg-secondary-800 border border-secondary-700 overflow-hidden group hover:shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`,
            content: 'p-6',
            quoteIcon: 'text-primary-500 opacity-20',
            rating: 'text-warning-500 -warning-500',
            ratingEmpty: 'text-secondary-600',
            text: 'text-neutral-300 leading-relaxed',
            name: 'text-white font-semibold',
            meta: 'text-neutral-400 text-sm',
            avatar: 'bg-primary-500 text-white font-bold',
            divider: 'border-t border-secondary-700',
        },
        2: {
            // Minimal Brutalist
            card: `bg-neutral-50 border-4 border-neutral-900 overflow-hidden group hover:translate-x-1 hover:translate-y-1 transition-transform duration-300 ${onClick ? 'cursor-pointer' : ''}`,
            content: 'p-6',
            quoteIcon: 'text-primary-600 opacity-20',
            rating: 'text-warning-500 -warning-500',
            ratingEmpty: 'text-neutral-300',
            text: 'text-third-700 leading-relaxed min-h-[120px]',
            name: 'text-third-900 font-black',
            meta: 'text-third-600 text-sm',
            avatar: 'bg-primary-600 text-white font-bold border-4 border-neutral-900',
            divider: 'border-t-2 border-neutral-900',
        },
        3: {
            // Soft Organic
            card: `bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-primary-300/50 ${onClick ? 'cursor-pointer' : ''}`,
            content: 'p-6',
            quoteIcon: 'text-primary-600 opacity-20',
            rating: 'text-warning-500 -warning-500',
            ratingEmpty: 'text-neutral-300',
            text: 'text-neutral-700 leading-relaxed min-h-[100px]',
            name: 'text-primary-800 font-semibold',
            meta: 'text-neutral-600 text-sm',
            avatar: 'bg-linear-to-r from-primary-500 to-primary-600 text-white font-bold',
            divider: 'border-t border-primary-300/50',
        },
        4: {
            // Glass Morphism
            card: `bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden group hover:shadow-2xl hover:bg-white/15 transition-all duration-300 border border-white/20 ${onClick ? 'cursor-pointer' : ''}`,
            content: 'p-6',
            quoteIcon: 'text-primary-400 opacity-30',
            rating: 'text-warning-400 -warning-400',
            ratingEmpty: 'text-white/30',
            text: 'text-accent-200 leading-relaxed',
            name: 'text-white font-semibold',
            meta: 'text-accent-300 text-sm',
            avatar: 'bg-linear-to-r from-primary-500 to-accent-500 text-white font-bold border border-white/20',
            divider: 'border-t border-white/20',
        },
    };

    const style = designStyles[designOption] || designStyles[1];

    // For modal, adjust some styles
    const modalStyles = isModal ? {
        1: { card: 'bg-secondary-900' },
        2: { card: 'bg-neutral-50' },
        3: { card: 'bg-white' },
        4: { card: 'bg-white/20' },
    }[designOption] : {};

    return (
        <div
            className={`${style.card} ${modalStyles.card} h-full flex flex-col`}
            onClick={onClick}
        >
            <div className={style.content}>
                {/* Quote Icon */}
                <div className="mb-4">
                    <LuQuote className={`text-4xl ${style.quoteIcon}`} />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <FiStar
                            key={i}
                            className={`w-5 h-5 ${i < data.rating ? style.rating : style.ratingEmpty}`}
                        />
                    ))}
                    <span className={`ms-2 text-sm font-semibold ${designOption === 4 ? 'text-accent-200' : 'text-neutral-500'}`}>
                        {data.rating}/5
                    </span>
                </div>

                {/* Testimonial Text */}
                <div className="grow mb-6">
                    <p className={`${style.text} ${isModal ? 'text-lg' : 'text-base'}`}>
                        <span className="text-2xl text-primary-500 leading-none me-1">"</span>
                        {isModal ? data.comment : (data.comment.length > 150 ? `${data.comment.substring(0, 150)}...` : data.comment)}
                        <span className="text-2xl text-primary-500 leading-none ms-1">"</span>
                    </p>
                    {!isModal && data.comment.length > 150 && (
                        <button className={`text-primary-600 text-sm font-semibold mt-2 hover:underline ${designOption === 4 ? 'text-primary-400' : ''}`}>
                            {t('common.readMore', 'Read More')}
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className={style.divider}></div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-6">
                    {/* Avatar */}
                    <div className={`${style.avatar} w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
                        {data.avatar ? (
                            <img
                                src={data.avatar}
                                alt={data.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            data.name.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div className="grow">
                        <div className="flex items-center gap-2">
                            <h4 className={style.name}>{data.name}</h4>
                            {data.verified && (
                                <FiCheckCircle className={`text-sm ${designOption === 4 ? 'text-primary-400' : 'text-primary-500'}`} />
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {data.role && (
                                <span className={style.meta}>{data.role}</span>
                            )}
                            {data.location && (
                                <span className={`${style.meta} flex items-center gap-1`}>
                                    <FiMapPin className="text-xs" /> {data.location}
                                </span>
                            )}
                            {data.date && (
                                <span className={`${style.meta} flex items-center gap-1`}>
                                    <FiCalendar className="text-xs" /> {formatDate(data.date)}
                                </span>
                            )}
                        </div>

                        {data.property && (
                            <div className={`${style.meta} mt-1 flex items-center gap-1`}>
                                <FiHome className="text-xs" /> Property: {data.property}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ============================================
   OPTION 1: MODERN CINEMATIC TESTIMONIALS
   ============================================ */
export function TestimonialsOption1({
    testimonials,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    showStats = true,
    itemsPerView = { mobile: 1, tablet: 1, desktop: 3, large: 3 }
}) {
    const swiperRef = useRef(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    if (!testimonials || testimonials.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('testimonials.title', 'Client Testimonials') : t('testimonials.title', 'Client Testimonials');
    const subtitle = t('testimonials.subtitle', 'Hear from our satisfied customers');

    // Calculate stats
    const stats = {
        total: testimonials.length,
        averageRating: Math.round(testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length * 10) / 10,
        verified: testimonials.filter(t => t.verified || t.isVerified).length,
    };

    const openModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedTestimonial(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <section className="py-20 bg-secondary-950 relative overflow-hidden">
                {/* Diagonal Background Element */}
                <div
                    className="absolute top-0 inset-s-0 w-full h-32 opacity-10"
                    style={{
                        background: `linear-gradient(${isRTL ? '225deg' : '135deg'}, var(--color-primary-500) 40%, transparent 40%)`,
                    }}
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-primary-500" />
                            <FiThumbsUp className="text-primary-500 text-xl" />
                            <div className="h-px w-8 bg-primary-500" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
                            {title}
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Stats */}
                    {showStats && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-3 gap-4 mb-12"
                        >
                            <div className="bg-secondary-800 p-4 text-center">
                                <div className="text-2xl font-bold text-primary-500 mb-1">{stats.total}</div>
                                <div className="text-neutral-400 text-sm uppercase tracking-wider">Testimonials</div>
                            </div>
                            <div className="bg-secondary-800 p-4 text-center">
                                <div className="text-2xl font-bold text-primary-500 mb-1">{stats.averageRating}</div>
                                <div className="text-neutral-400 text-sm uppercase tracking-wider">Avg Rating</div>
                            </div>
                            <div className="bg-secondary-800 p-4 text-center">
                                <div className="text-2xl font-bold text-primary-500 mb-1">{stats.verified}</div>
                                <div className="text-neutral-400 text-sm uppercase tracking-wider">Verified</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Swiper */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-secondary-800 rounded-full shadow-xl border border-primary-500 items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                            aria-label={isRTL ? 'Previous' : 'Next'}
                        >
                            <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-secondary-800 rounded-full shadow-xl border border-primary-500 items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                            aria-label={isRTL ? 'Next' : 'Previous'}
                        >
                            <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={itemsPerView.mobile}
                            grabCursor={true}
                            speed={800}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            loop={testimonials.length > 3}
                            breakpoints={{
                                640: {
                                    slidesPerView: itemsPerView.tablet,
                                },
                                1024: {
                                    slidesPerView: itemsPerView.desktop,
                                },
                                1280: {
                                    slidesPerView: itemsPerView.large,
                                },
                            }}
                            className="pb-16"
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={testimonial?.id || index}>
                                    <TestimonialCard
                                        testimonial={testimonial}
                                        designOption={1}
                                        onClick={() => openModal(testimonial)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedTestimonial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-secondary-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-secondary-700"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 inset-e-4 w-10 h-10 rounded-full bg-secondary-800 border border-secondary-700 flex items-center justify-center text-white hover:bg-primary-500 transition-all hover:scale-110 z-10"
                                aria-label="Close modal"
                            >
                                <FiX className="text-xl" />
                            </button>

                            <div className="">
                                <TestimonialCard
                                    testimonial={selectedTestimonial}
                                    designOption={1}
                                    isModal={true}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST TESTIMONIALS
   ============================================ */
export function TestimonialsOption2({
    testimonials,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    showStats = true,
    itemsPerView = { mobile: 1, tablet: 1, desktop: 3, large: 3 }
}) {
    const swiperRef = useRef(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    if (!testimonials || testimonials.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('testimonials.title', 'Client Testimonials') : t('testimonials.title', 'Client Testimonials');
    const subtitle = t('testimonials.subtitle', 'Hear from our satisfied customers');

    const openModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedTestimonial(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <>
            <section className="py-20 bg-neutral-50 relative">
                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        {/* Section Badge */}
                        <div className="inline-block mb-6 px-6 py-2 bg-neutral-900 text-neutral-50 relative">
                            <span className="relative z-10 text-xs font-bold uppercase tracking-wider">
                                {t('testimonials.featured', 'TESTIMONIALS')}
                            </span>
                            <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2`} />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-third-900 mb-4 leading-tight tracking-tighter uppercase font-serif">
                            {title}
                        </h2>
                        <p className="text-xl text-third-600 max-w-2xl mx-auto font-medium">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Swiper */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-50 rounded-full shadow-xl border-4 border-neutral-900 items-center justify-center text-neutral-900 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Previous' : 'Next'}
                        >
                            <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-50 rounded-full shadow-xl border-4 border-neutral-900 items-center justify-center text-neutral-900 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Next' : 'Previous'}
                        >
                            <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={32}
                            slidesPerView={itemsPerView.mobile}
                            grabCursor={true}
                            speed={800}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: itemsPerView.tablet,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: itemsPerView.desktop,
                                    spaceBetween: 32,
                                },
                            }}
                            className="pb-16"
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={testimonial?.id || index}>
                                    <TestimonialCard
                                        testimonial={testimonial}
                                        designOption={2}
                                        onClick={() => openModal(testimonial)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedTestimonial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-4 border-neutral-900"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 inset-e-4 w-10 h-10 rounded-full bg-neutral-50 border-4 border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all hover:scale-110 z-10"
                                aria-label="Close modal"
                            >
                                <FiX className="text-xl" />
                            </button>

                            <div className="">
                                <TestimonialCard
                                    testimonial={selectedTestimonial}
                                    designOption={2}
                                    isModal={true}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC TESTIMONIALS
   ============================================ */
export function TestimonialsOption3({
    testimonials,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    showStats = true,
    itemsPerView = { mobile: 1, tablet: 1, desktop: 3, large: 3 }
}) {
    const swiperRef = useRef(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    if (!testimonials || testimonials.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('testimonials.title', 'Client Testimonials') : t('testimonials.title', 'Client Testimonials');
    const subtitle = t('testimonials.subtitle', 'Hear from our satisfied customers');

    return (
        <>
            <section className="py-20 bg-linear-to-b from-primary-50 to-accent-50 relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 inset-s-0 w-96 h-96 bg-linear-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 inset-e-0 w-96 h-96 bg-linear-to-tl from-accent-200/30 to-primary-200/30 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        {/* Badge */}
                        <div className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-4 border border-primary-300/50">
                            <span className="text-primary-700 font-semibold text-xs flex items-center gap-2">
                                <FiThumbsUp />
                                {t('testimonials.featured', 'Featured')}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Swiper */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full shadow-xl border border-primary-300/50 items-center justify-center text-primary-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Previous' : 'Next'}
                        >
                            <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full shadow-xl border border-primary-300/50 items-center justify-center text-primary-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Next' : 'Previous'}
                        >
                            <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                            effect="coverflow"
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 100,
                                modifier: 2.5,
                                slideShadows: false,
                            }}
                            spaceBetween={24}
                            slidesPerView={itemsPerView.mobile}
                            centeredSlides={true}
                            grabCursor={true}
                            speed={800}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            loop={testimonials.length > 3}
                            breakpoints={{
                                640: {
                                    slidesPerView: itemsPerView.tablet,
                                    effect: 'slide',
                                },
                                1024: {
                                    slidesPerView: itemsPerView.desktop,
                                    effect: 'coverflow',
                                },
                                1280: {
                                    slidesPerView: itemsPerView.large,
                                    effect: 'coverflow',
                                },
                            }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            key={isRTL ? 'rtl' : 'ltr'}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={testimonial?.id || index}>
                                    <TestimonialCard
                                        testimonial={testimonial}
                                        designOption={3}
                                        onClick={() => setSelectedTestimonial(testimonial)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedTestimonial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedTestimonial(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedTestimonial(null)}
                                className="absolute top-4 inset-e-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-primary-300/50 flex items-center justify-center text-primary-700 hover:bg-primary-500 hover:text-white transition-all hover:scale-110 z-10"
                                aria-label="Close modal"
                            >
                                <FiX className="text-xl" />
                            </button>

                            <div className="">
                                <TestimonialCard
                                    testimonial={selectedTestimonial}
                                    designOption={3}
                                    isModal={true}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM TESTIMONIALS
   ============================================ */
export function TestimonialsOption4({
    testimonials,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    showStats = true,
    itemsPerView = { mobile: 1, tablet: 1, desktop: 3, large: 3 }
}) {
    const swiperRef = useRef(null);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    if (!testimonials || testimonials.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('testimonials.title', 'Client Testimonials') : t('testimonials.title', 'Client Testimonials');
    const subtitle = t('testimonials.subtitle', 'Hear from our satisfied customers');

    return (
        <>
            <section className="py-20 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 relative overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        {/* Badge */}
                        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/20">
                            <span className="text-accent-200 font-semibold text-xs flex items-center gap-2">
                                <FiAward className="text-primary-400" />
                                {t('testimonials.premium', 'Premium Reviews')}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-lg text-accent-200 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Swiper */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center text-accent-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Previous' : 'Next'}
                        >
                            <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center text-accent-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110"
                            aria-label={isRTL ? 'Next' : 'Previous'}
                        >
                            <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={itemsPerView.mobile}
                            grabCursor={true}
                            speed={800}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: itemsPerView.tablet,
                                },
                                1024: {
                                    slidesPerView: itemsPerView.desktop,
                                },
                                1280: {
                                    slidesPerView: itemsPerView.large,
                                },
                            }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            key={isRTL ? 'rtl' : 'ltr'}
                        >
                            {testimonials.map((testimonial, index) => (
                                <SwiperSlide key={testimonial?.id || index}>
                                    <TestimonialCard
                                        testimonial={testimonial}
                                        designOption={4}
                                        onClick={() => setSelectedTestimonial(testimonial)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedTestimonial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedTestimonial(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/10 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white/20"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedTestimonial(null)}
                                className="absolute top-6 inset-e-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-primary-500 hover:border-primary-500 transition-all hover:scale-110 z-10"
                                aria-label="Close modal"
                            >
                                <FiX className="text-xl" />
                            </button>

                            <div className="">
                                <TestimonialCard
                                    testimonial={selectedTestimonial}
                                    designOption={4}
                                    isModal={true}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================
   MAIN TESTIMONIALS SECTION COMPONENT
   ============================================ */
export function TestimonialsSection({
    option = 3,
    testimonials,
    isRTL = false,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    showStats = false,
    itemsPerView = { mobile: 1, tablet: 1, desktop: 3, large: 3 }
}) {
    const components = {
        1: TestimonialsOption1,
        2: TestimonialsOption2,
        3: TestimonialsOption3,
        4: TestimonialsOption4
    };

    const Component = components[option] || TestimonialsOption3;

    return (
        <Component
            testimonials={testimonials}
            isRTL={isRTL}
            t={t}
            getLocalizedText={getLocalizedText}
            sectionTitle={sectionTitle}
            showStats={showStats}
            itemsPerView={itemsPerView}
        />
    );
}

// Also export individual options for manual usage
