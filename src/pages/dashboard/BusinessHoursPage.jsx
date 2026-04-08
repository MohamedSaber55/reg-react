// app/(dashboard)/dashboard/business-hours/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchBusinessHours,
    createBusinessHour,
    updateBusinessHour,
    deleteBusinessHour
} from '@/store/slices/businessHourSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import BusinessHourForm from '@/dashboard/components/BusinessHourForm';
import { Badge } from '@/components/common/Badge';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function BusinessHoursPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { businessHours, loading } = useAppSelector((state) => state.businessHour);

    useEffect(() => {
        dispatch(fetchBusinessHours());
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createBusinessHour(formData)).unwrap();
        dispatch(fetchBusinessHours());
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateBusinessHour({ id, formData })).unwrap();
        dispatch(fetchBusinessHours());
    };

    const handleDelete = async (id) => {
        await dispatch(deleteBusinessHour(id)).unwrap();
        dispatch(fetchBusinessHours());
    };

    const formatTime = (time) => {
        if (!time) return '-';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? t('dashboard.businessHours.time.pm') : t('dashboard.businessHours.time.am');
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const columns = [
        {
            header: t('dashboard.businessHours.columns.day'),
            field: 'day',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100   flex items-center justify-center">
                        <FiClock className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-semibold text-third-900">
                        {t(`dashboard.businessHours.days.${(item.day)?.toLowerCase()}`)}
                        {/* {item.day} */}
                    </span>
                </div>
            )
        },
        {
            header: t('dashboard.businessHours.columns.status'),
            field: 'isWorkingDay',
            render: (item) => (
                <Badge
                    variant={item.isWorkingDay ? 'success' : 'secondary'}
                    rounded
                    icon={item.isWorkingDay ? <FiCheck /> : <FiX />}
                >
                    {item.isWorkingDay
                        ? t('dashboard.businessHours.open')
                        : t('dashboard.businessHours.closed')
                    }
                </Badge>
            )
        },
        {
            header: t('dashboard.businessHours.columns.hours'),
            field: 'from',
            render: (item) => (
                <div>
                    {item.isWorkingDay ? (
                        <div className="text-sm">
                            <span className="font-medium text-third-900">
                                {formatTime(item.from)}
                            </span>
                            <span className="mx-2 text-third-500">-</span>
                            <span className="font-medium text-third-900">
                                {formatTime(item.to)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-third-500">
                            {t('dashboard.businessHours.closed')}
                        </span>
                    )}
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <BusinessHourForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    };

    return (
        <CRUDTable
            title={t('dashboard.businessHours.title')}
            description={t('dashboard.businessHours.description')}
            data={businessHours}
            columns={columns}
            loading={loading}
            onSearch={null}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.businessHours.searchPlaceholder')}
        />
    );
}