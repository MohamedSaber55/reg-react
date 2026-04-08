// app/(dashboard)/dashboard/service-sections/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchServiceSections,
    createServiceSection,
    updateServiceSection,
    deleteServiceSection,
    changeServiceSectionStatus,
    setPagination
} from '@/store/slices/serviceSectionSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ServiceSectionForm from '@/dashboard/components/ServiceSectionForm';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';
import { FiGrid, FiTarget, FiGlobe, FiHash } from 'react-icons/fi';

export default function ServiceSectionsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { serviceSections, loading, pagination } = useAppSelector((state) => state.serviceSection);

    useEffect(() => {
        dispatch(fetchServiceSections({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createServiceSection(formData)).unwrap();
        dispatch(fetchServiceSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateServiceSection({ id, data: formData })).unwrap();
        dispatch(fetchServiceSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteServiceSection(id)).unwrap();
        dispatch(fetchServiceSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleToggleStatus = async (id, isActive) => {
        await dispatch(changeServiceSectionStatus({ id, isActive })).unwrap();
        dispatch(fetchServiceSections({
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize
        }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchServiceSections({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchServiceSections({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const columns = [
        {
            header: t('dashboard.serviceSections.columns.title'),
            field: 'titleEn',
            render: (item) => (
                <div className="flex items-start gap-3">
                    {/* Remove imageUrl since it's not in API */}
                    <div className="w-12 h-12 rounded-lg bg-primary-100   flex items-center justify-center shrink-0">
                        <FiGrid className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-third-900   truncate">
                            {item.titleEn}
                        </p>
                        {item.subTitleEn && (
                            <p className="text-sm text-third-500   line-clamp-1">
                                {truncateText(item.subTitleEn, 50)}
                            </p>
                        )}
                        <div dir="rtl" className="mt-1 text-end">
                            <p className="font-semibold text-third-900   truncate">
                                {item.titleAr}
                            </p>
                            {item.subTitleAr && (
                                <p className="text-sm text-third-500   line-clamp-1">
                                    {truncateText(item.subTitleAr, 50)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.serviceSections.columns.serviceItems'),
            field: 'serviceItems',
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="info" size="sm">
                        {item.serviceItems?.length || 0} {t('dashboard.serviceSections.items')}
                    </Badge>
                    {item.serviceItems?.slice(0, 3).map((serviceItem, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            {serviceItem.icon && (
                                <i className={serviceItem.icon}></i>
                            )}
                            <span className="text-third-500   truncate">
                                {serviceItem.titleEn}
                            </span>
                        </div>
                    ))}
                    {item.serviceItems && item.serviceItems.length > 3 && (
                        <span className="text-xs text-third-500">
                            +{item.serviceItems.length - 3} {t('dashboard.serviceSections.more')}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.serviceSections.columns.order'),
            field: 'displayOrder',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="min-w-10 justify-center">
                        <FiHash className="w-3 h-3" />
                        {item.displayOrder || 0}
                    </Badge>
                </div>
            )
        },
        {
            header: t('dashboard.serviceSections.columns.status'),
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
        return <ServiceSectionForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.serviceSections.title')}
            description={t('dashboard.serviceSections.description')}
            data={serviceSections}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.serviceSections.searchPlaceholder')}
        />
    );
}