// app/(dashboard)/dashboard/about-sections/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchAboutSections,
    createAboutSection,
    updateAboutSection,
    deleteAboutSection,
    changeAboutSectionStatus,
    setPagination
} from '@/store/slices/aboutSectionSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import AboutSectionForm from '@/dashboard/components/AboutSectionForm';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';
import { FiFileText, FiEye, FiTarget, FiGlobe } from 'react-icons/fi';

export default function AboutSectionsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { aboutSections, loading, pagination } = useAppSelector((state) => state.aboutSection);

    useEffect(() => {
        dispatch(fetchAboutSections({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createAboutSection(formData)).unwrap();
        dispatch(fetchAboutSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateAboutSection({ id, formData })).unwrap();
        dispatch(fetchAboutSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteAboutSection(id)).unwrap();
        dispatch(fetchAboutSections({ pageNumber: 1, pageSize: 10 }));
    };

    const handleToggleStatus = async (id, isActive) => {
        await dispatch(changeAboutSectionStatus({ id, isActive })).unwrap();
        dispatch(fetchAboutSections({
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize
        }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchAboutSections({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchAboutSections({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const columns = [
        {
            header: t('dashboard.aboutSections.columns.titleEn'),
            field: 'titleEn',
            render: (item) => (
                <div className="flex items-start gap-3">
                    {item.imageUrl && (
                        <img
                            src={item.imageUrl}
                            alt={item.titleEn}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                    )}
                    <div>
                        <p className="font-semibold text-third-900">{item.titleEn}</p>
                        {item.subTitleEn && (
                            <p className="text-sm text-third-500">
                                {truncateText(item.subTitleEn, 60)}
                            </p>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.titleAr'),
            field: 'titleAr',
            render: (item) => (
                <div dir="rtl" className="text-end">
                    <p className="font-semibold text-third-900">{item.titleAr}</p>
                    {item.subTitleAr && (
                        <p className="text-sm text-third-500">
                            {truncateText(item.subTitleAr, 60)}
                        </p>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.missionVision'),
            field: 'missionEn',
            render: (item) => (
                <div className="space-y-1">
                    {item.missionEn && (
                        <div className="flex items-start gap-1">
                            <FiTarget className="w-3 h-3 text-primary-600  mt-0.5 shrink-0" />
                            <p className="text-xs text-third-500   line-clamp-2">
                                {truncateText(item.missionEn, 80)}
                            </p>
                        </div>
                    )}
                    {item.visionEn && (
                        <div className="flex items-start gap-1">
                            <FiGlobe className="w-3 h-3 text-warning-600   mt-0.5 shrink-0" />
                            <p className="text-xs text-third-500   line-clamp-2">
                                {truncateText(item.visionEn, 80)}
                            </p>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.description'),
            field: 'descriptionEn',
            render: (item) => (
                <div className="text-sm">
                    <div className="text-third-500   line-clamp-3 mb-1">
                        {truncateText(item.descriptionEn, 120)}
                    </div>
                    <div className="text-xs text-third-500/70  /70 line-clamp-3" dir="rtl">
                        {truncateText(item.descriptionAr, 80)}
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.values'),
            field: 'values',
            render: (item) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="info" size="sm">
                        {item.values?.length || 0} {t('dashboard.aboutSections.values')}
                    </Badge>
                    {item.values?.slice(0, 2).map((value, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <FiFileText className="w-3 h-3 text-third-500   shrink-0" />
                            <span className="text-xs text-third-500   truncate">
                                {value.titleEn}
                            </span>
                        </div>
                    ))}
                    {item.values && item.values.length > 2 && (
                        <span className="text-xs text-third-500">
                            +{item.values.length - 2} {t('dashboard.aboutSections.more')}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.order'),
            field: 'displayOrder',
            render: (item) => (
                <div className="text-center">
                    <Badge variant="secondary">
                        #{item.displayOrder || 0}
                    </Badge>
                </div>
            )
        },
        {
            header: t('dashboard.aboutSections.columns.status'),
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
        return <AboutSectionForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.aboutSections.title')}
            description={t('dashboard.aboutSections.description')}
            data={aboutSections}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.aboutSections.searchPlaceholder')}
        />
    );
}