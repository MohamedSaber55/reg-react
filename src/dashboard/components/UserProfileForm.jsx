// dashboard/components/UserProfileForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';

const UserProfileForm = ({ user, onSubmit, onCancel, loading }) => {
    const { t } = useTranslation();

    // Validation schema
    const validationSchema = Yup.object({
        firstName: Yup.string().required(t('validation.required')).min(2, t('validation.minLength', { min: 2 })),
        lastName: Yup.string().required(t('validation.required')).min(2, t('validation.minLength', { min: 2 })),
        email: Yup.string().email(t('validation.invalidEmail')).required(t('validation.required')),
    });

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                ...values
            };
            onSubmit(payload);
        },
        enableReinitialize: true,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
                label={t('dashboard.users.form.firstName')}
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && formik.errors.firstName}
                required
            />
            <Input
                label={t('dashboard.users.form.lastName')}
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && formik.errors.lastName}
                required
            />
            <Input
                label={t('dashboard.users.form.email')}
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                required
            />

            <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" leftIcon={<FiX />} onClick={onCancel} disabled={loading}>
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button variant="primary" leftIcon={<FiSave />} type="submit" loading={loading} disabled={!formik.isValid}>
                    {t('dashboard.forms.update')}
                </Button>
            </div>
        </form>
    );
};

export default UserProfileForm;