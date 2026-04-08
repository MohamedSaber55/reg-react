// app/(dashboard)/dashboard/about-values/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchAboutValues,
    createAboutValue,
    updateAboutValue,
    deleteAboutValue,
    changeAboutValueStatus,
    setPagination
} from '@/store/slices/aboutValueSlice';
import { fetchAboutSections } from '@/store/slices/aboutSectionSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import AboutValueForm from '@/dashboard/components/AboutValueForm';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';
import { Select } from '@/components/common/Input';
import { FiAward } from 'react-icons/fi';

export default function AboutValuesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { aboutValues, loading, pagination } = useAppSelector((state) => state.aboutValue);
    const { aboutSections } = useAppSelector((state) => state.aboutSection);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        dispatch(fetchAboutSections({ pageSize: 100 }));
        dispatch(fetchAboutValues({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createAboutValue(formData)).unwrap();
        dispatch(fetchAboutValues({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateAboutValue({ id, data: formData })).unwrap();
        dispatch(fetchAboutValues({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteAboutValue(id)).unwrap();
        dispatch(fetchAboutValues({ pageNumber: 1, pageSize: 10 }));
    };

    const handleToggleStatus = async (id, isActive) => {
        await dispatch(changeAboutValueStatus({ id, isActive })).unwrap();
        dispatch(fetchAboutValues({ pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchAboutValues({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchAboutValues({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.aboutValues.columns.titleEn'),
            field: 'titleEn',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100   flex items-center justify-center">
                        <FiAward className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-semibold text-third-900">{item.titleEn}</span>
                </div>
            )
        },
        {
            header: t('dashboard.aboutValues.columns.titleAr'),
            field: 'titleAr',
            render: (item) => (
                <div dir="rtl" className="font-semibold text-third-900">
                    {item.titleAr}
                </div>
            )
        },
        {
            header: t('dashboard.aboutValues.columns.section'),
            field: 'aboutSectionId',
            render: (item) => {
                const section = aboutSections.find(s => s.id === item.aboutSectionId);
                return (
                    <Badge variant="info" outlined>
                        {section?.titleEn || t('dashboard.common.notAvailable')}
                    </Badge>
                );
            }
        },
        {
            header: t('dashboard.aboutValues.columns.status'),
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
        return <AboutValueForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <div className="space-y-6">
            {/* Section Filter */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                <Select
                    label={t('dashboard.aboutValues.filterBySection')}
                    value={selectedSection || ''}
                    onChange={(e) => setSelectedSection(e.target.value ? parseInt(e.target.value) : null)}
                    options={[
                        { value: '', label: t('dashboard.aboutValues.allSections') },
                        ...aboutSections.map(section => ({
                            value: section.id.toString(),
                            label: section.titleEn
                        }))
                    ]}
                />
            </div>

            <CRUDTable
                title={t('dashboard.aboutValues.title')}
                description={t('dashboard.aboutValues.description')}
                data={aboutValues}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderForm={renderForm}
                searchPlaceholder={t('dashboard.aboutValues.searchPlaceholder')}
            />
        </div>
    );
}