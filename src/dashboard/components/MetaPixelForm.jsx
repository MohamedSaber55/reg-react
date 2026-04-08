import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import { FiSave, FiX, FiCode, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Validation schema
const validationSchema = Yup.object({
    metaPixelId: Yup.string()
        .required('Meta Pixel ID is required')
        .min(15, 'Meta Pixel ID must be at least 15 characters')
        .max(20, 'Meta Pixel ID must be less than 20 characters')
        .matches(/^\d+$/, 'Meta Pixel ID must contain only numbers'),
    googleAnalyticsId: Yup.string()
        .optional()
        .max(20, 'Google Analytics ID must be less than 20 characters')
        .matches(/^(UA-|G-|GTM-)?[A-Z0-9-]+$/i, 'Invalid Google Analytics ID format')
});

const MetaPixelForm = ({
    item,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            metaPixelId: item?.metaPixelId || '',
            googleAnalyticsId: item?.googleAnalyticsId || '',
            isActive: item?.isActive ?? true
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await onSubmit(values);
                if (!item) {
                    resetForm();
                }
            } catch (error) {
                if (error.errors) {
                    formik.setErrors(error.errors);
                } else if (error.message) {
                    formik.setFieldError('metaPixelId', error.message);
                }
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });

    const handleCancel = () => {
        formik.resetForm();
        onCancel();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
            <div>
                <Input
                    label={`${t('dashboard.metaPixels.form.metaPixelId')} *`}
                    id="metaPixelId"
                    name="metaPixelId"
                    type="text"
                    value={formik.values.metaPixelId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.metaPixels.form.metaPixelIdPlaceholder')}
                    error={formik.touched.metaPixelId && formik.errors.metaPixelId}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    leftIcon={<FiCode className="text-gray-400" />}
                    helperText={t('dashboard.metaPixels.form.metaPixelIdHelper')}
                    maxLength={20}
                />
            </div>

            <div>
                <Input
                    label={t('dashboard.metaPixels.form.googleAnalyticsId')}
                    id="googleAnalyticsId"
                    name="googleAnalyticsId"
                    type="text"
                    value={formik.values.googleAnalyticsId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.metaPixels.form.googleAnalyticsIdPlaceholder')}
                    error={formik.touched.googleAnalyticsId && formik.errors.googleAnalyticsId}
                    disabled={formik.isSubmitting || isSubmitting}
                    leftIcon={<FiBarChart2 className="text-gray-400" />}
                    helperText={t('dashboard.metaPixels.form.googleAnalyticsIdHelper')}
                    maxLength={20}
                />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FiCheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t('dashboard.metaPixels.form.isActive')}
                        </label>
                        <p className="text-sm text-gray-500">
                            {t('dashboard.metaPixels.form.isActiveHelper')}
                        </p>
                    </div>
                </div>
                <Switch
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}  // Changed to onCheckedChange
                    disabled={formik.isSubmitting || isSubmitting}
                />
            </div>

            {formik.values.isActive && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <div className="shrink-0">
                            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20">
                                <path Rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-800">
                                {t('dashboard.metaPixels.form.activeNoteTitle')}
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                {t('dashboard.metaPixels.form.activeNoteDescription')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 justify-end pt-6 border-t border-neutral-200">
                <Button
                    type="button"
                    variant="outline"
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    disabled={formik.isSubmitting || isSubmitting}
                    className="min-w-24"
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    disabled={formik.isSubmitting || !formik.isValid || isSubmitting}
                    loading={formik.isSubmitting || isSubmitting}
                    className="min-w-32"
                >
                    {item ? t('dashboard.metaPixels.form.updateTracking') : t('dashboard.metaPixels.form.createTracking')}
                </Button>
            </div>
        </form>
    );
};

export default MetaPixelForm;