import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart } from 'react-icons/fi';

/* ============================================
   OPTION 1: MODERN CINEMATIC SPLIT
   ============================================
   Features:
   - Dramatic diagonal split layout
   - Large typography with editorial feel
   - Floating mission/vision cards
   - Parallax-style animations
   - Magazine/luxury aesthetic
*/

export function AboutHeroOption1({ aboutSection, isRTL, t, getLocalizedText }) {
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');
    const titleWords = title.split(' ');

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-secondary-950">
            {/* Diagonal Background Split */}
            <div className="absolute inset-0" dir={isRTL ? 'rtl' : 'ltr'}>
                {aboutSection?.imageUrl && (
                    <>
                        {/* Image side - adapts to RTL/LTR */}
                        <div
                            className="absolute inset-0 w-3/5 origin-left"
                            style={{
                                clipPath: isRTL
                                    ? 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)'
                                    : 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                                [isRTL ? 'right' : 'left']: 0,
                            }}
                        >
                            <img
                                src={aboutSection.imageUrl}
                                alt={title}
                                className="w-full h-full object-cover scale-110"
                            />
                            <div className={`absolute inset-0 ${isRTL ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-transparent to-secondary-950/80  `} />
                        </div>

                        {/* Solid color side */}
                        <div
                            className={`absolute inset-0 inset-s-[60%] bg-secondary-950  `}
                        />
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Content */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="h-px w-12 bg-primary-500" />
                                <span className="text-primary-500 text-sm tracking-[0.2em] uppercase font-medium">
                                    {t('about.ourStory', 'Our Story')}
                                </span>
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white   mb-8 leading-[0.95] tracking-tight font-serif">
                                {titleWords.length > 0 && (
                                    <>
                                        <span className="block">
                                            {titleWords[0]}
                                        </span>
                                        {titleWords.length > 1 && (
                                            <span className="block text-primary-500">
                                                {titleWords.slice(1).join(' ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </h1>

                            {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                                <p className="text-xl text-neutral-300   mb-6 max-w-lg font-light leading-relaxed">
                                    {getLocalizedText(aboutSection, 'subTitle')}
                                </p>
                            )}

                            {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                                <p className="text-lg text-neutral-400   mb-12 max-w-lg leading-relaxed">
                                    {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* Floating Mission/Vision Cards */}
                    {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                        <div className="lg:col-span-5 relative h-100 hidden lg:block">
                            {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className={`absolute top-0 inset-e-0 bg-primary-500 text-white   p-8 shadow-2xl w-64`}
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
                                    className={`absolute bottom-0 inset-e-10 bg-neutral-50   text-third-900   p-8 shadow-2xl w-64`}
                                >
                                    <FiHeart className="text-3xl text-accent-600   mb-4" />
                                    <div className="text-xl font-bold mb-3 font-serif">
                                        {t('about.vision.title', 'Our Vision')}
                                    </div>
                                    <div className="text-sm text-third-500   line-clamp-4">
                                        {getLocalizedText(aboutSection, 'vision')}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST
   ============================================
   Features:
   - Ultra-minimal, stark layout
   - Bold typography
   - High contrast black/white
   - Geometric precision
   - Raw, unpolished edges
*/

export function AboutHeroOption2({ aboutSection, isRTL, t, getLocalizedText }) {
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    return (
        <section className="relative min-h-[70vh] flex items-center bg-neutral-50  overflow-hidden">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="max-w-6xl"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    {/* Badge */}
                    <div className="inline-block mb-8 px-8 py-4 bg-neutral-900   text-neutral-50  relative">
                        <span className="relative z-10 text-lg font-bold uppercase tracking-wider">
                            {t('about.ourStory', 'Our Story')}
                        </span>
                        <div className={`absolute inset-0 border-4 border-neutral-900   ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2`} />
                    </div>

                    {/* Title */}
                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black text-third-900   leading-[0.85] tracking-tighter mb-12 font-serif">
                        {title}
                    </h1>

                    {/* Image - Positioned with brutalist border */}
                    {aboutSection?.imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mb-16 relative"
                        >
                            <div className={`absolute -top-6 -inset-s-6 w-full h-full border-4 border-neutral-900  `} />
                            <img
                                src={aboutSection.imageUrl}
                                alt={title}
                                className="w-full max-w-2xl h-96 object-cover relative"
                            />
                        </motion.div>
                    )}

                    {/* Subtitle & Description */}
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
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC CURVES
   ============================================
   Features:
   - Flowing curved shapes
   - Soft gradients and glass morphism
   - Warm, inviting color palette
   - Smooth animations
   - Natural, friendly aesthetic
*/

export function AboutHeroOption3({ aboutSection, isRTL, t, getLocalizedText }) {
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-linear-to-br from-primary-50 via-primary-100 to-primary-200">
            {/* Animated Blob Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -inset-s-1/4 w-200 h-200 bg-linear-to-br from-primary-300/30 to-primary-400/30     rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -inset-e-1/4 w-250 h-250 bg-linear-to-br from-accent-300/30 to-primary-300/30     rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
                    {/* Image */}
                    {aboutSection?.imageUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className={`relative`}
                        >
                            <div className="relative">
                                <div className={`absolute inset-0 bg-linear-to-br from-primary-400/20 to-accent-400/20     rounded-[3rem] transform ${isRTL ? '-rotate-6' : 'rotate-6'}`} />
                                <img
                                    src={aboutSection.imageUrl}
                                    alt={title}
                                    className="relative w-full h-125 object-cover rounded-[3rem] shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    )}
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-6 py-3 bg-neutral-50/60  /60 backdrop-blur-sm rounded-full mb-8 border border-primary-300/50">
                            <span className="text-primary-700   font-semibold text-sm">
                                ✨ {t('about.ourStory', 'Our Story')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent">
                            {title}
                        </h1>

                        {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                            <p className="text-2xl text-neutral-800   mb-8 font-light">
                                {getLocalizedText(aboutSection, 'subTitle')}
                            </p>
                        )}

                        {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                            <p className="text-lg text-neutral-700   mb-12 leading-relaxed max-w-xl">
                                {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                            </p>
                        )}

                        {/* Mission/Vision Pills */}
                        {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                    <div className="bg-neutral-50/60  /60 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50">
                                        <FiTarget className="text-3xl text-primary-700  mb-3" />
                                        <div className="text-lg font-bold text-third-900   mb-2">
                                            {t('about.mission.title', 'Mission')}
                                        </div>
                                        <div className="text-sm text-neutral-700   line-clamp-3">
                                            {getLocalizedText(aboutSection, 'mission')}
                                        </div>
                                    </div>
                                )}

                                {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                    <div className="bg-neutral-50/60  /60 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50">
                                        <FiHeart className="text-3xl text-accent-700   mb-3" />
                                        <div className="text-lg font-bold text-third-900   mb-2">
                                            {t('about.vision.title', 'Vision')}
                                        </div>
                                        <div className="text-sm text-neutral-700   line-clamp-3">
                                            {getLocalizedText(aboutSection, 'vision')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 4: MODERN GLASS MORPHISM
   ============================================
   Features:
   - Frosted glass cards
   - Vibrant gradients
   - Depth and layering
   - Modern UI aesthetic
   - Clean and professional
*/

export function AboutHeroOption4({ aboutSection, isRTL, t, getLocalizedText }) {
    const title = getLocalizedText(aboutSection, 'title') || t('about.title', 'About Us');

    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900" />

            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-accent-500/30 to-primary-500/30     rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-primary-500/30 to-accent-500/30     rounded-full blur-[120px]"
                />
            </div>

            {/* Background Image with Overlay */}
            {aboutSection?.imageUrl && (
                <div className="absolute inset-0">
                    <img
                        src={aboutSection.imageUrl}
                        alt={title}
                        className="w-full h-full object-cover opacity-10"
                    />
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <div className="inline-block px-6 py-3 bg-white/10  backdrop-blur-md border border-white/20   rounded-full mb-6">
                            <span className="text-accent-200   font-semibold text-sm">
                                ⭐ {t('about.ourStory', 'Our Story')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100       bg-clip-text text-transparent">
                            {title}
                        </h1>

                        {(aboutSection?.subTitleEn || aboutSection?.subTitleAr) && (
                            <p className="text-2xl text-accent-200   mb-6 max-w-3xl mx-auto">
                                {getLocalizedText(aboutSection, 'subTitle')}
                            </p>
                        )}

                        {(aboutSection?.descriptionEn || aboutSection?.descriptionAr) && (
                            <p className="text-lg text-accent-300/80   mb-12 max-w-3xl mx-auto leading-relaxed">
                                {getLocalizedText(aboutSection, 'description')?.split('\n')[0]}
                            </p>
                        )}
                    </motion.div>

                    {/* Glass Mission/Vision Cards */}
                    {(aboutSection?.missionEn || aboutSection?.missionAr || aboutSection?.visionEn || aboutSection?.visionAr) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {(aboutSection?.missionEn || aboutSection?.missionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white/10  backdrop-blur-xl rounded-3xl p-8 border border-white/20   hover:bg-white/15   transition-all group"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-primary-500 to-primary-600     rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <FiTarget className="text-white text-2xl" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-4">
                                        {t('about.mission.title', 'Our Mission')}
                                    </div>
                                    <div className="text-accent-300   leading-relaxed">
                                        {getLocalizedText(aboutSection, 'mission')}
                                    </div>
                                </motion.div>
                            )}

                            {(aboutSection?.visionEn || aboutSection?.visionAr) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white/10  backdrop-blur-xl rounded-3xl p-8 border border-white/20   hover:bg-white/15   transition-all group"
                                >
                                    <div className="w-14 h-14 bg-linear-to-br from-accent-500 to-accent-600     rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <FiHeart className="text-white text-2xl" />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-4">
                                        {t('about.vision.title', 'Our Vision')}
                                    </div>
                                    <div className="text-accent-300   leading-relaxed">
                                        {getLocalizedText(aboutSection, 'vision')}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}