// app/(dashboard)/dashboard/sliders/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    setPagination
} from '@/store/slices/sliderSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import { SliderForm } from '@/dashboard/components/SliderForm';
import { Badge } from '@/components/common/Badge';

export default function SlidersPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { sliders, loading, pagination } = useAppSelector((state) => state.slider);

    useEffect(() => {
        dispatch(fetchSliders({ pageNumber: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createSlider(formData)).unwrap();
        dispatch(fetchSliders({ pageNumber: 1, pageSize: 10 }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateSlider({ id, data: formData })).unwrap();
        dispatch(fetchSliders({ pageNumber: 1, pageSize: 10 }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteSlider(id)).unwrap();
        dispatch(fetchSliders({ pageNumber: 1, pageSize: 10 }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchSliders({ pageNumber: newPage, pageSize: pagination.pageSize }));
    };

    const handleSearch = (query) => {
        dispatch(fetchSliders({ pageNumber: 1, pageSize: 10, search: query }));
    };

    const columns = [
        {
            header: t('dashboard.slidersPage.columns.name'),
            field: 'name',
            render: (item) => (
                <div>
                    <p className="font-semibold text-third-900">{item.name}</p>
                    <p className="text-sm text-third-500">{item.description}</p>
                </div>
            )
        },
        {
            header: t('dashboard.slidersPage.columns.images'),
            field: 'sliderImages',
            render: (item) => (
                <div className="flex -space-x-2">
                    {item.sliderImages?.slice(0, 3).map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl || 'https://via.placeholder.com/40'}
                            alt={`Slider image ${index + 1}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-neutral-50"
                        />
                    ))}
                    {item.sliderImages?.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-primary-100   border-2 border-neutral-50   flex items-center justify-center text-primary-600  text-sm font-semibold">
                            +{item.sliderImages.length - 3}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: t('dashboard.slidersPage.columns.status'),
            field: 'isActive',
            render: (item) => (
                <Badge variant={item.isActive ? 'success' : 'secondary'} rounded>
                    {item.isActive ? t('dashboard.common.active') : t('dashboard.common.inactive')}
                </Badge>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <SliderForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.slidersPage.title')}
            description={t('dashboard.slidersPage.description')}
            data={sliders}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.slidersPage.searchPlaceholder')}
        />
    );
}