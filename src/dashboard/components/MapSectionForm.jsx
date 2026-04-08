// dashboard/components/MapSectionForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Validation schema
const validationSchema = Yup.object({
    titleEn: Yup.string()
        .required('English title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be less than 200 characters'),
    titleAr: Yup.string()
        .required('Arabic title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be less than 200 characters'),
    embedCode: Yup.string()
        .required('Embed code is required')
        .min(10, 'Embed code must be at least 10 characters'),
    latitude: Yup.number()
        .required('Latitude is required')
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
    longitude: Yup.number()
        .required('Longitude is required')
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
    addressTextEn: Yup.string()
        .required('English address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address must be less than 500 characters'),
    addressTextAr: Yup.string()
        .required('Arabic address is required')
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address must be less than 500 characters'),
});

const MapSectionForm = ({ item, onSubmit, onCancel, isSubmitting = false }) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            titleEn: item?.titleEn || '',
            titleAr: item?.titleAr || '',
            embedCode: item?.embedCode || '',
            latitude: item?.latitude || '',
            longitude: item?.longitude || '',
            addressTextEn: item?.addressTextEn || '',
            addressTextAr: item?.addressTextAr || '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await onSubmit(values);
                if (!item) {
                    resetForm();
                }
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    }); ``

    const handleCancel = () => {
        formik.resetForm();
        onCancel();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
            <div>
                <h3 className="text-lg font-semibold text-third-900   mb-4">
                    {item ? t('dashboard.mapSectionForm.edit') : t('dashboard.mapSectionForm.create')}
                </h3>
                <p className="text-sm text-third-500   mb-6">
                    {t('dashboard.mapSectionForm.description')}
                </p>
            </div>

            {/* English Fields */}
            <div className="space-y-4">
                <Input
                    label={`${t('dashboard.mapSectionForm.titleEn')} *`}
                    id="titleEn"
                    name="titleEn"
                    value={formik.values.titleEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.titleEnPlaceholder')}
                    error={formik.touched.titleEn && formik.errors.titleEn}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.titleEn && formik.errors.titleEn && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.titleEn}
                    </div>
                )}

                <Textarea
                    label={`${t('dashboard.mapSectionForm.addressTextEn')} *`}
                    id="addressTextEn"
                    name="addressTextEn"
                    rows={3}
                    value={formik.values.addressTextEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.addressTextEnPlaceholder')}
                    error={formik.touched.addressTextEn && formik.errors.addressTextEn}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.addressTextEn && formik.errors.addressTextEn && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.addressTextEn}
                    </div>
                )}
            </div>

            {/* Arabic Fields */}
            <div className="space-y-4">
                <Input
                    label={`${t('dashboard.mapSectionForm.titleAr')} *`}
                    id="titleAr"
                    name="titleAr"
                    value={formik.values.titleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.titleArPlaceholder')}
                    error={formik.touched.titleAr && formik.errors.titleAr}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    dir="rtl"
                />
                {formik.touched.titleAr && formik.errors.titleAr && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.titleAr}
                    </div>
                )}

                <Textarea
                    label={`${t('dashboard.mapSectionForm.addressTextAr')} *`}
                    id="addressTextAr"
                    name="addressTextAr"
                    rows={3}
                    value={formik.values.addressTextAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.addressTextArPlaceholder')}
                    error={formik.touched.addressTextAr && formik.errors.addressTextAr}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    dir="rtl"
                />
                {formik.touched.addressTextAr && formik.errors.addressTextAr && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.addressTextAr}
                    </div>
                )}
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={`${t('dashboard.mapSectionForm.latitude')} *`}
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.latitudePlaceholder')}
                    error={formik.touched.latitude && formik.errors.latitude}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.latitude && formik.errors.latitude && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.latitude}
                    </div>
                )}

                <Input
                    label={`${t('dashboard.mapSectionForm.longitude')} *`}
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formik.values.longitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.longitudePlaceholder')}
                    error={formik.touched.longitude && formik.errors.longitude}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.longitude && formik.errors.longitude && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.longitude}
                    </div>
                )}
            </div>

            {/* Embed Code */}
            <div>
                <Textarea
                    label={`${t('dashboard.mapSectionForm.embedCode')} *`}
                    id="embedCode"
                    name="embedCode"
                    rows={6}
                    value={formik.values.embedCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.mapSectionForm.embedCodePlaceholder')}
                    error={formik.touched.embedCode && formik.errors.embedCode}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    className="font-mono text-xs"
                />
                {formik.touched.embedCode && formik.errors.embedCode && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.embedCode}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    disabled={formik.isSubmitting || isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    disabled={formik.isSubmitting || !formik.isValid || isSubmitting}
                    loading={formik.isSubmitting || isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
};

export default MapSectionForm;