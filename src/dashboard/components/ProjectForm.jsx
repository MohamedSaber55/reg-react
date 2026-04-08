// dashboard/components/ProjectForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export default function ProjectForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string()
            .required(t('validation.required'))
            .min(3, t('validation.minLength', { min: 3 }))
            .max(100, t('validation.maxLength', { max: 100 }))
            .matches(
                /^[a-zA-Z0-9\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\-_]+$/,
                t('validation.validName')
            ),
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            name: item?.name || '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Prepare data for submission
                const submitData = {
                    ...values,
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
                    label={t('dashboard.projects.form.name')}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('name')}
                    required
                    placeholder={t('dashboard.projects.form.namePlaceholder')}
                    disabled={formik.isSubmitting}
                    autoFocus
                />
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