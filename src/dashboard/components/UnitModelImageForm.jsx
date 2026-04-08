// dashboard/components/UnitModelImageForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

export default function UnitModelImageForm({ isOpen, onClose, onSubmit, image, loading }) {
    const { t } = useTranslation();

    // Validation schema
    const validationSchema = Yup.object({
        displayOrder: Yup.number()
            .required(t('validation.required', 'This field is required'))
            .min(1, t('validation.minValue', { min: 1 }) || 'Minimum value is 1')
            .integer(t('validation.integer', 'Must be a whole number')),
        isMain: Yup.boolean()
            .default(false)
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            displayOrder: image?.displayOrder || 1,
            isMain: image?.isMain || false,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Send data as JSON object (not FormData)
                await onSubmit({
                    displayOrder: parseInt(values.displayOrder),
                    isMain: values.isMain
                });
                formik.resetForm();
            } catch (error) {
                console.error('Form submission error:', error);
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

    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('dashboard.unitModelImages.form.editTitle', 'Edit Image')}
            size="md"
        >
            {image && (
                <div className="mb-6">
                    <img
                        src={image.imageUrl}
                        alt="Image to edit"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="mt-3 text-sm text-neutral-600">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">ID: {image.id}</span>
                            <span>
                                {image.isMain ? (
                                    <span className="inline-flex items-center px-2 py-1 bg-warning-100 text-warning-800 rounded-full text-xs font-medium">
                                        {t('dashboard.unitModelImages.main', 'Main Image')}
                                    </span>
                                ) : (
                                    <span className="text-neutral-500">
                                        {t('dashboard.unitModelImages.additional', 'Additional Image')}
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Display Order */}
                <Input
                    label={t('dashboard.unitModelImages.form.displayOrder', 'Display Order')}
                    name="displayOrder"
                    type="number"
                    value={formik.values.displayOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('displayOrder')}
                    required
                    min="1"
                    disabled={loading}
                    helperText={t('dashboard.unitModelImages.form.displayOrderHelper', 'Lower numbers appear first')}
                />

                {/* Set as Main Image */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isMain"
                        name="isMain"
                        checked={formik.values.isMain}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        disabled={loading || image?.isMain} // Disable if already main
                    />
                    <label htmlFor="isMain" className="ms-2 text-sm text-neutral-700">
                        {t('dashboard.unitModelImages.form.setAsMain', 'Set as main image')}
                    </label>
                </div>

                {image?.isMain && (
                    <p className="text-xs text-warning-600">
                        {t('dashboard.unitModelImages.form.alreadyMain', 'This is already the main image. Use the "Set as Main" button on another image to change it.')}
                    </p>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-neutral-300">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {t('dashboard.forms.cancel', 'Cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        disabled={!formik.isValid || loading}
                    >
                        {t('dashboard.forms.update', 'Update')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}