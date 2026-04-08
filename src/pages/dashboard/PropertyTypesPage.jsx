import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchPropertyTypes,
    createPropertyType,
    updatePropertyType,
    deletePropertyType,
    setPagination
} from '@/store/slices/propertyTypeSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import PropertyTypeForm from '@/dashboard/components/PropertyTypeForm';

export default function PropertyTypesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { propertyTypes, loading, pagination } = useAppSelector((state) => state.propertyType);

    useEffect(() => {
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        try {
            await dispatch(createPropertyType(formData)).unwrap();
            dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 10 }));
        } catch (error) {
            console.error('Failed to create property type:', error);
        }
    };

    const handleEdit = async (id, formData) => {
        try {
            await dispatch(updatePropertyType({ propertyTypeId: id, data: formData })).unwrap();
            dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 10 }));
        } catch (error) {
            console.error('Failed to update property type:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deletePropertyType(id)).unwrap();
            dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 10 }));
        } catch (error) {
            console.error('Failed to delete property type:', error);
        }
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchPropertyTypes({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchPropertyTypes({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.propertyTypes.columns.id'),
            field: 'id',
            render: (item) => `#${item.id}`,
            sortable: true
        },
        {
            header: t('dashboard.propertyTypes.columns.nameEn'),
            field: 'nameEn',
            sortable: true
        },
        {
            header: t('dashboard.propertyTypes.columns.nameAr'),
            field: 'nameAr',
            sortable: true
        },
        {
            header: t('dashboard.propertyTypes.columns.createdAt'),
            field: 'createdAt',
            render: (item) => new Date(item.createdAt).toLocaleDateString(),
            sortable: true
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <PropertyTypeForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    {/* <h1 className="text-3xl font-bold text-third-900   font-serif mb-2">
                        {t('dashboard.propertyTypes.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.propertyTypes.description')}
                    </p> */}
                </div>
            </div>

            {/* CRUD Table */}
            <CRUDTable
                title={t('dashboard.propertyTypes.title')}
                description={t('dashboard.propertyTypes.description')}
                data={propertyTypes}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderForm={renderForm}
                searchPlaceholder={t('dashboard.propertyTypes.searchPlaceholder')}
                createButtonText={t('dashboard.crud.addNew')}
                editButtonText={t('dashboard.crud.edit')}
                deleteButtonText={t('dashboard.crud.delete')}
                exportButtonText={t('dashboard.properties.export')}
                noDataText={t('dashboard.crud.noData')}
                confirmDeleteText={t('dashboard.crud.deleteConfirm')}
                confirmDeleteTitle={t('dashboard.crud.deleteTitle')}
                cancelText={t('common.cancel')}
                createText={t('dashboard.crud.create')}
                updateText={t('dashboard.crud.update')}
            />
        </div>
    );
}