// dashboard/components/ServiceSectionForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';

export default function ServiceSectionForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Validation Schema - Updated to match API fields
    const validationSchema = Yup.object().shape({
        titleEn: Yup.string()
            .required(t('validation.required'))
            .max(200, t('validation.maxLength', { max: 200 })),
        titleAr: Yup.string()
            .required(t('validation.required'))
            .max(200, t('validation.maxLength', { max: 200 })),
        subTitleEn: Yup.string()
            .max(200, t('validation.maxLength', { max: 200 })),
        subTitleAr: Yup.string()
            .max(200, t('validation.maxLength', { max: 200 })),
        displayOrder: Yup.number()
            .integer(t('validation.integer'))
            .min(0, t('validation.min', { min: 0 }))
            .typeError(t('validation.number')),
        isActive: Yup.boolean()
            .default(true),
    });

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            titleEn: item?.titleEn || '',
            titleAr: item?.titleAr || '',
            subTitleEn: item?.subTitleEn || '',
            subTitleAr: item?.subTitleAr || '',
            displayOrder: item?.displayOrder || 0,
            isActive: item?.isActive ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                // Create form data object with correct field names
                const submitData = {
                    titleEn: values.titleEn,
                    titleAr: values.titleAr,
                    subTitleEn: values.subTitleEn || '',
                    subTitleAr: values.subTitleAr || '',
                    displayOrder: values.displayOrder,
                    isActive: values.isActive
                };

                await onSubmit(submitData);
            } catch (error) {
                console.error('Form submission error:', error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Display Order */}
            <Input
                label={t('dashboard.forms.displayOrder')}
                name="displayOrder"
                type="number"
                value={formik.values.displayOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.displayOrder && formik.errors.displayOrder}
                helperText={t('dashboard.forms.displayOrderHelper')}
                min={0}
            />

            {/* English Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.englishContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleEn')}
                    name="titleEn"
                    value={formik.values.titleEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.titleEn && formik.errors.titleEn}
                    placeholder={t('dashboard.forms.titleEnPlaceholder')}
                    required
                />
                <Input
                    label={t('dashboard.forms.subTitleEn')}
                    name="subTitleEn"
                    value={formik.values.subTitleEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subTitleEn && formik.errors.subTitleEn}
                    placeholder={t('dashboard.forms.subTitleEnPlaceholder')}
                />
            </div>

            {/* Arabic Fields */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.arabicContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleAr')}
                    name="titleAr"
                    value={formik.values.titleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.titleAr && formik.errors.titleAr}
                    placeholder={t('dashboard.forms.titleArPlaceholder')}
                    dir="rtl"
                    required
                />
                <Input
                    label={t('dashboard.forms.subTitleAr')}
                    name="subTitleAr"
                    value={formik.values.subTitleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.subTitleAr && formik.errors.subTitleAr}
                    placeholder={t('dashboard.forms.subTitleArPlaceholder')}
                    dir="rtl"
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
                <Switch
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
                />
                <label className="text-sm font-medium text-third-900">
                    {t('dashboard.forms.active')}
                </label>
            </div>

            {/* Form Actions */}
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
                    disabled={formik.isSubmitting || !formik.isValid}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}