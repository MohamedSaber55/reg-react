// dashboard/components/UserForm.jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, PasswordInput, Select } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FiSave, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').min(2),
    lastName: Yup.string().required('Last name is required').min(2),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .when('$isEdit', {
            is: false,
            then: (schema) => schema.required('Password is required').min(6),
            otherwise: (schema) => schema.optional().min(6)
        }),
    // userRole: Yup.string().oneOf(["SuperAdmin", "Admin"], 'Invalid role').required('Role is required')
});

export default function UserForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const isEdit = !!item;

    const formik = useFormik({
        initialValues: {
            firstName: item?.firstName || '',
            lastName: item?.lastName || '',
            email: item?.email || '',
            password: '',
            userRole: item?.userRole ?? "Admin"
        },
        validationSchema: validationSchema,
        context: { isEdit },
        onSubmit: (values) => {
            if (isEdit && !values.password) {
                delete values.password;
            }
            onSubmit(values);
        },
        enableReinitialize: true
    });    

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* First Name and Last Name in one row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        label={t('dashboard.users.form.firstName')}
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && formik.errors.firstName}
                        required
                    />
                </div>
                <div>
                    <Input
                        label={t('dashboard.users.form.lastName')}
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && formik.errors.lastName}
                        required
                    />
                </div>
            </div>

            <Input
                label={t('dashboard.users.form.email')}
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                required
            />

            {!isEdit && (
                <PasswordInput
                    label={t('dashboard.users.form.password')}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && formik.errors.password}
                    required={!isEdit}
                />
            )}

            {/* <Select
                label={t('dashboard.users.form.role')}
                name="userRole"
                value={formik.values.userRole}
                onChange={formik.handleChange}
                error={formik.touched.userRole && formik.errors.userRole}
                options={[
                    { value: "Admin", label: t('dashboard.users.roles.admin') },
                    { value: "SuperAdmin", label: t('dashboard.users.roles.superAdmin') },
                ]}
                required
            /> */}

            <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" leftIcon={<FiX />} onClick={onCancel}>
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button variant="primary" leftIcon={<FiSave />} type="submit">
                    {isEdit ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}