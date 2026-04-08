import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchFinishingLevels,
    createFinishingLevel,
    updateFinishingLevel,
    deleteFinishingLevel,
    setPagination
} from '@/store/slices/finishingLevelSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import { FinishingLevelForm } from '@/dashboard/components/FinishingLevelForm';
import { useTranslation } from 'react-i18next';


export default function FinishingLevelsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { finishingLevels, loading, pagination } = useAppSelector((state) => state.finishingLevel);

    useEffect(() => {
        dispatch(fetchFinishingLevels({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createFinishingLevel(formData)).unwrap();
        dispatch(fetchFinishingLevels({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateFinishingLevel({ id, data: formData })).unwrap();
        dispatch(fetchFinishingLevels({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteFinishingLevel(id)).unwrap();
        dispatch(fetchFinishingLevels({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchFinishingLevels({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchFinishingLevels({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.finishingLevels.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`
        },
        {
            header: t('dashboard.finishingLevels.columns.nameEn'),
            field: 'nameEn'
        },
        {
            header: t('dashboard.finishingLevels.columns.nameAr'),
            field: 'nameAr'
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <FinishingLevelForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.finishingLevels.title')}
            description={t('dashboard.finishingLevels.description')}
            data={finishingLevels}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.finishingLevels.searchPlaceholder')}
        />
    );
}