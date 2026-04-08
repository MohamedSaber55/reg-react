// app/(dashboard)/dashboard/contact-emails/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchContactEmails,
    createContactEmail,
    updateContactEmail,
    deleteContactEmail
} from '@/store/slices/contactEmailSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ContactEmailForm from '@/dashboard/components/ContactEmailForm';
import { FiMail, FiCopy, FiExternalLink } from 'react-icons/fi';

export default function ContactEmailsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { contactEmails, loading } = useAppSelector((state) => state.contactEmail);

    useEffect(() => {
        dispatch(fetchContactEmails());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createContactEmail(formData)).unwrap();
        dispatch(fetchContactEmails());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateContactEmail({ id, data: formData })).unwrap();
        dispatch(fetchContactEmails());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteContactEmail(id)).unwrap();
        dispatch(fetchContactEmails());
    };

    const handleCopyEmail = (email) => {
        navigator.clipboard.writeText(email);
        // You can add a toast notification here
    };

    const columns = [
        {
            header: t('dashboard.contactEmails.columns.id'),
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
            header: t('dashboard.contactEmails.columns.email'),
            field: 'email',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-100   flex items-center justify-center shrink-0">
                        <FiMail className="w-5 h-5 text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <a
                            href={`mailto:${item.email}`}
                            className="text-primary-600  hover:underline font-medium block truncate"
                            title={item.email}
                        >
                            {item.email}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                            <button
                                onClick={() => handleCopyEmail(item.email)}
                                className="text-xs text-third-500   hover:text-primary-600   flex items-center gap-1 transition-colors"
                                title={t('dashboard.contactEmails.copyEmail', 'Copy email')}
                            >
                                <FiCopy className="w-3 h-3" />
                                <span>{t('dashboard.contactEmails.copy', 'Copy')}</span>
                            </button>
                            <a
                                href={`mailto:${item.email}`}
                                className="text-xs text-third-500   hover:text-primary-600   flex items-center gap-1 transition-colors"
                                title={t('dashboard.contactEmails.sendEmail', 'Send email')}
                            >
                                <FiExternalLink className="w-3 h-3" />
                                <span>{t('dashboard.contactEmails.send', 'Send')}</span>
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.contactEmails.columns.actions'),
            field: 'actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <a
                        href={`mailto:${item.email}`}
                        className="px-3 py-1.5 bg-primary-50   text-primary-600  rounded-lg text-sm font-medium hover:bg-primary-100   transition-colors"
                    >
                        {t('dashboard.contactEmails.compose', 'Compose')}
                    </a>
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <ContactEmailForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.contactEmails.title')}
            description={t('dashboard.contactEmails.description')}
            data={contactEmails}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.contactEmails.searchPlaceholder')}
        />
    );
}