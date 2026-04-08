// app/(dashboard)/dashboard/contact-page/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchContactPage,
    createContactPage,
    updateContactPage,
    deleteContactPage
} from '@/store/slices/contactPageSlice';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';
import ContactPageForm from '@/dashboard/components/ContactPageForm';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ContactPageManagementPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { contactPage, loading, operationLoading, error } = useAppSelector((state) => state.contactPage);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        dispatch(fetchContactPage());
    }, [dispatch]);

    const handleSubmit = async (formData) => {
        try {
            if (contactPage?.id) {
                await dispatch(updateContactPage({ id: contactPage.id, data: formData })).unwrap();
                setSuccessMessage(t('dashboard.contactPage.updateSuccess'));
            } else {
                await dispatch(createContactPage(formData)).unwrap();
                setSuccessMessage(t('dashboard.contactPage.createSuccess'));
            }
            setIsEditing(false);
            dispatch(fetchContactPage());
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to save contact page:', err);
        }
    };

    const handleDelete = async () => {
        if (contactPage?.id && window.confirm(t('dashboard.contactPage.deleteConfirm'))) {
            try {
                await dispatch(deleteContactPage(contactPage.id)).unwrap();
                setSuccessMessage(t('dashboard.contactPage.deleteSuccess'));
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                console.error('Failed to delete contact page:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-third-900   font-serif mb-2">
                        {t('dashboard.contactPage.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.contactPage.subtitle')}
                    </p>
                </div>
                {!isEditing && contactPage && (
                    <div className="flex gap-3">
                        <Button
                            variant="danger"
                            leftIcon={<FiTrash2 />}
                            onClick={handleDelete}
                        >
                            {t('dashboard.common.delete')}
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<FiEdit />}
                            onClick={() => setIsEditing(true)}
                        >
                            {t('dashboard.common.edit')}
                        </Button>
                    </div>
                )}
            </div>

            {successMessage && (
                <Alert variant="success" dismissible onDismiss={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert variant="error" dismissible>
                    {error}
                </Alert>
            )}

            {/* Content */}
            {isEditing || !contactPage ? (
                <Card padding="lg">
                    <ContactPageForm
                        item={contactPage}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                        loading={operationLoading}
                    />
                </Card>
            ) : (
                <Card padding="lg">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-2">
                                    {t('dashboard.forms.titleEn')}
                                </h3>
                                <p className="text-third-900">{contactPage.titleEn}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-2">
                                    {t('dashboard.forms.titleAr')}
                                </h3>
                                <p className="text-third-900" dir="rtl">{contactPage.titleAr}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-2">
                                    {t('dashboard.forms.subtitleEn')}
                                </h3>
                                <p className="text-third-900   whitespace-pre-wrap">{contactPage.subtitleEn}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-third-500   mb-2">
                                    {t('dashboard.forms.subtitleAr')}
                                </h3>
                                <p className="text-third-900   whitespace-pre-wrap" dir="rtl">{contactPage.subtitleAr}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}