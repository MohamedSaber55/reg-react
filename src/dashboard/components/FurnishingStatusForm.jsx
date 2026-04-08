import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Validation schema
const validationSchema = Yup.object({
    nameEn: Yup.string()
        .required('English name is required')
        .min(2, 'English name must be at least 2 characters')
        .max(100, 'English name must be less than 100 characters')
        .matches(/^[a-zA-Z\s]+$/, 'English name can only contain letters and spaces'),
    nameAr: Yup.string()
        .required('Arabic name is required')
        .min(2, 'Arabic name must be at least 2 characters')
        .max(100, 'Arabic name must be less than 100 characters')
        .matches(/^[\u0600-\u06FF\s]+$/, 'Arabic name can only contain Arabic letters and spaces')
});

const FurnishingStatusForm = ({
    item,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            nameEn: item?.nameEn || '',
            nameAr: item?.nameAr || ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
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
        enableReinitialize: true // Re-initialize when item changes
    });

    const handleCancel = () => {
        formik.resetForm();
        onCancel();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            <div>
                <Input
                    label={t('dashboard.forms.nameEn')}
                    required
                    id="nameEn"
                    name="nameEn"
                    value={formik.values.nameEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.forms.nameEnPlaceholder')}
                    error={formik.touched.nameEn && formik.errors.nameEn}
                    disabled={formik.isSubmitting || isSubmitting}
                />
                {formik.touched.nameEn && formik.errors.nameEn && (
                    <div className="mt-1 text-sm text-error-600">
                        {formik.errors.nameEn}
                    </div>
                )}
            </div>

            <div>
                <Input
                    label={t('dashboard.forms.nameAr')}
                    required
                    id="nameAr"
                    name="nameAr"
                    value={formik.values.nameAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.forms.nameArPlaceholder')}
                    error={formik.touched.nameAr && formik.errors.nameAr}
                    disabled={formik.isSubmitting || isSubmitting}
                    dir="rtl"
                />
                {formik.touched.nameAr && formik.errors.nameAr && (
                    <div className="mt-1 text-sm text-error-600">
                        {formik.errors.nameAr}
                    </div>
                )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="outline"
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    disabled={formik.isSubmitting || isSubmitting}
                    className="min-w-25"
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    disabled={formik.isSubmitting || !formik.isValid || isSubmitting}
                    loading={formik.isSubmitting || isSubmitting}
                    className="min-w-30"
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
};

export default FurnishingStatusForm;