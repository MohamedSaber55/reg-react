// dashboard/components/AboutValueForm.jsx
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { fetchAboutSections } from '@/store/slices/aboutSectionSlice';
import { Input, Textarea, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import IconPicker from '@/components/common/IconPicker'; // Import the IconPicker

export default function AboutValueForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { aboutSections } = useAppSelector((state) => state.aboutSection);
    const [loading, setLoading] = useState(false);

    // Fetch about sections on mount
    useEffect(() => {
        if (aboutSections.length === 0) {
            dispatch(fetchAboutSections({ pageSize: 100 }));
        }
    }, [dispatch, aboutSections.length]);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        titleEn: Yup.string()
            .required(t('validation.required'))
            .max(100, t('validation.maxLength', { max: 100 })),
        titleAr: Yup.string()
            .required(t('validation.required'))
            .max(100, t('validation.maxLength', { max: 100 })),
        descriptionEn: Yup.string()
            .max(500, t('validation.maxLength', { max: 500 })),
        descriptionAr: Yup.string()
            .max(500, t('validation.maxLength', { max: 500 })),
        icon: Yup.string()
            .max(100, t('validation.maxLength', { max: 100 })),
        aboutSectionId: Yup.number()
            .required(t('validation.required'))
            .typeError(t('validation.required')),
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
            descriptionEn: item?.descriptionEn || '',
            descriptionAr: item?.descriptionAr || '',
            icon: item?.icon || '',
            aboutSectionId: item?.aboutSectionId || '',
            displayOrder: item?.displayOrder || 0,
            isActive: item?.isActive ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Section Selection */}
            <Select
                label={t('dashboard.forms.section')}
                name="aboutSectionId"
                value={formik.values.aboutSectionId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.aboutSectionId && formik.errors.aboutSectionId}
                required
                options={[
                    { value: '', label: t('dashboard.forms.selectSection') },
                    ...aboutSections.map(section => ({
                        value: section.id.toString(),
                        label: section.titleEn
                    }))
                ]}
            />

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
            />

            {/* Icon */}
            <IconPicker
                label={t('dashboard.forms.icon')}
                value={formik.values.icon}
                onChange={(value) => formik.setFieldValue('icon', value)}
                error={formik.touched.icon && formik.errors.icon}
                helperText={t('dashboard.forms.iconHelper')}
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
                    required
                />
                <Textarea
                    label={t('dashboard.forms.descriptionEn')}
                    name="descriptionEn"
                    value={formik.values.descriptionEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.descriptionEn && formik.errors.descriptionEn}
                    rows={4}
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
                    dir="rtl"
                    required
                />
                <Textarea
                    label={t('dashboard.forms.descriptionAr')}
                    name="descriptionAr"
                    value={formik.values.descriptionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.descriptionAr && formik.errors.descriptionAr}
                    dir="rtl"
                    rows={4}
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
                    disabled={loading || formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading || formik.isSubmitting}
                    disabled={loading || formik.isSubmitting || !formik.isValid}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}