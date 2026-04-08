// app/(dashboard)/dashboard/users/profile/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchUserProfile, updateUser } from '@/store/slices/userManagementSlice';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit } from 'react-icons/fi';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import UserProfileForm from '@/dashboard/components/UserProfileForm';

export default function UserProfilePage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { currentUser, loading, operationLoading, error } = useAppSelector((state) => state.userManagement);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleUpdate = async (formData) => {
        if (!currentUser?.id) return;
        try {
            await dispatch(updateUser({ userId: currentUser.id, userData: formData })).unwrap();
            setIsEditing(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (loading && !currentUser) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-third-900   font-serif">
                    {t('dashboard.users.profile.title')}
                </h1>
                {!isEditing && (
                    <Button variant="primary" leftIcon={<FiEdit />} onClick={() => setIsEditing(true)}>
                        {t('dashboard.users.profile.edit')}
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="error" dismissible>
                    {error}
                </Alert>
            )}

            {isEditing ? (
                <Card padding="lg">
                    <UserProfileForm
                        user={currentUser}
                        onSubmit={handleUpdate}
                        onCancel={handleCancel}
                        loading={operationLoading}
                    />
                </Card>
            ) : (
                <Card padding="lg">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="shrink-0">
                            <div className="w-24 h-24 rounded-full bg-primary-100   flex items-center justify-center">
                                <FiUser className="text-4xl text-primary-600" />
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-third-900">
                                    {currentUser?.firstName} {currentUser?.lastName}
                                </h2>
                                <p className="text-sm text-third-500">{currentUser?.email}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <FiShield className="text-primary-600" />
                                    <span className="font-medium text-third-900">
                                        {currentUser?.userRole === 'SuperAdmin'
                                            ? t('dashboard.users.roles.superAdmin')
                                            : t('dashboard.users.roles.admin')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FiMail className="text-primary-600" />
                                    <span className={currentUser?.emailConfirmed ? 'text-success-600' : 'text-warning-600'}>
                                        {currentUser?.emailConfirmed ? t('common.verified') : t('common.unverified')}
                                    </span>
                                </div>
                                {currentUser?.createdAt && (
                                    <div className="flex items-center gap-3">
                                        <FiCalendar className="text-primary-600" />
                                        <span className="text-sm text-third-500">
                                            {new Date(currentUser.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}