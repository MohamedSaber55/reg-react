// app/testimonials/submit/page.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from '@/components/common/Alert';
import Loading from '@/components/layout/Loading';
import {
    FiUser,
    FiStar,
    FiMapPin,
    FiCalendar,
    FiMail,
    FiMessageCircle,
    FiCheckCircle,
    FiArrowLeft
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
// Import Redux actions
import { createTestimonial, clearError } from '@/store/slices/testimonialSlice';
import { useAppSelector } from '@/hooks/redux';
import { fetchContactEmails } from '@/store/slices/contactEmailSlice';

export default function SubmitTestimonialPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';


    // Get state from Redux store
    const { operationLoading, error } = useAppSelector((state) => state.testimonial);
    const { contactEmails } = useAppSelector((state) => state.contactEmail);
    const primaryEmail = contactEmails?.[0];
    console.log(primaryEmail);

    const [submitted, setSubmitted] = useState(false);
    const [localAlert, setLocalAlert] = useState(null);

    useEffect(() => {
        dispatch(fetchContactEmails());
    }, [])

    // Clear Redux errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    // Show Redux errors in local alert
    useEffect(() => {
        if (error) {
            setLocalAlert({
                type: 'error',
                message: error
            });

            // Auto-hide alert after 10 seconds
            setTimeout(() => {
                setLocalAlert(null);
                dispatch(clearError());
            }, 10000);
        }
    }, [error, dispatch]);

    // Validation schema matching your dashboard form
    const validationSchema = Yup.object({
        name: Yup.string()
            .trim()
            .required(t('testimonial.nameRequired', 'Name is required'))
            .min(2, t('testimonial.nameMinLength', 'Name must be at least 2 characters'))
            .max(100, t('testimonial.nameMaxLength', 'Name must be less than 100 characters')),
        comment: Yup.string()
            .trim()
            .required(t('testimonial.commentRequired', 'Comment is required'))
            .min(10, t('testimonial.commentMinLength', 'Comment must be at least 10 characters'))
            .max(500, t('testimonial.commentMaxLength', 'Comment must be less than 500 characters')),
        location: Yup.string()
            .trim()
            .required(t('testimonial.locationRequired', 'Location is required'))
            .min(2, t('testimonial.locationMinLength', 'Location must be at least 2 characters'))
            .max(100, t('testimonial.locationMaxLength', 'Location must be less than 100 characters')),
        email: Yup.string()
            .trim()
            .email(t('testimonial.emailInvalid', 'Invalid email address'))
            .required(t('testimonial.emailRequired', 'Email is required')),
        experienceDate: Yup.date()
            .required(t('testimonial.dateRequired', 'Experience date is required'))
            .max(new Date(), t('testimonial.dateFuture', 'Experience date cannot be in the future')),
        rating: Yup.number()
            .required(t('testimonial.ratingRequired', 'Rating is required'))
            .min(1, t('testimonial.ratingMin', 'Rating must be at least 1'))
            .max(5, t('testimonial.ratingMax', 'Rating must be at most 5'))
            .integer(t('testimonial.ratingInteger', 'Rating must be a whole number')),
        agreeToTerms: Yup.boolean()
            .oneOf([true], t('testimonial.agreeRequired', 'You must agree to the terms and conditions'))
    });

    // Formik form
    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            location: '',
            email: '',
            experienceDate: '',
            rating: 5,
            agreeToTerms: false
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                // Format date to ISO string
                const experienceDateISO = new Date(values.experienceDate).toISOString();

                // Create FormData object
                const formData = new FormData();

                // Add text fields
                formData.append('name', values.name.trim());
                formData.append('comment', values.comment.trim());
                formData.append('location', values.location.trim());
                formData.append('email', values.email.trim());
                formData.append('experienceDate', experienceDateISO);
                formData.append('rating', parseInt(values.rating, 10));
                formData.append('isActive', 'false');
                formData.append('isFeatured', 'false');

                // Dispatch create testimonial action
                const result = await dispatch(createTestimonial(formData)).unwrap();

                // Success
                if (result) {
                    setSubmitted(true);
                    resetForm();

                    toast.success(
                        t('testimonial.submissionSuccess', 'Thank you for your testimonial! It will be reviewed and published soon.')
                    );

                    // Auto-redirect after 5 seconds
                    setTimeout(() => {
                        navigate('/');
                    }, 5000);
                }

            } catch (error) {
                console.error('Error submitting testimonial:', error);

                // Error is already handled by Redux slice and shown via useEffect
                toast.error(
                    t('testimonial.submissionError', 'Failed to submit testimonial. Please try again.')
                );
            }
        }
    });

    if (operationLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (submitted) {
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
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    {t('testimonial.thankYou', 'Thank You!')}
                                </h1>
                                <p className="text-lg text-white/90">
                                    {t('testimonial.reviewMessage', 'Your testimonial has been submitted successfully.')}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Success Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="mb-8">
                            <div className="w-20 h-20 mx-auto bg-success-100 rounded-full flex items-center justify-center mb-6">
                                <FiCheckCircle className="text-4xl text-success-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-third-900 mb-4">
                                {t('testimonial.successTitle', 'Testimonial Submitted Successfully')}
                            </h2>
                            <p className="text-third-500 text-lg mb-8">
                                {t('testimonial.successDescription', 'Thank you for sharing your experience with us. Your testimonial will be reviewed and published on our website soon.')}
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
                                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                                    {t('testimonial.whatsNext', 'What happens next?')}
                                </h3>
                                <ul className="text-third-500 text-left space-y-2">
                                    <li className="flex items-start gap-2">
                                        <FiCheckCircle className="text-success-600 mt-1" />
                                        <span>{t('testimonial.reviewStep', 'Our team will review your testimonial')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FiCheckCircle className="text-success-600 mt-1" />
                                        <span>{t('testimonial.approvalStep', 'Once approved, it will appear on our website')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FiCheckCircle className="text-success-600 mt-1" />
                                        <span>{t('testimonial.featuredStep', 'Exceptional testimonials may be featured on our homepage')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/"
                                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                            >
                                {t('testimonial.backToHome', 'Back to Home')}
                            </Link>
                            <Link
                                to="/testimonials"
                                className="px-6 py-3 bg-neutral-50 border border-neutral-400 text-third-900 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                {t('testimonial.viewTestimonials', 'View All Testimonials')}
                            </Link>
                        </div>

                        <p className="text-sm text-third-400 mt-8">
                            {t('testimonial.redirectMessage', 'You will be redirected to the homepage in 5 seconds...')}
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

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
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {t('testimonial.title', 'Share Your Experience')}
                            </h1>
                            <p className="text-lg text-white/90">
                                {t('testimonial.subtitle', 'Help others by sharing your experience with our services')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Alert Message */}
                    {localAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Alert
                                variant={localAlert.type}
                                dismissible
                                onDismiss={() => {
                                    setLocalAlert(null);
                                    dispatch(clearError());
                                }}
                            >
                                {localAlert.message}
                            </Alert>
                        </motion.div>
                    )}

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-400"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-third-900 mb-2 font-serif">
                                {t('testimonial.formTitle', 'Share Your Testimonial')}
                            </h2>
                            <p className="text-third-500">
                                {t('testimonial.formDescription', 'Please out the form below. All fields are required.')}
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('testimonial.name', 'Your Name')} *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                                            <FiUser className="w-5 h-5 text-third-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 ps-10 rounded-xl bg-neutral-50 border ${formik.touched.name && formik.errors.name
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                            placeholder={t('testimonial.namePlaceholder', 'Enter your full name')}
                                        />
                                    </div>
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('testimonial.email', 'Email Address')} *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                                            <FiMail className="w-5 h-5 text-third-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 ps-10 rounded-xl bg-neutral-50 border ${formik.touched.email && formik.errors.email
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                            placeholder={t('testimonial.emailPlaceholder', 'Enter your email')}
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Location and Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('testimonial.location', 'Your Location')} *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                                            <FiMapPin className="w-5 h-5 text-third-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formik.values.location}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full px-4 py-3 ps-10 rounded-xl bg-neutral-50 border ${formik.touched.location && formik.errors.location
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                            placeholder={t('testimonial.locationPlaceholder', 'City, Country')}
                                        />
                                    </div>
                                    {formik.touched.location && formik.errors.location && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.location}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('testimonial.experienceDate', 'Experience Date')} *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                                            <FiCalendar className="w-5 h-5 text-third-400" />
                                        </div>
                                        <input
                                            type="date"
                                            id="experienceDate"
                                            name="experienceDate"
                                            value={formik.values.experienceDate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            max={new Date().toISOString().split('T')[0]}
                                            className={`w-full px-4 py-3 ps-10 rounded-xl bg-neutral-50 border ${formik.touched.experienceDate && formik.errors.experienceDate
                                                ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                                : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                                } focus:ring-2 text-third-900 outline-none transition-all`}
                                        />
                                    </div>
                                    {formik.touched.experienceDate && formik.errors.experienceDate && (
                                        <p className="mt-1 text-sm text-error-500">{formik.errors.experienceDate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-third-900 mb-2">
                                    {t('testimonial.rating', 'Your Rating')} *
                                </label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => formik.setFieldValue('rating', star)}
                                                className={`p-1 rounded-full transition-all ${star <= formik.values.rating
                                                    ? 'text-warning-500 bg-warning-50'
                                                    : 'text-neutral-300 hover:text-warning-400'
                                                    }`}
                                                aria-label={`Rate ${star} stars`}
                                            >
                                                <FiStar className="w-8 h-8" />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold text-third-900">
                                        {formik.values.rating} {t('testimonial.stars', 'stars')}
                                    </span>
                                </div>
                                {formik.touched.rating && formik.errors.rating && (
                                    <p className="mt-1 text-sm text-error-500">{formik.errors.rating}</p>
                                )}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-third-900 mb-2">
                                    {t('testimonial.comment', 'Your Testimonial')} *
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 inset-s-3">
                                        <FiMessageCircle className="w-5 h-5 text-third-400" />
                                    </div>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows={6}
                                        value={formik.values.comment}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full px-4 py-3 ps-10 rounded-xl bg-neutral-50 border ${formik.touched.comment && formik.errors.comment
                                            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
                                            : 'border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20'
                                            } focus:ring-2 text-third-900 outline-none transition-all resize-none`}
                                        placeholder={t('testimonial.commentPlaceholder', 'Tell us about your experience... (10-500 characters)')}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    {formik.touched.comment && formik.errors.comment ? (
                                        <p className="text-sm text-error-500">{formik.errors.comment}</p>
                                    ) : (
                                        <p className="text-sm text-third-500">
                                            {formik.values.comment.length}/500 {t("testimonial.characters", "characters")}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-400">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formik.values.agreeToTerms}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-5 h-5 mt-1 text-primary-500 rounded focus:ring-primary-500"
                                    />
                                    <div>
                                        <label htmlFor="agreeToTerms" className="text-sm font-medium text-third-900">
                                            {t('testimonial.agreeTerms', 'I agree to the terms and conditions')} *
                                        </label>
                                        <p className="text-sm text-third-500 mt-1">
                                            {t('testimonial.termsDescription', 'By submitting this testimonial, you agree that we may publish it on our website and marketing materials. All testimonials are subject to review before publication.')}
                                        </p>
                                    </div>
                                </div>
                                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                                    <p className="mt-2 text-sm text-error-500">{formik.errors.agreeToTerms}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!formik.isValid || operationLoading}
                                className="w-full px-6 py-4 bg-linear-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {operationLoading
                                    ? t('testimonial.submitting', 'Submitting...')
                                    : t('testimonial.submitButton', 'Submit Testimonial')
                                }
                            </button>
                        </form>
                    </motion.div>

                    {/* Additional Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-8 space-y-4"
                    >
                        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
                            <h3 className="text-lg font-semibold text-primary-900 mb-2">
                                {t('testimonial.guidelinesTitle', 'Testimonial Guidelines')}
                            </h3>
                            <ul className="text-third-500 space-y-2">
                                <li className="flex items-start gap-2">
                                    <FiCheckCircle className="text-success-600 mt-1" />
                                    <span>{t('testimonial.guideline1', 'Be honest and genuine about your experience')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FiCheckCircle className="text-success-600 mt-1" />
                                    <span>{t('testimonial.guideline2', 'Focus on specific aspects you appreciated')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FiCheckCircle className="text-success-600 mt-1" />
                                    <span>{t('testimonial.guideline3', 'Keep it professional and respectful')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FiCheckCircle className="text-success-600 mt-1" />
                                    <span>{t('testimonial.guideline4', 'All testimonials are subject to review')}</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-center text-third-500 text-sm">
                            {t('testimonial.contactInfo', 'Have questions? Contact us at')}{' '}
                            <a href={`mailto:${primaryEmail?.email}`} className="text-primary-600 hover:text-primary-700">
                                {primaryEmail?.email}
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}