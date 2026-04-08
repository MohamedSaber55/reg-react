// dashboard/components/ContactEmailForm.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMail, FiAlertCircle } from 'react-icons/fi';

export default function ContactEmailForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();

    // Validation Schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .required(t('dashboard.validation.emailRequired', 'Email is required'))
            .email(t('dashboard.validation.emailInvalid', 'Please enter a valid email address'))
            .max(255, t('dashboard.validation.emailMax', 'Email must not exceed 255 characters'))
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                t('dashboard.validation.emailFormat', 'Please enter a valid email format')
            ),
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            email: item?.email || '',
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Email domain suggestions
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    const getEmailSuggestions = () => {
        const value = formik.values.email;
        if (!value || !value.includes('@')) return [];

        const [localPart, domainPart] = value.split('@');
        if (!domainPart) return [];

        return commonDomains
            .filter(domain => domain.startsWith(domainPart.toLowerCase()))
            .map(domain => `${localPart}@${domain}`);
    };

    const suggestions = getEmailSuggestions();

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FiMail className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-primary-900 mb-1">
                            {t('dashboard.contactEmails.formInfo.title', 'Contact Email')}
                        </h4>
                        <p className="text-sm text-primary-700">
                            {t('dashboard.contactEmails.formInfo.description',
                                'Add an email address where customers can reach you. This will be displayed on your contact page.'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Email Input */}
            <div>
                <Input
                    label={t('dashboard.forms.email', 'Email Address')}
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email}
                    required
                    placeholder="contact@example.com"
                    autoComplete="email"
                />

                {/* Email Suggestions */}
                {suggestions.length > 0 && formik.values.email && !formik.errors.email && (
                    <div className="mt-2">
                        <p className="text-xs text-third-500 mb-2">
                            {t('dashboard.contactEmails.suggestions', 'Suggestions:')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => formik.setFieldValue('email', suggestion)}
                                    className="text-xs px-3 py-1.5 bg-neutral-50 border border-neutral-400 rounded-lg text-third-900 hover:border-primary-500 hover:bg-primary-50 transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Email Preview */}
                {formik.values.email && !formik.errors.email && (
                    <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-success-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-success-700 mb-1">
                                    {t('dashboard.contactEmails.preview', 'Email Preview:')}
                                </p>
                                <a
                                    href={`mailto:${formik.values.email}`}
                                    className="text-sm font-medium text-success-600 hover:underline block truncate"
                                >
                                    {formik.values.email}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Validation Tips */}
            {formik.touched.email && !formik.errors.email && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-success-700">
                            {t('dashboard.contactEmails.validEmail', 'Valid email address')}
                        </p>
                    </div>
                </div>
            )}

            {/* Display form-level errors if any */}
            {formik.submitCount > 0 && !formik.isValid && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-error-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm text-error-700 font-medium">
                                {t('dashboard.validation.formErrors', 'Please fix the errors above before submitting')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
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