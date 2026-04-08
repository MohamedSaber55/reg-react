import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchTransactionTypes,
    createTransactionType,
    updateTransactionType,
    deleteTransactionType,
    setPagination
} from '@/store/slices/transactionTypeSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import TransactionTypeForm from '@/dashboard/components/TransactionTypeForm';

export default function TransactionTypesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { transactionTypes, loading, pagination } = useAppSelector((state) => state.transactionType);

    useEffect(() => {
        dispatch(fetchTransactionTypes({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createTransactionType(formData)).unwrap();
        dispatch(fetchTransactionTypes({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (transactionTypeId, formData) => {
        await dispatch(updateTransactionType({ transactionTypeId, data: formData })).unwrap();
        dispatch(fetchTransactionTypes({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (transactionTypeId) => {
        await dispatch(deleteTransactionType(transactionTypeId)).unwrap();
        dispatch(fetchTransactionTypes({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchTransactionTypes({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchTransactionTypes({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.transactionTypes.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`
        },
        {
            header: t('dashboard.transactionTypes.columns.nameEn'),
            field: 'nameEn'
        },
        {
            header: t('dashboard.transactionTypes.columns.nameAr'),
            field: 'nameAr'
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <TransactionTypeForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.transactionTypes.title')}
            description={t('dashboard.transactionTypes.description')}
            data={transactionTypes}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.transactionTypes.searchPlaceholder')}
        />
    );
}