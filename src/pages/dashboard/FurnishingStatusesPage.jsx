import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchFurnishingStatuses,
    createFurnishingStatus,
    updateFurnishingStatus,
    deleteFurnishingStatus,
    setPagination
} from '@/store/slices/furnishingStatusSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import FurnishingStatusForm from '@/dashboard/components/FurnishingStatusForm';

export default function FurnishingStatusesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { furnishingStatuses, loading, pagination } = useAppSelector((state) => state.furnishingStatus);

    useEffect(() => {
        dispatch(fetchFurnishingStatuses({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createFurnishingStatus(formData)).unwrap();
        dispatch(fetchFurnishingStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateFurnishingStatus({ id, data: formData })).unwrap();
        dispatch(fetchFurnishingStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteFurnishingStatus(id)).unwrap();
        dispatch(fetchFurnishingStatuses({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchFurnishingStatuses({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchFurnishingStatuses({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.furnishingStatuses.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`
        },
        {
            header: t('dashboard.furnishingStatuses.columns.nameEn'),
            field: 'nameEn'
        },
        {
            header: t('dashboard.furnishingStatuses.columns.nameAr'),
            field: 'nameAr'
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <FurnishingStatusForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.furnishingStatuses.title')}
            description={t('dashboard.furnishingStatuses.description')}
            data={furnishingStatuses}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.furnishingStatuses.searchPlaceholder')}
        />
    );
}