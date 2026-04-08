// dashboard/components/AddressForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AddressForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Validation Schema
    const validationSchema = Yup.object({
        countryEn: Yup.string()
            .required(t('dashboard.validation.countryEnRequired', 'Country (English) is required'))
            .min(2, t('dashboard.validation.countryEnMin', 'Country must be at least 2 characters'))
            .max(100, t('dashboard.validation.countryEnMax', 'Country must not exceed 100 characters')),
        countryAr: Yup.string()
            .required(t('dashboard.validation.countryArRequired', 'Country (Arabic) is required'))
            .min(2, t('dashboard.validation.countryArMin', 'Country must be at least 2 characters'))
            .max(100, t('dashboard.validation.countryArMax', 'Country must not exceed 100 characters')),
        cityEn: Yup.string()
            .required(t('dashboard.validation.cityEnRequired', 'City (English) is required'))
            .min(2, t('dashboard.validation.cityEnMin', 'City must be at least 2 characters'))
            .max(100, t('dashboard.validation.cityEnMax', 'City must not exceed 100 characters')),
        cityAr: Yup.string()
            .required(t('dashboard.validation.cityArRequired', 'City (Arabic) is required'))
            .min(2, t('dashboard.validation.cityArMin', 'City must be at least 2 characters'))
            .max(100, t('dashboard.validation.cityArMax', 'City must not exceed 100 characters')),
        streetEn: Yup.string()
            .required(t('dashboard.validation.streetEnRequired', 'Street (English) is required'))
            .min(2, t('dashboard.validation.streetEnMin', 'Street must be at least 2 characters'))
            .max(200, t('dashboard.validation.streetEnMax', 'Street must not exceed 200 characters')),
        streetAr: Yup.string()
            .required(t('dashboard.validation.streetArRequired', 'Street (Arabic) is required'))
            .min(2, t('dashboard.validation.streetArMin', 'Street must be at least 2 characters'))
            .max(200, t('dashboard.validation.streetArMax', 'Street must not exceed 200 characters')),
        detailsEn: Yup.string()
            .max(500, t('dashboard.validation.detailsEnMax', 'Details must not exceed 500 characters')),
        detailsAr: Yup.string()
            .max(500, t('dashboard.validation.detailsArMax', 'Details must not exceed 500 characters')),
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            countryEn: item?.countryEn || '',
            countryAr: item?.countryAr || '',
            cityEn: item?.cityEn || '',
            cityAr: item?.cityAr || '',
            streetEn: item?.streetEn || '',
            streetAr: item?.streetAr || '',
            detailsEn: item?.detailsEn || '',
            detailsAr: item?.detailsAr || '',
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.country', 'Country')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.countryEn', 'Country (English)')}
                        name="countryEn"
                        value={formik.values.countryEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.countryEn && formik.errors.countryEn}
                        required
                        placeholder="e.g., Egypt"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.countryAr', 'الدولة')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.countryAr', 'Country (Arabic)')}
                        name="countryAr"
                        value={formik.values.countryAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.countryAr && formik.errors.countryAr}
                        dir="rtl"
                        required
                        placeholder="مثال: مصر"
                    />
                </div>
            </div>

            {/* City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.city', 'City')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.cityEn', 'City (English)')}
                        name="cityEn"
                        value={formik.values.cityEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cityEn && formik.errors.cityEn}
                        required
                        placeholder="e.g., Cairo"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.cityAr', 'المدينة')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.cityAr', 'City (Arabic)')}
                        name="cityAr"
                        value={formik.values.cityAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cityAr && formik.errors.cityAr}
                        dir="rtl"
                        required
                        placeholder="مثال: القاهرة"
                    />
                </div>
            </div>

            {/* Street */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.street', 'Street')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.streetEn', 'Street (English)')}
                        name="streetEn"
                        value={formik.values.streetEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.streetEn && formik.errors.streetEn}
                        required
                        placeholder="e.g., Tahrir Street"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.streetAr', 'الشارع')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.streetAr', 'Street (Arabic)')}
                        name="streetAr"
                        value={formik.values.streetAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.streetAr && formik.errors.streetAr}
                        dir="rtl"
                        required
                        placeholder="مثال: شارع التحرير"
                    />
                </div>
            </div>

            {/* Details (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.details', 'Additional Details')}
                    </h3>
                    <Textarea
                        label={t('dashboard.forms.detailsEn', 'Details (English)')}
                        name="detailsEn"
                        value={formik.values.detailsEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.detailsEn && formik.errors.detailsEn}
                        rows={3}
                        placeholder="Additional address details, landmarks, etc."
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900 border-b border-neutral-400 pb-2">
                        {t('dashboard.forms.detailsAr', 'تفاصيل إضافية')}
                    </h3>
                    <Textarea
                        label={t('dashboard.forms.detailsAr', 'Details (Arabic)')}
                        name="detailsAr"
                        value={formik.values.detailsAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.detailsAr && formik.errors.detailsAr}
                        dir="rtl"
                        rows={3}
                        placeholder="تفاصيل إضافية للعنوان، معالم، إلخ"
                    />
                </div>
            </div>

            {/* Display form-level errors if any */}
            {formik.submitCount > 0 && !formik.isValid && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                    <p className="text-sm text-error-700 font-medium">
                        {t('dashboard.validation.formErrors', 'Please fix the errors above before submitting')}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={formik.isSubmitting}
                    disabled={formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}