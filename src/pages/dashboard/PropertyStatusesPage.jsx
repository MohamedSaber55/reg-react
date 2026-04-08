import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchPropertyStatuses,
    createPropertyStatus,
    updatePropertyStatus,
    deletePropertyStatus,
    setPagination
} from '@/store/slices/propertyStatusSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import PropertyStatusForm from '@/dashboard/components/PropertyStatusForm';

export default function PropertyStatusesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { propertyStatuses, loading, pagination } = useAppSelector((state) => state.propertyStatus);

    useEffect(() => {
        dispatch(fetchPropertyStatuses({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createPropertyStatus(formData)).unwrap();
        dispatch(fetchPropertyStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updatePropertyStatus({ id, data: formData })).unwrap();
        dispatch(fetchPropertyStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deletePropertyStatus(id)).unwrap();
        dispatch(fetchPropertyStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchPropertyStatuses({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchPropertyStatuses({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.propertyStatuses.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`
        },
        {
            header: t('dashboard.propertyStatuses.columns.nameEn'),
            field: 'nameEn'
        },
        {
            header: t('dashboard.propertyStatuses.columns.nameAr'),
            field: 'nameAr'
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <PropertyStatusForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.propertyStatuses.title')}
            description={t('dashboard.propertyStatuses.description')}
            data={propertyStatuses}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.propertyStatuses.searchPlaceholder')}
        />
    );
}