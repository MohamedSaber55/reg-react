// dashboard/components/ServiceItemForm.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { fetchServiceSections } from '@/store/slices/serviceSectionSlice';
import { Input, Textarea, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import IconPicker from '@/components/common/IconPicker';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ServiceItemForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { serviceSections } = useAppSelector((state) => state.serviceSection);

    useEffect(() => {
        if (serviceSections.length === 0) {
            dispatch(fetchServiceSections({ pageSize: 100 }));
        }
    }, [dispatch, serviceSections.length]);

    // Validation Schema
    const validationSchema = Yup.object({
        serviceSectionId: Yup.number()
            .required(t('dashboard.validation.sectionRequired', 'Please select a section'))
            .min(1, t('dashboard.validation.sectionRequired', 'Please select a section')),
        titleEn: Yup.string()
            .required(t('dashboard.validation.titleEnRequired', 'English title is required'))
            .min(2, t('dashboard.validation.titleEnMin', 'Title must be at least 2 characters'))
            .max(200, t('dashboard.validation.titleEnMax', 'Title must not exceed 200 characters')),
        titleAr: Yup.string()
            .required(t('dashboard.validation.titleArRequired', 'Arabic title is required'))
            .min(2, t('dashboard.validation.titleArMin', 'Title must be at least 2 characters'))
            .max(200, t('dashboard.validation.titleArMax', 'Title must not exceed 200 characters')),
        descriptionEn: Yup.string()
            .max(1000, t('dashboard.validation.descriptionEnMax', 'Description must not exceed 1000 characters')),
        descriptionAr: Yup.string()
            .max(1000, t('dashboard.validation.descriptionArMax', 'Description must not exceed 1000 characters')),
        extraTextEn: Yup.string()
            .max(500, t('dashboard.validation.extraTextEnMax', 'Extra text must not exceed 500 characters')),
        extraTextAr: Yup.string()
            .max(500, t('dashboard.validation.extraTextArMax', 'Extra text must not exceed 500 characters')),
        icon: Yup.string()
            .max(100, t('dashboard.validation.iconMax', 'Icon name must not exceed 100 characters')),
        displayOrder: Yup.number()
            .min(0, t('dashboard.validation.displayOrderMin', 'Display order must be 0 or greater'))
            .integer(t('dashboard.validation.displayOrderInteger', 'Display order must be a whole number')),
        isActive: Yup.boolean()
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            titleEn: item?.titleEn || '',
            titleAr: item?.titleAr || '',
            descriptionEn: item?.descriptionEn || '',
            descriptionAr: item?.descriptionAr || '',
            icon: item?.icon || '',
            extraTextEn: item?.extraTextEn || '',
            extraTextAr: item?.extraTextAr || '',
            serviceSectionId: item?.serviceSectionId || '',
            isActive: item?.isActive ?? true,
            displayOrder: item?.displayOrder || 0,
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Prepare the data in the exact format expected by API
                const submitData = {
                    ...values,
                    serviceSectionId: parseInt(values.serviceSectionId) || 0,
                    displayOrder: parseInt(values.displayOrder) || 0
                };
                await onSubmit(submitData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleIconChange = (e) => {
        formik.setFieldValue('icon', e.target.value);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Select
                label={t('dashboard.forms.section')}
                name="serviceSectionId"
                value={formik.values.serviceSectionId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.serviceSectionId && formik.errors.serviceSectionId}
                options={[
                    { value: '', label: t('dashboard.forms.selectSection') },
                    ...serviceSections.map(section => ({
                        value: section.id.toString(),
                        label: section.titleEn
                    }))
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        rows={3}
                    />
                    <Textarea
                        label={t('dashboard.forms.extraTextEn')}
                        name="extraTextEn"
                        value={formik.values.extraTextEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.extraTextEn && formik.errors.extraTextEn}
                        rows={2}
                        placeholder="Additional text in English"
                    />
                </div>

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
                        rows={3}
                    />
                    <Textarea
                        label={t('dashboard.forms.extraTextAr')}
                        name="extraTextAr"
                        value={formik.values.extraTextAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.extraTextAr && formik.errors.extraTextAr}
                        dir="rtl"
                        rows={2}
                        placeholder="نص إضافي بالعربية"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1  gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900">
                        {t('dashboard.forms.additionalSettings')}
                    </h3>

                    {/* Icon */}
                    <IconPicker
                        label={t('dashboard.forms.icon')}
                        value={formik.values.icon}
                        onChange={(value) => formik.setFieldValue('icon', value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.icon && formik.errors.icon}
                        helperText={t('dashboard.forms.iconHelper')}
                    />

                    <Input
                        label={t('dashboard.forms.displayOrder')}
                        name="displayOrder"
                        type="number"
                        value={formik.values.displayOrder}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.displayOrder && formik.errors.displayOrder}
                        min="0"
                        helpText={t('dashboard.forms.displayOrderHelp')}
                    />

                    <div className="flex items-center gap-3 pt-2">
                        <Switch
                            checked={formik.values.isActive}
                            onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
                        />
                        <label className="text-sm font-medium text-third-900">
                            {t('dashboard.forms.active')}
                        </label>
                    </div>
                </div>
            </div>

            {/* Display form-level errors if any */}
            {formik.submitCount > 0 && !formik.isValid && (
                <div className="bg-error-50  border border-error-200   rounded-lg p-4">
                    <p className="text-sm text-error-700   font-medium">
                        {t('dashboard.validation.formErrors', 'Please fix the errors above before submitting')}
                    </p>
                </div>
            )}

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