// components/forms/TransactionTypeForm.tsx
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
        .matches(/^[a-zA-Z\s\-&]+$/, 'English name can only contain letters, spaces, hyphens, and ampersands'),
    nameAr: Yup.string()
        .required('Arabic name is required')
        .min(2, 'Arabic name must be at least 2 characters')
        .max(100, 'Arabic name must be less than 100 characters')
        .matches(/^[\u0600-\u06FF\s\-&]+$/, 'Arabic name can only contain Arabic letters, spaces, hyphens, and ampersands')
});

const TransactionTypeForm = ({
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
            try {
                await onSubmit(values);
                if (!item) {
                    resetForm();
                }
            } catch (error) {
                if (error.errors) {
                    formik.setErrors(error.errors);
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
                <h3 className="text-lg font-semibold text-neutral-900   mb-4">
                    {item ? t('dashboard.transactionTypeForm.editType') : t('dashboard.transactionTypeForm.createType')}
                </h3>
                <p className="text-sm text-neutral-600   mb-6">
                    {t('dashboard.transactionTypeForm.description')}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Input
                        label={t('dashboard.forms.nameEn')}
                        id="nameEn"
                        name="nameEn"
                        value={formik.values.nameEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('dashboard.transactionTypeForm.nameEnPlaceholder')}
                        error={formik.touched.nameEn && formik.errors.nameEn}
                        disabled={formik.isSubmitting || isSubmitting}
                        required
                        className="w-full"
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
                        id="nameAr"
                        name="nameAr"
                        value={formik.values.nameAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={t('dashboard.transactionTypeForm.nameArPlaceholder')}
                        error={formik.touched.nameAr && formik.errors.nameAr}
                        disabled={formik.isSubmitting || isSubmitting}
                        dir="rtl"
                        required
                        className="w-full"
                    />
                    {formik.touched.nameAr && formik.errors.nameAr && (
                        <div className="mt-1 text-sm text-error-600">
                            {formik.errors.nameAr}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-neutral-400">
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
                    {item ? t('dashboard.transactionTypeForm.updateType') : t('dashboard.transactionTypeForm.createType')}
                </Button>
            </div>
        </form>
    );
};

export default TransactionTypeForm;