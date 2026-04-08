import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object({
    nameEn: Yup.string()
        .required('English name is required')
        .min(2, 'English name must be at least 2 characters')
        .max(100, 'English name must be less than 100 characters'),
    nameAr: Yup.string()
        .required('Arabic name is required')
        .min(2, 'Arabic name must be at least 2 characters')
        .max(100, 'Arabic name must be less than 100 characters'),
    isActive: Yup.boolean()
});

export const FinishingLevelForm = ({ item, onSubmit, onCancel }) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            nameEn: item?.nameEn || '',
            nameAr: item?.nameAr || '',
            isActive: item?.isActive ?? true // Default to true if not provided
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await onSubmit(values);
                resetForm();
            } catch (error) {
                console.error('Form submission error:', error);
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
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* English Name Field */}
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
                />
                {formik.touched.nameEn && formik.errors.nameEn && (
                    <div className="mt-1 text-sm text-error-600">{formik.errors.nameEn}</div>
                )}
            </div>

            {/* Arabic Name Field */}
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
                />
                {formik.touched.nameAr && formik.errors.nameAr && (
                    <div className="mt-1 text-sm text-error-600">{formik.errors.nameAr}</div>
                )}
            </div>

            {/* Active Status Switch */}
            <div className="flex items-center justify-between p-4 bg-neutral-50   rounded-lg">
                <div>
                    <label
                        htmlFor="isActive"
                        className="block text-sm font-medium text-neutral-700   mb-1"
                    >
                        {t('dashboard.forms.status')}
                    </label>
                    <p className="text-sm text-neutral-500">
                        {formik.values.isActive
                            ? t('dashboard.forms.activeStatusDescription')
                            : t('dashboard.forms.inactiveStatusDescription')}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${formik.values.isActive ? 'text-success-600' : 'text-neutral-500'}`}>
                        {formik.values.isActive
                            ? t('dashboard.forms.active')
                            : t('dashboard.forms.inactive')}
                    </span>
                    <Switch
                        checked={formik.values.isActive}
                        onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
                        disabled={formik.isSubmitting}
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    disabled={formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    {formik.isSubmitting
                        ? t('dashboard.forms.saving')
                        : (item ? t('dashboard.forms.update') : t('dashboard.forms.create'))}
                </Button>
            </div>
        </form>
    );
};