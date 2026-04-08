import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchMetaPixels,
    createMetaPixel,
    updateMetaPixel,
    deleteMetaPixel,
    setPagination
} from '@/store/slices/metaPixelSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import MetaPixelForm from '@/dashboard/components/MetaPixelForm';

export default function MetaPixelsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { metaPixels, loading, pagination } = useAppSelector((state) => state.tracking);

    useEffect(() => {
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createMetaPixel(formData)).unwrap();
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateMetaPixel({ id, data: formData })).unwrap();
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteMetaPixel(id)).unwrap();
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchMetaPixels({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.metaPixels.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`
        },
        {
            header: t('dashboard.metaPixels.columns.metaPixelId'),
            field: 'metaPixelId'
        },
        {
            header: t('dashboard.metaPixels.columns.googleAnalyticsId'),
            field: 'googleAnalyticsId'
        },
        {
            header: t('dashboard.metaPixels.columns.isActive'),
            field: 'isActive',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.isActive ? t('common.active') : t('common.inactive')}
                </span>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <MetaPixelForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.metaPixels.title')}
            description={t('dashboard.metaPixels.description')}
            data={metaPixels}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.metaPixels.searchPlaceholder')}
        />
    );
}