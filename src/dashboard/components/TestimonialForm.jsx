// dashboard/components/TestimonialForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX, FiUser, FiStar, FiMapPin, FiCalendar, FiMail } from 'react-icons/fi';
import { Alert } from '@/components/common/Alert';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    comment: Yup.string()
        .required('Comment is required')
        .min(10, 'Comment must be at least 10 characters')
        .max(500, 'Comment must be less than 500 characters'),
    location: Yup.string()
        .required('Location is required')
        .min(2, 'Location must be at least 2 characters')
        .max(100, 'Location must be less than 100 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    experienceDate: Yup.date()
        .required('Experience date is required')
        .max(new Date(), 'Experience date cannot be in the future'),
    rating: Yup.number()
        .required('Rating is required')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5')
        .integer('Rating must be a whole number'),
    isActive: Yup.boolean()
});

export const TestimonialForm = ({ item, onSubmit, onCancel }) => {
    const { t } = useTranslation();
    const [error, setError] = React.useState('');

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const formik = useFormik({
        initialValues: {
            name: item?.name || '',
            comment: item?.comment || '',
            location: item?.location || '',
            email: item?.email || '',
            experienceDate: formatDateForInput(item?.experienceDate) || '',
            rating: item?.rating || 5,
            isActive: item?.isActive ?? true
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const experienceDateISO = new Date(values.experienceDate).toISOString();

                const testimonialData = {
                    name: values.name,
                    comment: values.comment,
                    location: values.location,
                    email: values.email,
                    experienceDate: experienceDateISO,
                    rating: parseInt(values.rating, 10),
                    isActive: values.isActive
                };

                if (item?.id) {
                    testimonialData.id = item.id;
                }

                await onSubmit(testimonialData);
            } catch (err) {
                setError(err.message || 'Failed to save testimonial. Please try again.');
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {error && (
                <Alert variant="error" dismissible onDismiss={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t('dashboard.forms.name')}
                    required
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                    placeholder={t('dashboard.forms.namePlaceholder')}
                    leftIcon={<FiUser className="w-4 h-4" />}
                />
                <Input
                    label={t('dashboard.forms.email')}
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email}
                    placeholder={t('dashboard.forms.emailPlaceholder')}
                    leftIcon={<FiMail className="w-4 h-4" />}
                />
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t('dashboard.forms.location')}
                    required
                    id="location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location && formik.errors.location}
                    placeholder={t('dashboard.forms.locationPlaceholder')}
                    leftIcon={<FiMapPin className="w-4 h-4" />}
                />
                <Input
                    label={t('dashboard.forms.experienceDate')}
                    required
                    type="date"
                    id="experienceDate"
                    name="experienceDate"
                    value={formik.values.experienceDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experienceDate && formik.errors.experienceDate}
                    leftIcon={<FiCalendar className="w-4 h-4" />}
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>

            {/* Comment */}
            <div>
                <Textarea
                    label={t('dashboard.forms.comment')}
                    required
                    id="comment"
                    name="comment"
                    rows={4}
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.comment && formik.errors.comment}
                    placeholder={t('dashboard.forms.commentPlaceholder')}
                />
            </div>

            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-third-900   mb-2">
                    {t('dashboard.forms.rating')} *
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => formik.setFieldValue('rating', star)}
                            className={`p-1 rounded-full transition-colors ${star <= formik.values.rating
                                ? 'text-warning-500 bg-warning-50  '
                                : 'text-neutral-300   hover:text-warning-400'
                                }`}
                            aria-label={`Rate ${star} stars`}
                        >
                            <FiStar className="w-6 h-6" />
                        </button>
                    ))}
                    <span className="ms-2 text-sm text-third-500">
                        {formik.values.rating} {t('dashboard.forms.stars')}
                    </span>
                </div>
                {formik.touched.rating && formik.errors.rating && (
                    <p className="mt-1 text-sm text-error-500">{formik.errors.rating}</p>
                )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 p-4 bg-neutral-50   rounded-xl">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                    className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-third-900">
                    {t('dashboard.forms.activeLabel')}
                </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={onCancel}
                    disabled={formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    loading={formik.isSubmitting}
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')} {t('dashboard.forms.testimonial')}
                </Button>
            </div>
        </form>
    );
};