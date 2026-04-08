import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiChevronLeft,
    FiChevronRight,
    FiArrowRight,
    FiStar,
    FiTrendingUp,
    FiHome,
    FiAward,
} from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { PropertyCard } from '../property/PropertyCard';

/* ============================================
   OPTION 1: MODERN CINEMATIC SECTION (FIXED)
   ============================================ */
export function FeaturedPropertiesOption1({
    featuredProperties,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    viewMode = 'grid',
    showFilters = false,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) {
    const propertiesSwiperRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('all');

    if (!featuredProperties || featuredProperties.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('home.featuredProperties.title', 'Featured Properties') : t('home.featuredProperties.title', 'Featured Properties');

    // Filter properties safely
    const filteredProperties = featuredProperties.filter(property => {
        if (!property) return false;
        if (activeFilter === 'all') return true;

        // Get property status safely
        const status = property.status || property.property?.status || 'For Sale';
        const type = property.type || property.property?.type || 'Apartment';

        if (activeFilter === 'sale') return status === 'For Sale';
        if (activeFilter === 'rent') return status === 'For Rent';
        if (activeFilter === 'apartment') return type === 'Apartment';
        if (activeFilter === 'villa') return type === 'Villa';
        return true;
    });

    return (
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
                        <FiStar className="text-primary-500 text-xl" />
                        <div className="h-px w-8 bg-primary-500" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
                        {title}
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        {t('home.featuredProperties.subtitle', 'Discover our handpicked selection of premium properties')}
                    </p>
                </motion.div>

                {/* Swiper */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => propertiesSwiperRef.current?.slidePrev()}
                        className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-secondary-800 rounded-full shadow-xl border border-primary-500 items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات السابقة' : 'Previous properties'}
                    >
                        <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                        onClick={() => propertiesSwiperRef.current?.slideNext()}
                        className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-secondary-800 rounded-full shadow-xl border border-primary-500 items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات التالية' : 'Next properties'}
                    >
                        <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <Swiper
                        onSwiper={(swiper) => {
                            propertiesSwiperRef.current = swiper;
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
                            el: '.properties-pagination-1',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: itemsPerView.tablet,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: itemsPerView.desktop,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: itemsPerView.large,
                                spaceBetween: 24,
                            },
                        }}
                        className="pb-12"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {filteredProperties.map((property, index) => (
                            <SwiperSlide key={property?.id || index}>
                                <PropertyCard
                                    property={property}
                                    designOption={1}
                                    viewMode={viewMode}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    <div className="properties-pagination-1 flex justify-center gap-2 mt-8" />
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-6"
                >
                    <Link
                        to="/properties"
                        className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-all hover:scale-105 border border-primary-500 hover:border-primary-600 text-sm"
                    >
                        <span>{t('home.featuredProperties.viewAll', 'View All Properties')}</span>
                        <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                </motion.div>
            </div>

            <style jsx global>{`
        .properties-pagination-1 .swiper-pagination-bullet {
          background: var(--color-secondary-700);
          opacity: 0.5;
          width: 10px;
          height: 10px;
        }
        .properties-pagination-1 .swiper-pagination-bullet-active {
          background: var(--color-primary-500);
          opacity: 1;
          width: 24px;
          border-radius: 6px;
        }
      `}</style>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST SECTION (FIXED)
   ============================================ */
export function FeaturedPropertiesOption2({
    featuredProperties,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    viewMode = 'grid',
    showFilters = false,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) {
    const propertiesSwiperRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('all');

    if (!featuredProperties || featuredProperties.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('home.featuredProperties.title', 'Featured Properties') : t('home.featuredProperties.title', 'Featured Properties');

    // Filter properties safely
    const filteredProperties = featuredProperties.filter(property => {
        if (!property) return false;
        if (activeFilter === 'all') return true;

        const status = property.status || property.property?.status || 'For Sale';
        const type = property.type || property.property?.type || 'Apartment';

        if (activeFilter === 'sale') return status === 'For Sale';
        if (activeFilter === 'rent') return status === 'For Rent';
        if (activeFilter === 'apartment') return type === 'Apartment';
        if (activeFilter === 'villa') return type === 'Villa';
        return true;
    });

    return (
        <section className="py-20 bg-neutral-50 relative">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03]"
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
                            {t('home.featuredProperties.featured', 'FEATURED')}
                        </span>
                        <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2`} />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-third-900 mb-4 leading-tight tracking-tighter uppercase font-serif">
                        {title}
                    </h2>

                    <p className="text-xl text-third-600 max-w-2xl mx-auto font-medium">
                        {t('home.featuredProperties.subtitle', 'Discover our handpicked selection of premium properties')}
                    </p>
                </motion.div>

                {/* Swiper */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => propertiesSwiperRef.current?.slidePrev()}
                        className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-50 rounded-full shadow-xl border-4 border-neutral-900 items-center justify-center text-neutral-900 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات السابقة' : 'Previous properties'}
                    >
                        <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                        onClick={() => propertiesSwiperRef.current?.slideNext()}
                        className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-neutral-50 rounded-full shadow-xl border-4 border-neutral-900 items-center justify-center text-neutral-900 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات التالية' : 'Next properties'}
                    >
                        <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <Swiper
                        onSwiper={(swiper) => {
                            propertiesSwiperRef.current = swiper;
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
                            dynamicBullets: false,
                            el: '.properties-pagination-2',
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: itemsPerView.tablet,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: itemsPerView.desktop,
                                spaceBetween: 24,
                            },
                        }}
                        className="pb-12"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {filteredProperties.map((property, index) => (
                            <SwiperSlide key={property?.id || index}>
                                <PropertyCard
                                    property={property}
                                    designOption={2}
                                    viewMode={viewMode}
                                    isRTL={isRTL}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    <div className="properties-pagination-2 flex justify-center gap-2 mt-8" />
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 relative inline-block mx-auto group"
                >
                    <Link
                        to="/properties"
                        className="relative z-10 inline-flex items-center justify-center gap-3 px-8 py-3 bg-neutral-900 text-neutral-50 font-bold text-sm border-4 border-neutral-900 group-hover:bg-primary-600 group-hover:border-primary-600 transition-colors"
                    >
                        <FiHome className="text-lg" />
                        <span>{t('home.featuredProperties.viewAll', 'VIEW ALL PROPERTIES')}</span>
                        <FiArrowRight className={`text-lg ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                    <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                </motion.div>
            </div>

            <style jsx global>{`
        .properties-pagination-2 .swiper-pagination-bullet {
          background: var(--color-text);
          opacity: 0.3;
          width: 12px;
          height: 12px;
          border: 2px solid var(--color-text);
          border-radius: 0 !important;
        }
        .properties-pagination-2 .swiper-pagination-bullet-active {
          background: var(--color-primary-600);
          opacity: 1;
          border: 2px solid var(--color-text);
        }
      `}</style>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC SECTION (FIXED)
   ============================================ */
export function FeaturedPropertiesOption3({
    featuredProperties,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    viewMode = 'grid',
    showFilters = false,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) {
    const propertiesSwiperRef = useRef(null);

    if (!featuredProperties || featuredProperties.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('home.featuredProperties.title', 'Featured Properties') : t('home.featuredProperties.title', 'Featured Properties');

    return (
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
                            <FiTrendingUp />
                            {t('home.featuredProperties.featured', 'Featured')}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent">
                        {title}
                    </h2>

                    <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
                        {t('home.featuredProperties.subtitle', 'Discover our handpicked selection of premium properties')}
                    </p>
                </motion.div>

                {/* Swiper */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => propertiesSwiperRef.current?.slidePrev()}
                        className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full shadow-xl border border-primary-300/50 items-center justify-center text-primary-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات السابقة' : 'Previous properties'}
                    >
                        <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                        onClick={() => propertiesSwiperRef.current?.slideNext()}
                        className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/60 backdrop-blur-sm rounded-full shadow-xl border border-primary-300/50 items-center justify-center text-primary-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات التالية' : 'Next properties'}
                    >
                        <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <Swiper
                        onSwiper={(swiper) => {
                            propertiesSwiperRef.current = swiper;
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
                            el: '.properties-pagination-3',
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
                        {featuredProperties.map((property, index) => (
                            <SwiperSlide key={property?.id || index} className='my-8'>
                                <PropertyCard
                                    property={property}
                                    designOption={3}
                                    viewMode={viewMode}
                                    isRTL={isRTL}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-6"
                >
                    <Link
                        to="/properties"
                        className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-xl shadow-primary-500/30 text-sm"
                    >
                        <span>{t('home.featuredProperties.viewAll', 'View All Properties')}</span>
                        <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                </motion.div>
            </div>

            <style jsx global>{`
        .properties-pagination-3 .swiper-pagination-bullet {
          background: var(--color-primary-400);
          opacity: 0.5;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .properties-pagination-3 .swiper-pagination-bullet-active {
          background: linear-gradient(to right, var(--color-primary-600), var(--color-primary-700));
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
        </section>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM SECTION (FIXED)
   ============================================ */
export function FeaturedPropertiesOption4({
    featuredProperties,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    viewMode = 'grid',
    showFilters = false,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) {
    const propertiesSwiperRef = useRef(null);

    if (!featuredProperties || featuredProperties.length === 0) return null;

    const title = getLocalizedText ? getLocalizedText({}, 'title') || t('home.featuredProperties.title', 'Featured Properties') : t('home.featuredProperties.title', 'Featured Properties');

    return (
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
                            {t('home.properties.premium', 'Premium Selection')}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                        {title}
                    </h2>

                    <p className="text-lg text-accent-200 max-w-2xl mx-auto">
                        {t('home.featuredProperties.subtitle', 'Discover our handpicked selection of premium properties')}
                    </p>
                </motion.div>

                {/* Swiper */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => propertiesSwiperRef.current?.slidePrev()}
                        className="hidden md:flex absolute inset-s-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center text-accent-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات السابقة' : 'Previous properties'}
                    >
                        <FiChevronLeft className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                        onClick={() => propertiesSwiperRef.current?.slideNext()}
                        className="hidden md:flex absolute inset-e-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 items-center justify-center text-accent-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all hover:scale-110 active:scale-95"
                        aria-label={isRTL ? 'العقارات التالية' : 'Next properties'}
                    >
                        <FiChevronRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                    </button>

                    <Swiper
                        onSwiper={(swiper) => {
                            propertiesSwiperRef.current = swiper;
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
                            el: '.properties-pagination-4',
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
                        className="pb-12"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {featuredProperties.map((property, index) => (
                            <SwiperSlide key={property?.id || index}>
                                <PropertyCard
                                    property={property}
                                    designOption={4}
                                    viewMode={viewMode}
                                    isRTL={isRTL}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    <div className="properties-pagination-4 flex justify-center gap-2 mt-8" />
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        to="/properties"
                        className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-linear-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-2xl font-semibold transition-all hover:scale-105 shadow-2xl shadow-primary-500/50 backdrop-blur-sm border border-white/20 text-sm"
                    >
                        <span>{t('home.featuredProperties.viewAll', 'View All Properties')}</span>
                        <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                </motion.div>
            </div>

            <style jsx global>{`
        .properties-pagination-4 .swiper-pagination-bullet {
          background: var(--color-primary-300);
          opacity: 0.5;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .properties-pagination-4 .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, var(--color-primary-400), var(--color-accent-400));
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
        </section>
    );
}

/* ============================================
   MAIN COMPONENT WITH ALL OPTIONS (FIXED)
   ============================================ */
export function FeaturedPropertiesSection({
    option = 3,
    featuredProperties,
    isRTL = false,
    t = (key, fallback) => fallback,
    getLocalizedText,
    sectionTitle = '',
    viewMode = 'grid',
    showFilters = false,
    itemsPerView = { mobile: 1, tablet: 2, desktop: 3, large: 4 }
}) {
    const components = {
        1: FeaturedPropertiesOption1,
        2: FeaturedPropertiesOption2,
        3: FeaturedPropertiesOption3,
        4: FeaturedPropertiesOption4
    };

    const Component = components[option] || FeaturedPropertiesOption1;

    return (
        <Component
            featuredProperties={featuredProperties}
            isRTL={isRTL}
            t={t}
            getLocalizedText={getLocalizedText}
            sectionTitle={sectionTitle}
            viewMode={viewMode}
            showFilters={showFilters}
            itemsPerView={itemsPerView}
        />
    );
}

// Also export individual options for manual usage
