import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiCheck,
    FiArrowRight,
    FiClock,
    FiDollarSign,
    FiShield,
    FiTrendingUp,
    FiUsers,
    FiStar,
    FiHome,
    FiKey,
    FiBriefcase
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DynamicIconLazy from '@/components/common/DynamicIconLazy';

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const getServiceIcon = (iconName) => {
    const iconMap = {
        'FiHome': FiHome,
        'FiKey': FiKey,
        'FiShield': FiShield,
        'FiTrendingUp': FiTrendingUp,
        'FiUsers': FiUsers,
        'FiStar': FiStar,
        'FiClock': FiClock,
        'FiDollarSign': FiDollarSign,
        'FiCheck': FiCheck,
    };

    return iconMap[iconName] || FiHome;
};

/* ============================================
   SERVICE CARD COMPONENT (UPDATED WITH DynamicIconLazy)
   ============================================ */
const ServiceCard = ({
    service,
    designOption = 1,
    index = 0,
    isRTL = false,
    getLocalizedText,
    onClick = null
}) => {
    if (!service) return null;

    // Extract service data safely
    const getServiceData = () => {
        const baseData = {
            id: service.id || Math.random().toString(36),
            title: service.title || service.name || 'Untitled Service',
            description: service.description || service.shortDescription || '',
            extraText: service.extraText || service.tagline || '',
            icon: service.icon || service.iconName || 'Font Awesome/FaHome',
            displayOrder: service.displayOrder || service.order || index,
            isActive: service.isActive || service.active || true,
            features: service.features || service.benefits || [],
            price: service.price || service.priceRange || '',
            duration: service.duration || service.timeRequired || '',
        };

        return baseData;
    };

    const data = getServiceData();

    // Design-specific styling
    const designStyles = {
        1: {
            // Modern Cinematic
            card: `bg-secondary-800 overflow-hidden group hover:shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`,
            iconContainer: 'w-16 h-16 bg-primary-500/20 flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
            icon: 'text-primary-500',
            title: 'text-white text-2xl font-bold mb-4 font-serif',
            description: 'text-neutral-300 mb-6 leading-relaxed',
            extraText: 'text-primary-400 font-medium flex items-center gap-2',
            features: 'mt-6 space-y-2',
            feature: 'text-neutral-400 text-sm flex items-center gap-2',
            borderAccent: 'border-s-4 border-primary-500 group-hover:border-primary-400',
            priceBadge: 'bg-primary-500 text-white px-3 py-1 text-sm font-semibold absolute top-4 inset-e-4',
        },
        2: {
            // Minimal Brutalist
            card: `bg-neutral-50 border-4 border-neutral-900 overflow-hidden group hover:translate-x-1 hover:translate-y-1 transition-transform duration-300 relative ${onClick ? 'cursor-pointer' : ''}`,
            iconContainer: 'w-16 h-16 bg-primary-600 flex items-center justify-center mb-6 border-4 border-neutral-900',
            icon: 'text-white',
            title: 'text-third-900 text-3xl font-black mb-4 uppercase tracking-tight',
            description: 'text-third-500 text-lg mb-6 leading-relaxed',
            extraText: 'text-third-900 font-bold flex items-start gap-3',
            features: 'mt-6 space-y-3',
            feature: 'text-third-700 text-sm flex items-center gap-2',
            borderAccent: 'border-4 border-neutral-900',
            priceBadge: 'bg-neutral-900 text-white px-3 py-1 text-sm font-bold absolute top-4 inset-e-4 border-4 border-neutral-900',
            numberBadge: 'absolute -top-6 -inset-s-6 w-16 h-16 bg-primary-600 border-4 border-neutral-900 flex items-center justify-center',
        },
        3: {
            // Soft Organic
            card: `bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 border border-primary-300/50 ${onClick ? 'cursor-pointer' : ''}`,
            iconContainer: 'w-16 h-16 bg-linear-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/30',
            icon: 'text-white',
            title: 'text-neutral-900 text-2xl font-bold mb-4 font-serif',
            description: 'text-neutral-700 mb-6 leading-relaxed',
            extraText: 'text-primary-700 font-medium flex items-center gap-2',
            features: 'mt-6 space-y-2',
            feature: 'text-neutral-600 text-sm flex items-center gap-2',
            borderAccent: 'border border-primary-300/50 group-hover:border-primary-400',
            priceBadge: 'bg-linear-to-r from-primary-600 to-primary-700 text-white px-3 py-1 text-sm font-semibold rounded-full absolute top-4 inset-e-4',
        },
        4: {
            // Glass Morphism
            card: `bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden group hover:shadow-2xl hover:bg-white/15 transition-all duration-300 border border-white/20 ${onClick ? 'cursor-pointer' : ''}`,
            iconContainer: 'w-16 h-16 bg-linear-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl shadow-primary-500/30',
            icon: 'text-white',
            title: 'text-white text-2xl font-bold mb-4 font-serif',
            description: 'text-accent-200 mb-6 leading-relaxed',
            extraText: 'text-primary-300 font-medium flex items-center gap-2',
            features: 'mt-6 space-y-2',
            feature: 'text-accent-300 text-sm flex items-center gap-2',
            borderAccent: 'border border-white/20 group-hover:border-primary-400/50',
            priceBadge: 'bg-linear-to-r from-primary-600 to-accent-600 text-white px-3 py-1 text-sm font-semibold rounded-lg absolute top-4 inset-e-4',
        },
    };

    const style = designStyles[designOption] || designStyles[1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`${style.card} ${style.borderAccent} p-8 h-full flex flex-col relative`}
            onClick={onClick}
        >
            {/* Number Badge (Only for Option 2) */}
            {designOption === 2 && (
                <div className={style.numberBadge}>
                    <span className="text-2xl font-black text-white">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>
            )}

            {/* Price Badge */}
            {data.price && (
                <div className={style.priceBadge}>
                    {data.price}
                </div>
            )}

            {/* Icon with DynamicIconLazy */}
            <div className={style.iconContainer}>
                <DynamicIconLazy
                    icon={data.icon}
                    className={style.icon}
                    size={designOption === 2 ? "2em" : "1.5em"}
                    fallback={
                        <div className="flex items-center justify-center">
                            <FiHome className={`${style.icon} ${designOption === 2 ? 'text-3xl' : 'text-2xl'}`} />
                        </div>
                    }
                />
            </div>

            {/* Title */}
            <h3 className={style.title}>
                {getLocalizedText ? getLocalizedText(service, 'title') : data.title}
            </h3>

            {/* Description */}
            <p className={style.description}>
                {getLocalizedText ? getLocalizedText(service, 'description') : data.description}
            </p>

            {/* Extra Text */}
            {data.extraText && (
                <div className={style.extraText}>
                    <FiCheck className={designOption === 2 ? 'text-neutral-900' : 'text-primary-500'} />
                    <span>
                        {getLocalizedText ? getLocalizedText(service, 'extraText') : data.extraText}
                    </span>
                </div>
            )}

            {/* Features/Benefits */}
            {data.features && data.features.length > 0 && (
                <div className={style.features}>
                    {data.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className={style.feature}>
                            <FiCheck className={designOption === 2 ? 'text-neutral-900' : 'text-primary-500'} />
                            <span>{typeof feature === 'string' ? feature : feature.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Duration Badge */}
            {data.duration && (
                <div className={`mt-4 flex items-center gap-2 ${designOption === 4 ? 'text-accent-300' : 'text-neutral-500'}`}>
                    <FiClock />
                    <span className="text-sm">{data.duration}</span>
                </div>
            )}

            {/* Hover Arrow (Only for Option 1 and 4) */}
            {(designOption === 1 || designOption === 4) && (
                <div className={`absolute bottom-6 inset-e-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${designOption === 4 ? 'text-primary-400' : 'text-primary-500'}`}>
                    <FiArrowRight className={`text-xl ${isRTL ? 'rotate-180' : ''}`} />
                </div>
            )}

            {/* Offset Border Effect (Only for Option 2) */}
            {designOption === 2 && (
                <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-3' : 'translate-x-3'} translate-y-3 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform`} />
            )}
        </motion.div>
    );
};

/* ============================================
   OPTION 1: MODERN CINEMATIC SERVICES
   ============================================ */
export function ServicesOption1({
    serviceSection,
    isRTL,
    getLocalizedText,
    sectionTitle = '',
    showAllServices = false
}) {
    const services = serviceSection?.serviceItems
        ?.filter(item => item.isActive)
        ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    if (!serviceSection || services.length === 0) return null;

    const title = getLocalizedText(serviceSection, 'title');
    const subtitle = getLocalizedText(serviceSection, 'subTitle');

    return (
        <section className="py-24 bg-secondary-900 relative overflow-hidden">
            {/* Diagonal Background Accent */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    background: `linear-gradient(${isRTL ? '135deg' : '45deg'}, transparent 45%, var(--color-primary-500) 45%, var(--color-primary-500) 55%, transparent 55%)`,
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
                        <FiBriefcase className="text-primary-500 text-xl" /> {/* ← changed icon – feel free to use FiSettings, FiGrid, FiLayers… */}
                        <div className="h-px w-8 bg-primary-500" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
                        {title}
                    </h2>

                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, showAllServices ? services.length : 6).map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            designOption={1}
                            index={index}
                            isRTL={isRTL}
                            getLocalizedText={getLocalizedText}
                        />
                    ))}
                </div>

                {/* View All Button */}
                {!showAllServices && services.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/services"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-all hover:scale-105 border border-primary-500 hover:border-primary-600 text-sm"
                        >
                            <span>View All Services</span>
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST SERVICES
   ============================================ */
export function ServicesOption2({
    serviceSection,
    isRTL,
    getLocalizedText,
    sectionTitle = '',
    showAllServices = false
}) {
    const services = serviceSection?.serviceItems
        ?.filter(item => item.isActive)
        ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    if (!serviceSection || services.length === 0) return null;

    const title = getLocalizedText(serviceSection, 'title');
    const subtitle = getLocalizedText(serviceSection, 'subTitle');

    return (
        <section className="py-24 bg-neutral-50 relative">
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
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    {/* Section Badge */}
                    <div className="inline-block mb-6 px-8 py-3 bg-neutral-900 text-neutral-50 relative">
                        <span className="relative z-10 text-sm font-bold uppercase tracking-wider">
                            {subtitle || 'SERVICES'}
                        </span>
                        <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2`} />
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black text-third-900 leading-tight tracking-tighter mb-6 font-serif">
                        {title}
                    </h2>

                    {(serviceSection.subTitleEn || serviceSection.subTitleAr) && (
                        <p className="text-xl font-bold text-primary-600 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {services.slice(0, showAllServices ? services.length : 4).map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            designOption={2}
                            index={index}
                            isRTL={isRTL}
                            getLocalizedText={getLocalizedText}
                        />
                    ))}
                </div>

                {/* View All Button */}
                {!showAllServices && services.length > 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12 relative inline-block mx-auto group"
                    >
                        <Link
                            to="/services"
                            className="relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-neutral-900 text-neutral-50 font-bold text-sm border-4 border-neutral-900 group-hover:bg-primary-600 group-hover:border-primary-600 transition-colors"
                        >
                            <FiShield className="text-lg" />
                            <span>VIEW ALL SERVICES</span>
                            <FiArrowRight className={`text-lg ${isRTL ? 'rotate-180' : ''}`} />
                        </Link>
                        <div className={`absolute inset-0 border-4 border-neutral-900 ${isRTL ? 'translate-x-2' : 'translate-x-2'} translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform`} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC SERVICES
   ============================================ */
export function ServicesOption3({
    serviceSection,
    isRTL,
    getLocalizedText,
    sectionTitle = '',
    showAllServices = false
}) {
    const services = serviceSection?.serviceItems
        ?.filter(item => item.isActive)
        ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    if (!serviceSection || services.length === 0) return null;

    const title = getLocalizedText(serviceSection, 'title');
    const subtitle = getLocalizedText(serviceSection, 'subTitle') || "Discover how we can help you grow";

    return (
        <section className="py-24 bg-linear-to-b from-primary-50 to-neutral-50 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 inset-e-0 w-96 h-96 bg-linear-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 inset-s-0 w-96 h-96 bg-linear-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {(serviceSection.subTitleEn || serviceSection.subTitleAr) && (
                        <div className="inline-block px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full mb-6 border border-primary-300/50">
                            <span className="text-primary-700 font-semibold text-sm">
                                {subtitle}
                            </span>
                        </div>
                    )}

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent max-w-3xl mx-auto">
                        {title}
                    </h2>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, showAllServices ? services.length : 6).map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            designOption={3}
                            index={index}
                            isRTL={isRTL}
                            getLocalizedText={getLocalizedText}
                        />
                    ))}
                </div>

                {/* View All Button */}
                {!showAllServices && services.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/services"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full font-semibold transition-all hover:scale-105 shadow-xl shadow-primary-500/30 text-sm"
                        >
                            <span>View All Services</span>
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM SERVICES
   ============================================ */
export function ServicesOption4({
    serviceSection,
    isRTL,
    getLocalizedText,
    sectionTitle = '',
    showAllServices = false
}) {
    const services = serviceSection?.serviceItems
        ?.filter(item => item.isActive)
        ?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    if (!serviceSection || services.length === 0) return null;

    const title = getLocalizedText(serviceSection, 'title');
    const subtitle = getLocalizedText(serviceSection, 'subTitle');

    // Service categories
    const categories = [
        { id: 'all', label: 'All Services', count: services.length },
        { id: 'buying', label: 'Buying', count: services.filter(s => s.category === 'buying').length },
        { id: 'renting', label: 'Renting', count: services.filter(s => s.category === 'renting').length },
        { id: 'selling', label: 'Selling', count: services.filter(s => s.category === 'selling').length },
        { id: 'management', label: 'Management', count: services.filter(s => s.category === 'management').length },
    ];

    const [activeCategory, setActiveCategory] = useState('all');

    // Filter services by category
    const filteredServices = services.filter(service => {
        if (activeCategory === 'all') return true;
        return service.category === activeCategory;
    });

    return (
        <section className="py-24 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900 relative overflow-hidden">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-primary-500/20 to-primary-700/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {(serviceSection.subTitleEn || serviceSection.subTitleAr) && (
                        <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                            <span className="text-accent-200 font-semibold text-sm">
                                {subtitle}
                            </span>
                        </div>
                    )}

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent max-w-3xl mx-auto">
                        {title}
                    </h2>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === category.id
                                ? 'bg-linear-to-r from-primary-600 to-accent-600 text-white'
                                : 'bg-white/10 backdrop-blur-md text-accent-200 hover:bg-white/20'
                                }`}
                        >
                            {category.label}
                            <span className="ms-2 px-2 py-1 rounded-full bg-white/20 text-xs">
                                {category.count}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.slice(0, showAllServices ? filteredServices.length : 6).map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            designOption={4}
                            index={index}
                            isRTL={isRTL}
                            getLocalizedText={getLocalizedText}
                        />
                    ))}
                </div>

                {/* View All Button */}
                {!showAllServices && filteredServices.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/services"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-3 bg-linear-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-2xl font-semibold transition-all hover:scale-105 shadow-2xl shadow-primary-500/50 backdrop-blur-sm border border-white/20 text-sm"
                        >
                            <span>View All Services</span>
                            <FiArrowRight className={`transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ============================================
   MAIN SERVICES SECTION COMPONENT
   ============================================ */
export function ServicesSection({
    option = 1,
    serviceSection,
    isRTL = false,
    getLocalizedText,
    sectionTitle = '',
    showAllServices = false
}) {
    const components = {
        1: ServicesOption1,
        2: ServicesOption2,
        3: ServicesOption3,
        4: ServicesOption4
    };

    const Component = components[option] || ServicesOption1;

    return (
        <Component
            serviceSection={serviceSection}
            isRTL={isRTL}
            getLocalizedText={getLocalizedText}
            sectionTitle={sectionTitle}
            showAllServices={showAllServices}
        />
    );
}

// Also export individual options for manual usage
