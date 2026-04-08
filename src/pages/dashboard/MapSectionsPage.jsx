// app/(dashboard)/dashboard/map-sections/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchMapSections,
    createMapSection,
    updateMapSection,
    deleteMapSection
} from '@/store/slices/mapSectionSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import MapSectionForm from '@/dashboard/components/MapSectionForm';
import { FiMap, FiGlobe } from 'react-icons/fi';

export default function MapSectionsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { mapSections, loading } = useAppSelector((state) => state.mapSection);

    useEffect(() => {
        dispatch(fetchMapSections());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createMapSection(formData)).unwrap();
        dispatch(fetchMapSections());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateMapSection({ id, data: formData })).unwrap();
        dispatch(fetchMapSections());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteMapSection(id)).unwrap();
        dispatch(fetchMapSections());
    };

    const columns = [
        {
            header: t('dashboard.mapSections.columns.titleEn'),
            field: 'titleEn',
            render: (item) => (
                <div className="font-medium text-third-900">
                    {item.titleEn || t('common.notAvailable')}
                </div>
            )
        },
        {
            header: t('dashboard.mapSections.columns.titleAr'),
            field: 'titleAr',
            render: (item) => (
                <div dir="rtl" className="font-medium text-third-900">
                    {item.titleAr || t('common.notAvailable')}
                </div>
            )
        },
        {
            header: t('dashboard.mapSections.columns.addressEn'),
            field: 'addressTextEn',
            render: (item) => (
                <div className="text-sm text-third-500">
                    {item.addressTextEn || t('common.notAvailable')}
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => (
        <MapSectionForm item={item} onSubmit={onSubmit} onCancel={onCancel} />
    );

    return (
        <CRUDTable
            title={t('dashboard.mapSections.title')}
            description={t('dashboard.mapSections.description')}
            data={mapSections}
            columns={columns}
            loading={loading}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.mapSections.searchPlaceholder')}
        />
    );
}