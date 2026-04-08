// dashboard/components/StageForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';

export default function StageForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t('validation.required'))
            .max(100, t('validation.maxLength', { max: 100 })),
        code: Yup.string()
            .required(t('validation.required'))
            .max(50, t('validation.maxLength', { max: 50 }))
            .matches(/^[A-Z0-9_-]+$/, t('validation.alphanumeric')),
        description: Yup.string()
            .max(500, t('validation.maxLength', { max: 500 })),
        deliveryDate: Yup.date()
            .required(t('validation.required'))
            .min(new Date(), t('validation.futureDate')),
        isActive: Yup.boolean(),
        displayOrder: Yup.number()
            .required(t('validation.required'))
            .min(0, t('validation.minValue', { min: 0 }))
            .integer(t('validation.integer'))
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            name: item?.name || '',
            code: item?.code || '',
            description: item?.description || '',
            deliveryDate: item?.deliveryDate
                ? new Date(item.deliveryDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
            isActive: item?.isActive ?? true,
            displayOrder: item?.displayOrder ?? 0,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Prepare data for submission
                const submitData = {
                    ...values,
                    deliveryDate: new Date(values.deliveryDate).toISOString(),
                };
                await onSubmit(submitData);
            } catch (error) {
                console.error('Form submission error:', error);
                // You could set form errors here if needed
                // formik.setErrors({ submit: error.message });
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true, // Update form if item prop changes
    });

    // Helper function to check if field has error
    const getFieldError = (fieldName) => {
        return formik.touched[fieldName] && formik.errors[fieldName];
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label={t('dashboard.forms.name')}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('name')}
                    required
                    placeholder={t('dashboard.forms.namePlaceholder')}
                    disabled={formik.isSubmitting}
                />

                <Input
                    label={t('dashboard.forms.code')}
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('code')}
                    required
                    placeholder={t('dashboard.forms.codePlaceholder')}
                    disabled={formik.isSubmitting}
                />

                <Textarea
                    label={t('dashboard.forms.description')}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('description')}
                    rows={4}
                    placeholder={t('dashboard.forms.descriptionPlaceholder')}
                    disabled={formik.isSubmitting}
                />

                <Input
                    label={t('dashboard.forms.deliveryDate')}
                    name="deliveryDate"
                    type="date"
                    value={formik.values.deliveryDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('deliveryDate')}
                    required
                    disabled={formik.isSubmitting}
                />

                <Input
                    label={t('dashboard.forms.displayOrder')}
                    name="displayOrder"
                    type="number"
                    value={formik.values.displayOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('displayOrder')}
                    required
                    min="0"
                    step="1"
                    disabled={formik.isSubmitting}
                />
            </div>

            <div className="flex items-center gap-3">
                <Switch
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) =>
                        formik.setFieldValue('isActive', checked)
                    }
                    disabled={formik.isSubmitting}
                />
                <label className="text-sm font-medium text-third-900">
                    {t('dashboard.forms.active')}
                </label>
            </div>

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
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}