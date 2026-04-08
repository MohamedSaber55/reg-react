import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight, FiPlay, FiPause, FiMaximize, FiMinimize } from 'react-icons/fi';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

/* ============================================
   PROPTYPES AND UTILITIES
   ============================================ */
const getLocalizedText = (section, field) => {
    if (!section) return '';
    const lang = document.documentElement.dir === 'rtl' ? 'Ar' : 'En';
    return section[`${field}${lang}`] || section[field] || '';
};

/* ============================================
   OPTION 1: MODERN CINEMATIC SLIDER
   ============================================ */
export function SliderOption1({
    activeSlider,
    activeSliderImages,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText: customGetLocalizedText,
    sectionTitle = '',
    showControls = true,
    showPagination = true,
    autoPlay = true
}) {
    const sliderSwiperRef = useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const effectiveGetLocalizedText = customGetLocalizedText || getLocalizedText;

    if (!activeSlider || activeSliderImages.length === 0) return null;

    const title = effectiveGetLocalizedText(activeSlider, 'title');

    const togglePlay = () => {
        if (isPlaying) {
            sliderSwiperRef.current?.autoplay.stop();
        } else {
            sliderSwiperRef.current?.autoplay.start();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`py-16 ${isFullscreen ? 'fixed inset-0 z-50 bg-secondary-950' : 'relative bg-secondary-950'}`}
        >
            <div className={`${isFullscreen ? 'h-screen' : ''}`}>
                <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isFullscreen ? 'h-full' : ''}`}>
                    {/* Header with title (only in non-fullscreen) */}
                    {!isFullscreen && title && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-3 mb-8 `}
                        >
                            <div className="h-px w-8 bg-primary-500" />
                            <span className="text-primary-500 text-xs tracking-[0.2em] uppercase font-medium">
                                {title}
                            </span>
                        </motion.div>
                    )}

                    <div className={`relative ${isFullscreen ? 'h-full flex items-center' : ''}`}>
                        {/* Diagonal Accent Elements */}
                        <div
                            className="absolute -top-8 -inset-s-8 w-32 h-32 opacity-10 z-0"
                            style={{
                                background: `linear-gradient(${isRTL ? '225deg' : '135deg'}, transparent 50%, var(--color-primary-500) 50%)`,
                            }}
                        />

                        {/* Navigation Buttons */}
                        {showControls && (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => sliderSwiperRef.current?.slidePrev()}
                                    className={`absolute inset-s-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-all shadow-2xl group`}
                                    aria-label={isRTL ? 'السابق' : 'Previous'}
                                >
                                    <FiChevronLeft className={`text-2xl ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:-translate-x-1'}`} />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => sliderSwiperRef.current?.slideNext()}
                                    className={`absolute inset-e-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-all shadow-2xl group`}
                                    aria-label={isRTL ? 'التالي' : 'Next'}
                                >
                                    <FiChevronRight className={`text-2xl ${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </motion.button>
                            </>
                        )}

                        {/* Control Buttons */}
                        <div className={`absolute inset-e-4 top-4 z-20 flex gap-2`}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={togglePlay}
                                className="w-10 h-10 bg-secondary-800 hover:bg-secondary-700 text-white flex items-center justify-center shadow-lg"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <FiPause /> : <FiPlay />}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleFullscreen}
                                className="w-10 h-10 bg-secondary-800 hover:bg-secondary-700 text-white flex items-center justify-center shadow-lg"
                                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                            </motion.button>
                        </div>

                        {/* Swiper */}
                        <Swiper
                            onSwiper={(swiper) => {
                                sliderSwiperRef.current = swiper;
                                if (autoPlay) {
                                    swiper.autoplay.start();
                                }
                            }}
                            onAutoplayStart={() => setIsPlaying(true)}
                            onAutoplayStop={() => setIsPlaying(false)}
                            modules={[Navigation, Pagination, Autoplay, EffectFade]}
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            autoplay={autoPlay ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                            pagination={showPagination ? {
                                clickable: true,
                                dynamicBullets: true,
                            } : false}
                            loop={activeSliderImages.length > 1}
                            speed={800}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            className={`slider-swiper-1 ${isFullscreen ? 'h-full' : 'border-s-4 border-primary-500'} overflow-hidden shadow-2xl`}
                        >
                            {activeSliderImages
                                .sort((a, b) => a.order - b.order)
                                .map((slideImage, index) => (
                                    <SwiperSlide key={slideImage.image.id}>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative w-full h-64 md:h-80 lg:h-100"
                                        >
                                            {slideImage.image.link ? (
                                                <Link to={slideImage.image.link}>
                                                    <div className="relative group h-full">
                                                        <img
                                                            src={slideImage.image.imageUrl}
                                                            alt={`Slide ${slideImage.order}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Hover Overlay with Info */}
                                                        <div className="absolute inset-0 bg-linear-to-t from-secondary-950/90 via-secondary-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                                            <div className="p-6">
                                                                {slideImage.image.title && (
                                                                    <h3 className="text-white text-xl font-bold mb-2">
                                                                        {slideImage.image.title}
                                                                    </h3>
                                                                )}
                                                                {slideImage.image.description && (
                                                                    <p className="text-neutral-300 text-sm">
                                                                        {slideImage.image.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <>
                                                    <img
                                                        src={slideImage.image.imageUrl}
                                                        alt={`Slide ${slideImage.order}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Slide Number */}
                                                    <div className="absolute bottom-4 inset-e-4 bg-secondary-950/80 text-white px-3 py-1 text-sm font-mono">
                                                        {index + 1}/{activeSliderImages.length}
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>

                        {/* Diagonal Accent - Bottom Right */}
                        <div
                            className="absolute -bottom-8 -inset-e-8 w-32 h-32 opacity-10 z-0"
                            style={{
                                background: `linear-gradient(${isRTL ? '45deg' : '315deg'}, transparent 50%, var(--color-primary-500) 50%)`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Custom Pagination Styling */}
            <style jsx global>{`
        .slider-swiper-1 .swiper-pagination-bullet {
          background: var(--color-secondary-700);
          opacity: 0.5;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        .slider-swiper-1 .swiper-pagination-bullet-active {
          background: var(--color-primary-500);
          opacity: 1;
          width: 32px;
          border-radius: 6px;
          transform: scale(1.2);
        }
        .slider-swiper-1 .swiper-pagination {
          bottom: 20px !important;
        }
      `}</style>
        </motion.section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST SLIDER
   ============================================ */
export function SliderOption2({
    activeSlider,
    activeSliderImages,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText: customGetLocalizedText,
    sectionTitle = '',
    showControls = true,
    showPagination = true,
    autoPlay = true
}) {
    const sliderSwiperRef = useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);

    const effectiveGetLocalizedText = customGetLocalizedText || getLocalizedText;

    if (!activeSlider || activeSliderImages.length === 0) return null;

    const title = effectiveGetLocalizedText(activeSlider, 'title');

    const togglePlay = () => {
        if (isPlaying) {
            sliderSwiperRef.current?.autoplay.stop();
        } else {
            sliderSwiperRef.current?.autoplay.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section className="py-16 bg-neutral-50 relative">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Title with Brutalist Style */}
                {title && (
                    <div className="mb-8">
                        <h2 className="text-4xl md:text-5xl font-black text-third-900 leading-tight tracking-tighter mb-2 uppercase font-serif">
                            {title}
                        </h2>
                        <div className="h-1 w-32 bg-neutral-900"></div>
                    </div>
                )}

                <div className="relative">
                    {/* Main Container with Offset Shadow */}
                    <div className="relative">
                        {/* Navigation Buttons */}
                        {showControls && (
                            <>
                                <button
                                    onClick={() => sliderSwiperRef.current?.slidePrev()}
                                    className={`absolute inset-s-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-neutral-50 border-4 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-neutral-50 transition-colors shadow-lg group`}
                                    aria-label={isRTL ? 'السابق' : 'Previous'}
                                >
                                    <FiChevronLeft className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                                    <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                                </button>

                                <button
                                    onClick={() => sliderSwiperRef.current?.slideNext()}
                                    className={`absolute inset-e-6 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-neutral-50 border-4 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-neutral-50 transition-colors shadow-lg group`}
                                    aria-label={isRTL ? 'التالي' : 'Next'}
                                >
                                    <FiChevronRight className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                                    <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                                </button>
                            </>
                        )}

                        {/* Control Buttons */}
                        <div className={`absolute inset-e-6 top-6 z-20 flex gap-3`}>
                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 bg-neutral-50 border-4 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-neutral-50 transition-colors relative group"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <FiPause /> : <FiPlay />}
                                <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                            </button>
                        </div>

                        {/* Swiper Container */}
                        <div className="relative z-10">
                            <Swiper
                                onSwiper={(swiper) => {
                                    sliderSwiperRef.current = swiper;
                                    if (autoPlay) {
                                        swiper.autoplay.start();
                                    }
                                }}
                                onAutoplayStart={() => setIsPlaying(true)}
                                onAutoplayStop={() => setIsPlaying(false)}
                                modules={[Navigation, Pagination, Autoplay]}
                                autoplay={autoPlay ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                                pagination={showPagination ? {
                                    clickable: true,
                                    dynamicBullets: false,
                                } : false}
                                loop={activeSliderImages.length > 1}
                                speed={800}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                className="slider-swiper-2 border-4 border-neutral-900 overflow-hidden"
                            >
                                {activeSliderImages
                                    .sort((a, b) => a.order - b.order)
                                    .map((slideImage, index) => (
                                        <SwiperSlide key={slideImage.image.id}>
                                            <div className="relative h-64 md:h-80 lg:h-100">
                                                {slideImage.image.link ? (
                                                    <Link to={slideImage.image.link}>
                                                        <div className="relative h-full">
                                                            <img
                                                                src={slideImage.image.imageUrl}
                                                                alt={`Slide ${slideImage.order}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Slide Info */}
                                                            <div className="absolute bottom-0 inset-s-0 inset-e-0 bg-neutral-50 p-4 border-t-4 border-neutral-900">
                                                                <h3 className="text-third-900 font-bold text-lg mb-1">
                                                                    {slideImage.image.title || `Slide ${index + 1}`}
                                                                </h3>
                                                                {slideImage.image.description && (
                                                                    <p className="text-third-500 text-sm">
                                                                        {slideImage.image.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <img
                                                            src={slideImage.image.imageUrl}
                                                            alt={`Slide ${slideImage.order}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Slide Number - Brutalist Style */}
                                                        <div className={`absolute top-4 inset-e-4 bg-neutral-50 border-4 border-neutral-900 px-3 py-1`}>
                                                            <span className="text-third-900 font-black text-lg">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>

                        {/* Offset Shadow */}
                        <div className="absolute inset-0 border-4 border-neutral-900 translate-x-3 translate-y-3 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Custom Pagination Styling */}
            <style jsx global>{`
        .slider-swiper-2 .swiper-pagination-bullet {
          background: var(--color-text);
          opacity: 0.3;
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-text);
          border-radius: 0 !important;
        }
        .slider-swiper-2 .swiper-pagination-bullet-active {
          background: var(--color-primary-600);
          opacity: 1;
          border: 2px solid var(--color-text);
          transform: scale(1.1);
        }
      `}</style>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC SLIDER
   ============================================ */
export function SliderOption3({
    activeSlider,
    activeSliderImages,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText: customGetLocalizedText,
    sectionTitle = '',
    showControls = true,
    showPagination = true,
    autoPlay = true
}) {
    const sliderSwiperRef = useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);

    if (!activeSlider || activeSliderImages.length === 0) return null;


    const togglePlay = () => {
        if (isPlaying) {
            sliderSwiperRef.current?.autoplay.stop();
        } else {
            sliderSwiperRef.current?.autoplay.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section className="py-16 bg-linear-to-b from-neutral-50 to-primary-50 relative overflow-hidden">
            {/* Animated Blobs */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 inset-e-0 w-64 h-64 bg-linear-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl -z-10"
            />

            <motion.div
                animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 inset-s-0 w-64 h-64 bg-linear-to-tl from-accent-200/30 to-primary-200/30 rounded-full blur-3xl -z-10"
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative">
                    {/* Navigation Buttons */}
                    {showControls && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sliderSwiperRef.current?.slidePrev()}
                                className={`absolute inset-s-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-neutral-50/80 backdrop-blur-md rounded-full shadow-xl border border-primary-300/50 flex items-center justify-center text-primary-700 hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white transition-all hover:scale-110`}
                                aria-label={isRTL ? 'السابق' : 'Previous'}
                            >
                                <FiChevronLeft className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sliderSwiperRef.current?.slideNext()}
                                className={`absolute inset-e-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-neutral-50/80 backdrop-blur-md rounded-full shadow-xl border border-primary-300/50 flex items-center justify-center text-primary-700 hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white transition-all hover:scale-110`}
                                aria-label={isRTL ? 'التالي' : 'Next'}
                            >
                                <FiChevronRight className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                            </motion.button>
                        </>
                    )}

                    {/* Control Buttons */}
                    <div className={`absolute inset-s-4 top-4 z-20 flex gap-2`}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="w-10 h-10 bg-neutral-50/80 backdrop-blur-md rounded-full border border-primary-300/50 flex items-center justify-center text-primary-700 hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-700 hover:text-white transition-all"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <FiPause /> : <FiPlay />}
                        </motion.button>
                    </div>

                    {/* Swiper */}
                    <Swiper
                        onSwiper={(swiper) => {
                            sliderSwiperRef.current = swiper;
                            if (autoPlay) {
                                swiper.autoplay.start();
                            }
                        }}
                        onAutoplayStart={() => setIsPlaying(true)}
                        onAutoplayStop={() => setIsPlaying(false)}
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoplay={autoPlay ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                        pagination={showPagination ? {
                            clickable: true,
                            dynamicBullets: true,
                        } : false}
                        loop={activeSliderImages.length > 1}
                        speed={800}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        key={isRTL ? 'rtl' : 'ltr'}
                        className="slider-swiper-3 rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-primary-200/50"
                    >
                        {activeSliderImages
                            .sort((a, b) => a.order - b.order)
                            .map((slideImage, index) => (
                                <SwiperSlide key={slideImage.image.id}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative h-64 md:h-80 lg:h-100"
                                    >
                                        {slideImage.image.link ? (
                                            <Link to={slideImage.image.link}>
                                                <div className="relative group h-full">
                                                    <img
                                                        src={slideImage.image.imageUrl}
                                                        alt={`Slide ${slideImage.order}`}
                                                        className="w-full h-full object-cover rounded-2xl"
                                                    />
                                                </div>
                                            </Link>
                                        ) : (
                                            <>
                                                {slideImage.image.link ? (
                                                    <Link to={slideImage.image.link}>
                                                        <div className="relative group h-full">
                                                            <img
                                                                src={slideImage.image.imageUrl}
                                                                alt={`Slide ${slideImage.order}`}
                                                                className="w-full h-full object-cover rounded-2xl"
                                                            />
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <img
                                                        src={slideImage.image.imageUrl}
                                                        alt={`Slide ${slideImage.order}`}
                                                        className="w-full h-full object-cover rounded-2xl"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>

            {/* Custom Pagination Styling */}
            <style jsx global>{`
        .slider-swiper-3 .swiper-pagination-bullet {
          background: var(--color-primary-300);
          opacity: 0.5;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .slider-swiper-3 .swiper-pagination-bullet-active {
          background: linear-gradient(to right, var(--color-primary-600), var(--color-primary-700));
          opacity: 1;
          width: 28px;
          border-radius: 10px;
          transform: scale(1.1);
        }
      `}</style>
        </section>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM SLIDER
   ============================================ */
export function SliderOption4({
    activeSlider,
    activeSliderImages,
    isRTL,
    t = (key, fallback) => fallback,
    getLocalizedText: customGetLocalizedText,
    sectionTitle = '',
    showControls = true,
    showPagination = true,
    autoPlay = true
}) {
    const sliderSwiperRef = useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);

    const effectiveGetLocalizedText = customGetLocalizedText || getLocalizedText;

    if (!activeSlider || activeSliderImages.length === 0) return null;

    const title = effectiveGetLocalizedText(activeSlider, 'title');

    const togglePlay = () => {
        if (isPlaying) {
            sliderSwiperRef.current?.autoplay.stop();
        } else {
            sliderSwiperRef.current?.autoplay.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section className="py-16 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 relative overflow-hidden">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Title with Glass Style */}
                {title && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4">
                            <span className="text-accent-200 font-semibold text-xs">
                                {sectionTitle || 'FEATURED'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {title}
                        </h2>
                    </motion.div>
                )}

                <div className="relative">
                    {/* Navigation Buttons */}
                    {showControls && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sliderSwiperRef.current?.slidePrev()}
                                className={`absolute inset-s-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white hover:bg-linear-to-r hover:from-primary-600 hover:to-accent-600 hover:border-primary-400 transition-all hover:scale-110`}
                                aria-label={isRTL ? 'السابق' : 'Previous'}
                            >
                                <FiChevronLeft className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => sliderSwiperRef.current?.slideNext()}
                                className={`absolute inset-e-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 flex items-center justify-center text-white hover:bg-linear-to-r hover:from-primary-600 hover:to-accent-600 hover:border-primary-400 transition-all hover:scale-110`}
                                aria-label={isRTL ? 'التالي' : 'Next'}
                            >
                                <FiChevronRight className={`text-2xl ${isRTL ? 'rotate-180' : ''}`} />
                            </motion.button>
                        </>
                    )}

                    {/* Control Buttons */}
                    <div className={`absolute inset-e-4 top-4 z-20 flex gap-2`}>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-linear-to-r hover:from-primary-600 hover:to-accent-600 transition-all"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <FiPause /> : <FiPlay />}
                        </motion.button>
                    </div>

                    {/* Swiper */}
                    <Swiper
                        onSwiper={(swiper) => {
                            sliderSwiperRef.current = swiper;
                            if (autoPlay) {
                                swiper.autoplay.start();
                            }
                        }}
                        onAutoplayStart={() => setIsPlaying(true)}
                        onAutoplayStop={() => setIsPlaying(false)}
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        autoplay={autoPlay ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                        pagination={showPagination ? {
                            clickable: true,
                            dynamicBullets: true,
                        } : false}
                        loop={activeSliderImages.length > 1}
                        speed={800}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className="slider-swiper-4 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                    >
                        {activeSliderImages
                            .sort((a, b) => a.order - b.order)
                            .map((slideImage, index) => (
                                <SwiperSlide key={slideImage.image.id}>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative h-64 md:h-80 lg:h-100"
                                    >
                                        {slideImage.image.link ? (
                                            <Link to={slideImage.image.link}>
                                                <div className="relative group h-full">
                                                    <img
                                                        src={slideImage.image.imageUrl}
                                                        alt={`Slide ${slideImage.order}`}
                                                        className="w-full h-full object-cover rounded-3xl"
                                                    />
                                                    {/* Glass Overlay on Hover */}
                                                    <div className="absolute inset-0 bg-accent-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl flex items-end">
                                                        <div className="p-6 w-full">
                                                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                                                                <h3 className="text-white text-xl font-bold mb-2">
                                                                    {slideImage.image.title || `Slide ${index + 1}`}
                                                                </h3>
                                                                {slideImage.image.description && (
                                                                    <p className="text-accent-200 text-sm">
                                                                        {slideImage.image.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <>
                                                <img
                                                    src={slideImage.image.imageUrl}
                                                    alt={`Slide ${slideImage.order}`}
                                                    className="w-full h-full object-cover rounded-3xl"
                                                />
                                                {/* Slide Number - Glass Style */}
                                                <div className="absolute top-4 inset-e-4 bg-white/10 backdrop-blur-xl rounded-full px-3 py-1 border border-white/20">
                                                    <span className="text-white font-semibold text-sm">
                                                        {index + 1}/{activeSliderImages.length}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            </div>

            {/* Custom Pagination Styling */}
            <style jsx global>{`
        .slider-swiper-4 .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          opacity: 0.6;
          width: 12px;
          height: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .slider-swiper-4 .swiper-pagination-bullet-active {
          background: linear-gradient(to right, var(--color-primary-500), var(--color-accent-500));
          opacity: 1;
          width: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        .slider-swiper-4 .swiper-pagination {
          bottom: 20px !important;
        }
      `}</style>
        </section>
    );
}

/* ============================================
   MAIN COMPONENT WITH ALL OPTIONS
   ============================================ */
export function SliderSection({
    option = 1,
    activeSlider,
    activeSliderImages,
    isRTL,
    t,
    getLocalizedText,
    sectionTitle = '',
    showControls = true,
    showPagination = true,
    autoPlay = true
}) {
    const components = {
        1: SliderOption1,
        2: SliderOption2,
        3: SliderOption3,
        4: SliderOption4
    };

    const Component = components[option] || SliderOption1;

    return (
        <Component
            activeSlider={activeSlider}
            activeSliderImages={activeSliderImages}
            isRTL={isRTL}
            t={t}
            getLocalizedText={getLocalizedText}
            sectionTitle={sectionTitle}
            showControls={showControls}
            showPagination={showPagination}
            autoPlay={autoPlay}
        />
    );
}