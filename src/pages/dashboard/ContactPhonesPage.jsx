// app/(dashboard)/dashboard/contact-phones/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchContactPhones,
    createContactPhone,
    updateContactPhone,
    deleteContactPhone
} from '@/store/slices/contactPhoneSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ContactPhoneForm from '@/dashboard/components/ContactPhoneForm';
import { FiPhone, FiCopy, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

export default function ContactPhonesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { contactPhones, loading } = useAppSelector((state) => state.contactPhone);

    useEffect(() => {
        dispatch(fetchContactPhones());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createContactPhone(formData)).unwrap();
        dispatch(fetchContactPhones());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateContactPhone({ id, data: formData })).unwrap();
        dispatch(fetchContactPhones());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteContactPhone(id)).unwrap();
        dispatch(fetchContactPhones());
    };

    const handleCopyPhone = (phoneNumber) => {
        navigator.clipboard.writeText(phoneNumber);
        // You can add a toast notification here
    };

    const formatPhoneNumber = (phone) => {
        // Basic formatting for display
        if (!phone) return '';
        // Remove all non-digit characters except +
        const cleaned = phone.replace(/[^\d+]/g, '');
        return cleaned;
    };

    const columns = [
        {
            header: t('dashboard.contactPhones.columns.id'),
            field: 'id',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100   flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-600">
                            #{item.id}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.contactPhones.columns.phoneNumber'),
            field: 'phoneNumber',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-100   flex items-center justify-center shrink-0">
                        <FiPhone className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <a
                            href={`tel:${item.phoneNumber}`}
                            className="text-primary-600  hover:underline font-medium block"
                            title={item.phoneNumber}
                        >
                            {formatPhoneNumber(item.phoneNumber)}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => handleCopyPhone(item.phoneNumber)}
                                className="text-xs text-third-500   hover:text-primary-600   flex items-center gap-1 transition-colors"
                                title={t('dashboard.contactPhones.copyPhone', 'Copy phone number')}
                            >
                                <FiCopy className="w-3 h-3" />
                                <span>{t('dashboard.contactPhones.copy', 'Copy')}</span>
                            </button>
                            <a
                                href={`tel:${item.phoneNumber}`}
                                className="text-xs text-third-500   hover:text-primary-600   flex items-center gap-1 transition-colors"
                                title={t('dashboard.contactPhones.callPhone', 'Call phone')}
                            >
                                <FiExternalLink className="w-3 h-3" />
                                <span>{t('dashboard.contactPhones.call', 'Call')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.contactPhones.columns.type'),
            field: 'type',
            render: (item) => {
                const isMobile = item.phoneNumber?.startsWith('+') || item.phoneNumber?.length >= 10;
                return (
                    <div className="text-sm">
                        <span className={`px-2 py-1 rounded-md ${isMobile
                            ? 'bg-success-50   text-success-600  '
                            : 'bg-neutral-50  text-third-500  '
                            }`}>
                            {isMobile ? t('dashboard.contactPhones.mobile', 'Mobile') : t('dashboard.contactPhones.landline', 'Landline')}
                        </span>
                    </div>
                );
            }
        },
        {
            header: t('dashboard.contactPhones.columns.actions'),
            field: 'actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <a
                        href={`tel:${item.phoneNumber}`}
                        className="px-3 py-1.5 bg-primary-50   text-primary-600  rounded-lg text-sm font-medium hover:bg-primary-100   transition-colors flex items-center gap-1"
                    >
                        <FiPhone className="w-3 h-3" />
                        {t('dashboard.contactPhones.dial', 'Dial')}
                    </a>
                    <a
                        href={`sms:${item.phoneNumber}`}
                        className="px-3 py-1.5 bg-accent-50   text-accent-600   rounded-lg text-sm font-medium hover:bg-accent-100   transition-colors flex items-center gap-1"
                    >
                        <FiMessageSquare className="w-3 h-3" />
                        {t('dashboard.contactPhones.sms', 'SMS')}
                    </a>
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <ContactPhoneForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.contactPhones.title')}
            description={t('dashboard.contactPhones.description')}
            data={contactPhones}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.contactPhones.searchPlaceholder')}
        />
    );
}