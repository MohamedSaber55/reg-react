// dashboard/components/ProjectStageForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

export default function ProjectStageForm({ item, onSubmit, onCancel, projects }) {
    const { t } = useTranslation();

    // Validation schema
    const validationSchema = Yup.object({
        projectId: Yup.number()
            .required(t('validation.required'))
            .positive(t('validation.positiveNumber')),
        name: Yup.string()
            .required(t('validation.required'))
            .min(3, t('validation.minLength', { min: 3 }))
            .max(100, t('validation.maxLength', { max: 100 })),
        code: Yup.string()
            .required(t('validation.required'))
            .max(20, t('validation.maxLength', { max: 20 }))
            .matches(/^[A-Z0-9_-]+$/, t('validation.alphaNumeric')),
        description: Yup.string()
            .max(500, t('validation.maxLength', { max: 500 })),
        deliveryDate: Yup.date()
            .required(t('validation.required'))
            .min(new Date(), t('validation.futureDate')),
        displayOrder: Yup.number()
            .required(t('validation.required'))
            .positive(t('validation.positiveNumber'))
            .integer(t('validation.integer')),
        isActive: Yup.boolean()
            .default(true)
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            projectId: item?.projectId || (projects.length > 0 ? projects[0].id : ''),
            name: item?.name || '',
            code: item?.code || '',
            description: item?.description || '',
            deliveryDate: item?.deliveryDate ? new Date(item.deliveryDate) : null,
            displayOrder: item?.displayOrder || 1,
            isActive: item?.isActive ?? true
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Format the data for API
                const submitData = {
                    ...values,
                    deliveryDate: values.deliveryDate ? values.deliveryDate.toISOString() : null
                };

                // Remove project object if it exists (only send projectId)
                delete submitData.project;

                await onSubmit(submitData);
            } catch (error) {
                console.error('Form submission error:', error);
                // You could show error toast here
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    // Helper function to check if field has error
    const getFieldError = (fieldName) => {
        return formik.touched[fieldName] && formik.errors[fieldName];
    };

    // Format date for display
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* Project Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('dashboard.projectStages.form.project')}
                        <span className="text-error-500"> *</span>
                    </label>
                    <select
                        name="projectId"
                        value={formik.values.projectId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('projectId')
                                ? 'border-error-500 focus:ring-error-500'
                                : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                            }`}
                        disabled={formik.isSubmitting}
                    >
                        <option value="">{t('dashboard.projectStages.form.selectProject')}</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {getFieldError('projectId') && (
                        <p className="mt-1 text-sm text-error-500">{formik.errors.projectId}</p>
                    )}
                </div>

                {/* Name and Code in same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t('dashboard.projectStages.form.name')}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('name')}
                        required
                        placeholder={t('dashboard.projectStages.form.namePlaceholder')}
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        label={t('dashboard.projectStages.form.code')}
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('code')}
                        required
                        placeholder="PHASE-1"
                        disabled={formik.isSubmitting}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                        {t('dashboard.projectStages.form.description')}
                    </label>
                    <textarea
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('description')
                                ? 'border-error-500 focus:ring-error-500'
                                : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                            }`}
                        placeholder={t('dashboard.projectStages.form.descriptionPlaceholder')}
                        disabled={formik.isSubmitting}
                    />
                    {getFieldError('description') && (
                        <p className="mt-1 text-sm text-error-500">{formik.errors.description}</p>
                    )}
                </div>

                {/* Delivery Date and Display Order in same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            label={t('dashboard.projectStages.form.deliveryDate')}
                            type="date"
                            name="deliveryDate"
                            value={formik.values.deliveryDate ? formatDateForInput(formik.values.deliveryDate) : ''}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null;
                                formik.setFieldValue('deliveryDate', date);
                            }}
                            onBlur={formik.handleBlur}
                            min={formatDateForInput(new Date())}
                            disabled={formik.isSubmitting}
                        />
                        {getFieldError('deliveryDate') && (
                            <p className="mt-1 text-sm text-error-500">{formik.errors.deliveryDate}</p>
                        )}
                    </div>
``
                    <Input
                        label={t('dashboard.projectStages.form.displayOrder')}
                        name="displayOrder"
                        type="number"
                        value={formik.values.displayOrder}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('displayOrder')}
                        required
                        min="1"
                        disabled={formik.isSubmitting}
                    />
                </div>

                {/* Active Status Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        disabled={formik.isSubmitting}
                    />
                    <label htmlFor="isActive" className="ms-2 text-sm text-neutral-700">
                        {t('dashboard.projectStages.form.isActive')}
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-300">
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