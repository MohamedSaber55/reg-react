// dashboard/components/SliderForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea, Checkbox } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Slider name is required')
        .min(2)
        .max(100),
    description: Yup.string().max(200),
    isActive: Yup.boolean(),
});

export const SliderForm = ({ item, onSubmit, onCancel }) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            name: item?.name || '',
            description: item?.description || '',
            isActive: item?.isActive ?? true,
        },
        validationSchema,
        onSubmit: async (values) => {
            // Only send slider data — no images
            await onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t('dashboard.sliderForm.name')}
                    required
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                    placeholder={t('dashboard.sliderForm.namePlaceholder')}
                />
                <div className="flex items-center mt-8">
                    <Checkbox
                        id="isActive"
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                    />
                    <label htmlFor="isActive" className="ms-2 text-sm font-medium text-third-900">
                        {t('dashboard.sliderForm.isActive')}
                    </label>
                </div>
            </div>

            <Textarea
                label={t('dashboard.sliderForm.description')}
                id="description"
                name="description"
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description}
                placeholder={t('dashboard.sliderForm.descriptionPlaceholder')}
            />

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
                    disabled={!formik.isValid}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')} {t('dashboard.sliderForm.slider')}
                </Button>
            </div>
        </form>
    );
};