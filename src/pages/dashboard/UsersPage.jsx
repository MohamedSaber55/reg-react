// app/(dashboard)/dashboard/users/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchAllUsers,
    deleteUser,
    createUser,
    updateUser
} from '@/store/slices/userManagementSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import UserForm from '@/dashboard/components/UserForm';
import { Badge } from '@/components/common/Badge';
import { FiUser, FiMail, FiCheck, FiX } from 'react-icons/fi';

export default function UsersPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector((state) => state.userManagement);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createUser(formData)).unwrap();
        dispatch(fetchAllUsers());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateUser({ userId: id, userData: formData })).unwrap();
        dispatch(fetchAllUsers());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteUser(id)).unwrap();
        dispatch(fetchAllUsers());
    };

    const columns = [
        {
            header: t('dashboard.users.columns.name'),
            field: 'firstName',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100   flex items-center justify-center">
                        <FiUser className="text-primary-600" />
                    </div>
                    <span className="font-semibold text-third-900">
                        {item.firstName} {item.lastName}
                    </span>
                </div>
            )
        },
        {
            header: t('dashboard.users.columns.email'),
            field: 'email',
            render: (item) => (
                <a href={`mailto:${item.email}`} className="text-primary-600  hover:underline">
                    {item.email}
                </a>
            )
        },
        {
            header: t('dashboard.users.columns.role'),
            field: 'userRole',
            render: (item) => (
                <Badge variant={item.userRole === "SuperAdmin" ? 'success' : 'secondary'} rounded>
                    {item.userRole === "SuperAdmin" ? t('dashboard.users.roles.superAdmin') : t('dashboard.users.roles.admin')}
                </Badge>
            )
        },
        {
            header: t('dashboard.users.columns.status'),
            field: 'emailConfirmed',
            render: (item) => (
                <Badge variant={item.emailConfirmed ? 'success' : 'warning'} rounded icon={item.emailConfirmed ? <FiCheck /> : <FiX />}>
                    {item.emailConfirmed ? t('common.verified') : t('common.unverified')}
                </Badge>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => (
        <UserForm item={item} onSubmit={onSubmit} onCancel={onCancel} />
    );

    return (
        <CRUDTable
            title={t('dashboard.users.title')}
            description={t('dashboard.users.description')}
            data={users}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.users.searchPlaceholder')}
        />
    );
}