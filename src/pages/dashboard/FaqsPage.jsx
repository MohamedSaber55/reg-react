// app/(dashboard)/dashboard/faqs/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
} from '@/store/slices/faqSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import FAQForm from '@/dashboard/components/FAQForm';
import { FiHelpCircle, FiCheck } from 'react-icons/fi';

export default function FAQsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { faqs, loading } = useAppSelector((state) => state.faq);

    useEffect(() => {
        dispatch(fetchFAQs());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createFAQ(formData)).unwrap();
        dispatch(fetchFAQs());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateFAQ({ id, data: formData })).unwrap();
        dispatch(fetchFAQs());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteFAQ(id)).unwrap();
        dispatch(fetchFAQs());
    };

    const columns = [
        {
            header: t('dashboard.faqs.columns.questionEn'),
            field: 'questionEn',
            render: (item) => (
                <div className="font-medium text-third-900">
                    {item.questionEn || t('common.notAvailable')}
                </div>
            )
        },
        {
            header: t('dashboard.faqs.columns.questionAr'),
            field: 'questionAr',
            render: (item) => (
                <div dir="rtl" className="font-medium text-third-900">
                    {item.questionAr || t('common.notAvailable')}
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => (
        <FAQForm item={item} onSubmit={onSubmit} onCancel={onCancel} />
    );

    return (
        <CRUDTable
            title={t('dashboard.faqs.title')}
            description={t('dashboard.faqs.description')}
            data={faqs}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.faqs.searchPlaceholder')}
        />
    );
}