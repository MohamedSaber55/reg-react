// dashboard/components/ContactPhoneForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiPhone, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function ContactPhoneForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const [selectedCountryCode, setSelectedCountryCode] = useState('+20'); // Default to Egypt

    // Common country codes
    const countryCodes = [
        { code: '+20', country: 'Egypt', flag: '🇪🇬' },
        { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+971', country: 'UAE', flag: '🇦🇪' },
        { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
        { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
        { code: '+44', country: 'UK', flag: '🇬🇧' },
    ];

    // Validation Schema
    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .required(t('dashboard.validation.phoneRequired', 'Phone number is required'))
            .matches(
                /^[\+]?[0-9]{1,4}?[-.\s]?[(]?[0-9]{1,4}[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/,
                t('dashboard.validation.phoneInvalid', 'Please enter a valid phone number')
            )
            .min(8, t('dashboard.validation.phoneMin', 'Phone number must be at least 8 digits'))
            .max(20, t('dashboard.validation.phoneMax', 'Phone number must not exceed 20 characters')),
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            phoneNumber: item?.phoneNumber || '',
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

    const handleQuickAdd = (code) => {
        setSelectedCountryCode(code);
        const currentValue = formik.values.phoneNumber;
        // Remove any existing country code
        const withoutCode = currentValue.replace(/^\+\d+/, '').trim();
        formik.setFieldValue('phoneNumber', `${code}${withoutCode}`);
    };

    const formatPhonePreview = (phone) => {
        if (!phone) return '';
        // Basic formatting for preview
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length <= 3) return phone;
        if (cleaned.length <= 6) return phone.replace(/(\d{3})(\d+)/, '$1-$2');
        if (cleaned.length <= 10) return phone.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        return phone;
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Info Banner */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <FiPhone className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-sm font-semibold text-primary-900 mb-1">
                            {t('dashboard.contactPhones.formInfo.title', 'Contact Phone')}
                        </h4>
                        <p className="text-sm text-primary-700">
                            {t('dashboard.contactPhones.formInfo.description',
                                'Add a phone number where customers can reach you. Include country code for international numbers.'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Country Code Quick Select */}
            <div>
                <label className="block text-sm font-medium text-third-900 mb-2">
                    {t('dashboard.contactPhones.quickSelect', 'Quick Select Country Code')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {countryCodes.map((item) => (
                        <button
                            key={item.code}
                            type="button"
                            onClick={() => handleQuickAdd(item.code)}
                            className={`p-2 text-sm rounded-lg border transition-all ${formik.values.phoneNumber?.startsWith(item.code)
                                ? 'border-primary-500 bg-primary-50 text-primary-600'
                                : 'border-neutral-400 hover:border-primary-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{item.flag}</span>
                                <div className="text-start flex-1 min-w-0">
                                    <div className="font-semibold truncate">{item.code}</div>
                                    <div className="text-xs text-third-500 truncate">
                                        {item.country}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Phone Number Input */}
            <div>
                <Input
                    label={t('dashboard.forms.phoneNumber', 'Phone Number')}
                    name="phoneNumber"
                    type="tel"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    required
                    placeholder="+20 123 456 7890"
                    autoComplete="tel"
                />

                {/* Format Tips */}
                <div className="mt-2 text-xs text-third-500">
                    <p>{t('dashboard.contactPhones.formatTip', 'Format: +[country code] [number]')}</p>
                    <p className="mt-1">
                        {t('dashboard.contactPhones.exampleTip', 'Examples: +20 123 456 7890, +1 555 123 4567')}
                    </p>
                </div>

                {/* Phone Preview */}
                {formik.values.phoneNumber && !formik.errors.phoneNumber && (
                    <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-success-600 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-success-700 mb-1">
                                    {t('dashboard.contactPhones.preview', 'Phone Preview:')}
                                </p>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`tel:${formik.values.phoneNumber}`}
                                        className="text-sm font-medium text-success-600 hover:underline"
                                    >
                                        {formatPhonePreview(formik.values.phoneNumber)}
                                    </a>
                                    <a
                                        href={`sms:${formik.values.phoneNumber}`}
                                        className="text-xs text-success-600 hover:underline"
                                    >
                                        ({t('dashboard.contactPhones.testSms', 'Test SMS')})
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Validation Success */}
            {formik.touched.phoneNumber && !formik.errors.phoneNumber && formik.values.phoneNumber && (
                <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                            <FiCheck className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-success-700 font-medium">
                                {t('dashboard.contactPhones.validPhone', 'Valid phone number')}
                            </p>
                            <p className="text-xs text-success-600 mt-1">
                                {t('dashboard.contactPhones.validPhoneDesc', 'This number can receive calls and SMS messages')}
                            </p>
                        </div>
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