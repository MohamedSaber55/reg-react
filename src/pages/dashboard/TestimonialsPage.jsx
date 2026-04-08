// app/(dashboard)/dashboard/testimonials/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    setPagination,
    changeTestimonialStatus
} from '@/store/slices/testimonialSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import { TestimonialForm } from '@/dashboard/components/TestimonialForm';
import { Switch } from '@/components/common/Switch';
import { FiUser, FiStar, FiMapPin, FiMail, FiCalendar } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

export default function TestimonialsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { testimonials, loading, pagination } = useAppSelector((state) => state.testimonial);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchTestimonials({ pageNumber: 1, pageSize: 10, search: searchQuery }));
    }, [dispatch, searchQuery]);

    const handleCreate = async (testimonialData) => {
        try {
            await dispatch(createTestimonial(testimonialData)).unwrap();
            dispatch(fetchTestimonials({
                pageNumber: 1,
                pageSize: pagination.pageSize,
                search: searchQuery
            }));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleEdit = async (id, testimonialData) => {
        try {
            await dispatch(updateTestimonial({ id, ...testimonialData })).unwrap();
            dispatch(fetchTestimonials({
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                search: searchQuery
            }));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteTestimonial(id)).unwrap();
            dispatch(fetchTestimonials({
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                search: searchQuery
            }));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleToggleStatus = async (id, isActive) => {
        try {
            await dispatch(changeTestimonialStatus({ id, isActive })).unwrap();
            dispatch(fetchTestimonials({
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                search: searchQuery
            }));
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchTestimonials({
            pageNumber: newPage,
            pageSize: pagination.pageSize,
            search: searchQuery
        }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Reset to first page when searching
        dispatch(setPagination({ pageNumber: 1, pageSize: pagination.pageSize }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatExperienceDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'MMM yyyy');
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const columns = [
        {
            header: t('dashboard.testimonialsPage.columns.author'),
            field: 'name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <FiUser className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-third-900   truncate">{item.name}</p>
                        <p className="text-sm text-third-500   truncate flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {item.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.testimonialsPage.columns.comment'),
            field: 'comment',
            render: (item) => (
                <div className="min-w-0">
                    <p className="text-third-900   line-clamp-2 mb-2">{item.comment}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <FiStar className="w-4 h-4 text-warning-500" />
                                <span className="text-sm font-medium text-third-900">
                                    {item.rating}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiMapPin className="w-3 h-3 text-third-500" />
                                <span className="text-sm text-third-500">
                                    {item.location}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-third-500">
                            <FiCalendar className="w-3 h-3" />
                            {formatExperienceDate(item.experienceDate)}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.testimonialsPage.columns.created'),
            field: 'createdAt',
            render: (item) => (
                <div className="text-sm text-third-500">
                    {formatDate(item.createdAt)}
                </div>
            )
        },
        {
            header: t('dashboard.testimonialsPage.columns.status'),
            field: 'isActive',
            render: (item) => (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={item.isActive}
                            onCheckedChange={(checked) => handleToggleStatus(item.id, checked)}
                            disabled={loading}
                        />
                        <span className={`text-sm font-medium ${item.isActive
                            ? 'text-success-600  '
                            : 'text-error-600  '
                            }`}>
                            {item.isActive ? t('dashboard.common.active') : t('dashboard.common.inactive')}
                        </span>
                    </div>
                </div>
            )
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <TestimonialForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    // Ensure testimonials is an array and pagination has the correct structure
    const tableData = Array.isArray(testimonials) ? testimonials : [];
    const tablePagination = pagination || {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false
    };

    return (
        <CRUDTable
            title={t('dashboard.testimonialsPage.title')}
            description={t('dashboard.testimonialsPage.description')}
            data={tableData}
            columns={columns}
            loading={loading}
            pagination={tablePagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.testimonialsPage.searchPlaceholder')}
            createButtonText={t('dashboard.testimonialsPage.createButton')}
            searchKeys={['name', 'email', 'location', 'comment']}
        />
    );
}