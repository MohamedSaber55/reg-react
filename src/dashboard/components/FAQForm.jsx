// dashboard/components/FAQForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Validation schema
const validationSchema = Yup.object({
    questionEn: Yup.string()
        .required('English question is required')
        .min(5, 'Question must be at least 5 characters')
        .max(200, 'Question must be less than 200 characters'),
    questionAr: Yup.string()
        .required('Arabic question is required')
        .min(5, 'Question must be at least 5 characters')
        .max(200, 'Question must be less than 200 characters'),
    answerEn: Yup.string()
        .required('English answer is required')
        .min(10, 'Answer must be at least 10 characters')
        .max(1000, 'Answer must be less than 1000 characters'),
    answerAr: Yup.string()
        .required('Arabic answer is required')
        .min(10, 'Answer must be at least 10 characters')
        .max(1000, 'Answer must be less than 1000 characters'),
});

const FAQForm = ({ item, onSubmit, onCancel, isSubmitting = false }) => {
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            questionEn: item?.questionEn || '',
            questionAr: item?.questionAr || '',
            answerEn: item?.answerEn || '',
            answerAr: item?.answerAr || '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await onSubmit(values);
                if (!item) {
                    resetForm();
                }
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    const handleCancel = () => {
        formik.resetForm();
        onCancel();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
            <div>
                <h3 className="text-lg font-semibold text-third-900   mb-4">
                    {item ? t('dashboard.faqForm.edit') : t('dashboard.faqForm.create')}
                </h3>
                <p className="text-sm text-third-500   mb-6">
                    {t('dashboard.faqForm.description')}
                </p>
            </div>

            {/* English Fields */}
            <div className="space-y-4">
                <Input
                    label={`${t('dashboard.faqForm.questionEn')} *`}
                    id="questionEn"
                    name="questionEn"
                    value={formik.values.questionEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.faqForm.questionEnPlaceholder')}
                    error={formik.touched.questionEn && formik.errors.questionEn}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.questionEn && formik.errors.questionEn && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.questionEn}
                    </div>
                )}

                <Textarea
                    label={`${t('dashboard.faqForm.answerEn')} *`}
                    id="answerEn"
                    name="answerEn"
                    rows={4}
                    value={formik.values.answerEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.faqForm.answerEnPlaceholder')}
                    error={formik.touched.answerEn && formik.errors.answerEn}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                />
                {formik.touched.answerEn && formik.errors.answerEn && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.answerEn}
                    </div>
                )}
            </div>

            {/* Arabic Fields */}
            <div className="space-y-4">
                <Input
                    label={`${t('dashboard.faqForm.questionAr')} *`}
                    id="questionAr"
                    name="questionAr"
                    value={formik.values.questionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.faqForm.questionArPlaceholder')}
                    error={formik.touched.questionAr && formik.errors.questionAr}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    dir="rtl"
                />
                {formik.touched.questionAr && formik.errors.questionAr && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.questionAr}
                    </div>
                )}

                <Textarea
                    label={`${t('dashboard.faqForm.answerAr')} *`}
                    id="answerAr"
                    name="answerAr"
                    rows={4}
                    value={formik.values.answerAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={t('dashboard.faqForm.answerArPlaceholder')}
                    error={formik.touched.answerAr && formik.errors.answerAr}
                    disabled={formik.isSubmitting || isSubmitting}
                    required
                    dir="rtl"
                />
                {formik.touched.answerAr && formik.errors.answerAr && (
                    <div className="mt-1 text-sm text-error-500">
                        {formik.errors.answerAr}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={handleCancel}
                    disabled={formik.isSubmitting || isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiSave />}
                    disabled={formik.isSubmitting || !formik.isValid || isSubmitting}
                    loading={formik.isSubmitting || isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
};

export default FAQForm;