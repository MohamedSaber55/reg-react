// app/(dashboard)/dashboard/projects/page.jsx
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    setPagination
} from '@/store/slices/projectSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ProjectForm from '@/dashboard/components/ProjectForm';
import { FaBuilding } from 'react-icons/fa6';

export default function ProjectsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { projects, loading, pagination } = useAppSelector((state) => state.project);

    useEffect(() => {
        dispatch(fetchProjects({ PageNumber: 1, PageSize: 10 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createProject(formData)).unwrap();
        dispatch(fetchProjects({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize
        }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateProject({ id, data: formData })).unwrap();
        dispatch(fetchProjects({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize
        }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteProject(id)).unwrap();
        dispatch(fetchProjects({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize
        }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchProjects({
            PageNumber: newPage,
            PageSize: pagination.pageSize
        }));
    };

    const handleSearch = (query) => {
        dispatch(fetchProjects({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            Search: query
        }));
    };

    const handleDateFilter = (startDate, endDate) => {
        dispatch(fetchProjects({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            StartDate: startDate,
            EndDate: endDate
        }));
    };

    const columns = [
        {
            header: t('dashboard.projects.columns.name'),
            field: 'name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaBuilding className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <span className="font-semibold text-third-900 block">
                            {item.name}
                        </span>
                        <span className="text-sm text-third-500">
                            ID: {item.id}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.projects.columns.stages'),
            field: 'stages',
            render: (item) => (
                <div className="font-semibold text-third-900">
                    {item.stages?.length || 0}
                </div>
            )
        },
        {
            header: t('dashboard.projects.columns.totalUnits'),
            field: 'unitModels',
            render: (item) => {
                const totalUnits = item.stages?.reduce((total, stage) => {
                    return total + (stage.unitModels?.length || 0);
                }, 0) || 0;
                return (
                    <div className="text-third-900">
                        {totalUnits}
                    </div>
                );
            }
        },
        {
            header: t('dashboard.projects.columns.activeStages'),
            field: 'activeStages',
            render: (item) => {
                const activeStages = item.stages?.filter(stage => stage.isActive)?.length || 0;
                return (
                    <div className={`font-semibold ${activeStages > 0 ? 'text-success-600' : 'text-error-600'}`}>
                        {activeStages}
                    </div>
                );
            }
        },
        {
            header: t('dashboard.projects.columns.createdAt'),
            field: 'createdAt',
            render: (item) => {
                // Note: If createdAt is not in the response, you might need to adjust
                if (!item.createdAt) return '-';
                const date = new Date(item.createdAt);
                return (
                    <div className="text-third-900">
                        {date.toLocaleDateString()}
                    </div>
                );
            }
        }
    ];

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return <ProjectForm item={item} onSubmit={onSubmit} onCancel={onCancel} />;
    };

    return (
        <CRUDTable
            title={t('dashboard.projects.title')}
            description={t('dashboard.projects.description')}
            data={projects}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onDateFilter={handleDateFilter}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderForm={renderForm}
            searchPlaceholder={t('dashboard.projects.searchPlaceholder')}
            showDateFilter={true}
        />
    );
}