// app/(dashboard)/dashboard/service-items/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchServiceItems,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem,
    changeServiceItemStatus,
    setPagination
} from '@/store/slices/serviceItemSlice';
import { fetchServiceSections } from '@/store/slices/serviceSectionSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ServiceItemForm from '@/dashboard/components/ServiceItemForm';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';
import { Select } from '@/components/common/Input';
import { FiBox } from 'react-icons/fi';

export default function ServiceItemsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { serviceItems, loading, pagination } = useAppSelector((state) => state.serviceItem);
    const { serviceSections } = useAppSelector((state) => state.serviceSection);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        dispatch(fetchServiceSections({ pageSize: 100 }));
        dispatch(fetchServiceItems({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createServiceItem(formData)).unwrap();
        dispatch(fetchServiceItems({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateServiceItem({ id, data: formData })).unwrap();
        dispatch(fetchServiceItems({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteServiceItem(id)).unwrap();
        dispatch(fetchServiceItems({ pageNumber: 1, pageSize: 10 }));
    };

    const handleToggleStatus = async (id, isActive) => {
        await dispatch(changeServiceItemStatus({ id, isActive })).unwrap();
        dispatch(fetchServiceItems({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchServiceItems({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchServiceItems({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.serviceItems.columns.titleEn'),
            field: 'titleEn',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100   flex items-center justify-center">
                        <FiBox className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-semibold text-third-900">{item.titleEn}</span>
                </div>
            )
        },
        {
            header: t('dashboard.serviceItems.columns.titleAr'),
            field: 'titleAr',
            render: (item) => (
                <div dir="rtl" className="font-semibold text-third-900">
                    {item.titleAr}
                </div>
            )
        },
        {
            header: t('dashboard.serviceItems.columns.section'),
            field: 'serviceSectionId',
            render: (item) => {
                const section = serviceSections.find(s => s.id === item.serviceSectionId);
                return (
                    <Badge variant="info" outlined>
                        {section?.titleEn || t('dashboard.common.notAvailable')}
                    </Badge>
                );
            }
        },
        {
            header: t('dashboard.serviceItems.columns.status'),
            field: 'isActive',
            render: (item) => (
                <div className="flex items-center">
                    <Switch
                        checked={item.isActive}
                        onCheckedChange={(checked) => handleToggleStatus(item.id, checked)}
                        disabled={loading}
                    />
                    <span className={`ms-2 text-sm font-medium ${item.isActive
                        ? 'text-success-600  '
                        : 'text-third-500  '
                        }`}>
                        {item.isActive ? t('dashboard.common.active') : t('dashboard.common.inactive')}
                    </span>
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <ServiceItemForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <div className="space-y-6">
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                <Select
                    label={t('dashboard.serviceItems.filterBySection')}
                    value={selectedSection || ''}
                    onChange={(e) => setSelectedSection(e.target.value ? parseInt(e.target.value) : null)}
                    options={[
                        { value: '', label: t('dashboard.serviceItems.allSections') },
                        ...serviceSections.map(section => ({
                            value: section.id.toString(),
                            label: section.titleEn
                        }))
                    ]}
                />
            </div>

            <CRUDTable
                title={t('dashboard.serviceItems.title')}
                description={t('dashboard.serviceItems.description')}
                data={serviceItems}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderForm={renderForm}
                searchPlaceholder={t('dashboard.serviceItems.searchPlaceholder')}
            />
        </div>
    );
}