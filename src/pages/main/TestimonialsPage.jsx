import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchActiveTestimonials } from '@/store/slices/testimonialSlice';
import Loading from '@/components/layout/Loading';
import Pagination from '@/components/common/Pagination';
import { motion } from 'framer-motion';
import {
    FiStar,
    FiCalendar,
    FiMapPin,
    FiCheckCircle,
    FiThumbsUp,
} from 'react-icons/fi';
import { LuQuote } from 'react-icons/lu';

// Testimonial Grid Card Component
const TestimonialGridCard = ({ testimonial, isRTL }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const shouldTruncate = testimonial.comment && testimonial.comment.length > 200;
    const displayComment = expanded || !shouldTruncate
        ? testimonial.comment
        : `${testimonial.comment?.substring(0, 200)}...`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="bg-neutral-50 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 border border-neutral-400 h-full flex flex-col"
        >
            <div className="p-6 flex flex-col h-full">
                {/* Quote Icon */}
                <div className="mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <LuQuote className="text-xl text-primary-600" />
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`w-4 h-4 transition-all ${i < (testimonial.rating || 0)
                                        ? 'text-warning-500 -warning-500'
                                        : 'text-neutral-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-third-900">
                        {testimonial.rating || 0}/5
                    </span>
                    {testimonial.isActive && (
                        <div className="ms-auto">
                            <FiCheckCircle className="text-lg text-success-500" title={t('testimonials.verified', 'Verified')} />
                        </div>
                    )}
                </div>

                {/* Testimonial Text */}
                <div className="grow mb-4">
                    <p className="text-third-500 leading-relaxed text-sm">
                        <span className="text-2xl text-primary-500 leading-none me-1 float-start">"</span>
                        {displayComment}
                        <span className="text-2xl text-primary-500 leading-none ms-1">"</span>
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-primary-600 text-sm font-semibold mt-2 hover:underline inline-flex items-center gap-1"
                        >
                            {expanded ? t('testimonials.readLess', 'Read Less') : t('testimonials.readMore', 'Read More')}
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-400 mb-4"></div>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl flex items-center justify-center shadow-sm font-bold text-lg shrink-0">
                        {testimonial.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>

                    <div className="grow min-w-0">
                        <h4 className="font-bold text-third-900 truncate">
                            {testimonial.name || t('testimonials.anonymous', 'Anonymous')}
                        </h4>

                        <div className="flex flex-col gap-1 mt-1">
                            {testimonial.location && (
                                <span className="text-xs text-third-500 flex items-center gap-1">
                                    <FiMapPin className="text-accent-600 shrink-0" />
                                    <span className="truncate">{testimonial.location}</span>
                                </span>
                            )}
                            {testimonial.experienceDate && (
                                <span className="text-xs text-third-500 flex items-center gap-1">
                                    <FiCalendar className="text-primary-600 shrink-0" />
                                    <span className="truncate">{formatDate(testimonial.experienceDate)}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function TestimonialsPage() {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // State for pagination
    const [pageSize] = useState(12);
    const [pageNumber, setPageNumber] = useState(1);

    // Redux state
    const {
        activeTestimonials,
        loading,
        pagination
    } = useAppSelector((state) => state.testimonial);

    // Fetch data on mount and when page changes
    useEffect(() => {
        const params = {
            pageSize,
            pageNumber,
        };

        dispatch(fetchActiveTestimonials(params));
    }, [dispatch, pageSize, pageNumber]);

    // Get pagination data with fallbacks
    const totalCount = pagination?.totalCount || 0;
    const totalPages = pagination?.totalPages || 1;
    const hasPreviousPage = pagination?.hasPreviousPage || false;
    const hasNextPage = pagination?.hasNextPage || false;

    // Calculate pagination display
    const startItem = totalCount > 0 ? (pageNumber - 1) * pageSize + 1 : 0;
    const endItem = Math.min(pageNumber * pageSize, totalCount);

    // Calculate average rating
    const calculateAverageRating = () => {
        if (!activeTestimonials || activeTestimonials.length === 0) return 0;
        const sum = activeTestimonials.reduce((acc, testimonial) => acc + (testimonial.rating || 0), 0);
        return (sum / activeTestimonials.length).toFixed(1);
    };

    // Calculate stats
    const fiveStarCount = activeTestimonials?.filter(t => t.rating === 5).length || 0;
    const verifiedCount = activeTestimonials?.filter(t => t.isActive).length || 0;

    if (loading && pageNumber === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className="layer flex items-center justify-center w-full aspect-21/5 bg-linear-to-r from-primary-600/60 to-primary-800/60 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-bold text-white mb-4 font-serif">
                                {t('testimonials.title', 'Client Testimonials')}
                            </h1>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                {t('testimonials.subtitle', 'Discover what our clients say about their experience with us')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {totalCount}
                            </div>
                            <div className="text-third-500 text-sm">
                                {t('testimonials.totalTestimonials', 'Total Testimonials')}
                            </div>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 text-center">
                            <div className="text-3xl font-bold text-warning-600 mb-2 flex items-center justify-center gap-1">
                                {calculateAverageRating()}
                                <FiStar className="w-6 h-6 -warning-500 text-warning-500" />
                            </div>
                            <div className="text-third-500 text-sm">
                                {t('testimonials.averageRating', 'Average Rating')}
                            </div>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 text-center">
                            <div className="text-3xl font-bold text-success-600 mb-2">
                                {verifiedCount}
                            </div>
                            <div className="text-third-500 text-sm">
                                {t('testimonials.verifiedReviews', 'Verified Reviews')}
                            </div>
                        </div>

                        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 text-center">
                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                {fiveStarCount}
                            </div>
                            <div className="text-third-500 text-sm">
                                {t('testimonials.fiveStar', '5-Star Reviews')}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Testimonials Grid */}
                {activeTestimonials && activeTestimonials.length > 0 ? (
                    <>
                        {/* Results Count */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-third-900 mb-1 font-serif">
                                        {t('testimonials.allTestimonials', 'All Testimonials')}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                        >
                            {activeTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * (index % 6) }}
                                >
                                    <TestimonialGridCard
                                        testimonial={testimonial}
                                        isRTL={isRTL}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-12"
                            >
                                <Pagination
                                    currentPage={pageNumber}
                                    totalPages={totalPages}
                                    totalCount={totalCount}
                                    pageSize={pageSize}
                                    hasPreviousPage={hasPreviousPage}
                                    hasNextPage={hasNextPage}
                                    onPageChange={(newPage) => {
                                        setPageNumber(newPage);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            </motion.div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <LuQuote className="text-4xl text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-third-900 mb-3 font-serif">
                                {t('testimonials.noTestimonials', 'No Testimonials Yet')}
                            </h3>
                            <p className="text-third-500 mb-8">
                                {t('testimonials.beFirst', 'Be the first to share your experience with us!')}
                            </p>
                            <button
                                onClick={() => window.location.href = '/contact-us'}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg"
                            >
                                {t('testimonials.leaveReview', 'Leave a Review')}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 bg-neutral-50 rounded-2xl p-8 sm:p-12 text-center border border-neutral-400"
                >
                    <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <FiThumbsUp className="text-3xl text-primary-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-third-900 mb-4 font-serif">
                            {t('testimonials.shareExperience', 'Share Your Experience')}
                        </h2>
                        <p className="text-third-500 mb-8">
                            {t('testimonials.shareExperienceDescription', 'Help others make informed decisions by sharing your experience with our services.')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.href = '/contact-us'}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg"
                            >
                                {t('testimonials.leaveReview', 'Leave a Review')}
                            </button>
                            <button
                                onClick={() => window.location.href = '/properties'}
                                className="px-8 py-3 bg-neutral-50 hover:bg-neutral-100 text-third-900 font-bold rounded-xl transition-all border-2 border-neutral-400"
                            >
                                {t('testimonials.viewProperties', 'View Properties')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}