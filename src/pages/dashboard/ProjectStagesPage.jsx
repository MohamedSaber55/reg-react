// app/(dashboard)/dashboard/project-stages/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchStages,
    createStage,
    updateStage,
    deleteStage,
    changeStageStatus,
    setPagination
} from '@/store/slices/stageSlice';
import { fetchProjects } from '@/store/slices/projectSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import ProjectStageForm from '@/dashboard/components/ProjectStageForm';
import { FaCalendar, FaBuilding } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import StatusBadge from '@/dashboard/components/StatusBadge';
import DateDisplay from '@/dashboard/components/DateDisplay';

export default function ProjectStagesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { stages, loading, pagination } = useAppSelector((state) => state.stage);
    const { projects } = useAppSelector((state) => state.project);

    const [selectedProject, setSelectedProject] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Load stages and projects on mount
    useEffect(() => {
        dispatch(fetchStages({ PageNumber: 1, PageSize: 10 }));
        dispatch(fetchProjects({ PageNumber: 1, PageSize: 100 }));
    }, [dispatch]);

    const handleCreate = async (formData) => {
        await dispatch(createStage(formData)).unwrap();
        dispatch(fetchStages({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateStage({ id, data: formData })).unwrap();
        dispatch(fetchStages({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleDelete = async (id) => {
        await dispatch(deleteStage(id)).unwrap();
        dispatch(fetchStages({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleStatusToggle = async (id, currentStatus) => {
        await dispatch(changeStageStatus({ id, isActive: !currentStatus })).unwrap();
        dispatch(fetchStages({
            PageNumber: pagination.pageNumber,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchStages({
            PageNumber: newPage,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleSearch = (query) => {
        dispatch(fetchStages({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            Search: query,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleDateFilter = (startDate, endDate) => {
        dispatch(fetchStages({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            StartDate: startDate,
            EndDate: endDate,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleProjectFilterChange = (projectId) => {
        setSelectedProject(projectId);
        dispatch(fetchStages({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            ...(projectId !== 'all' && { projectId }),
            ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' })
        }));
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        dispatch(fetchStages({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(status !== 'all' && { isActive: status === 'active' })
        }));
    };

    const getProjectName = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'N/A';
    };

    const columns = [
        {
            header: t('dashboard.projectStages.columns.name'),
            field: 'name',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaCalendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                        <span className="font-semibold text-third-900 block truncate">
                            {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-md text-neutral-600">
                                {item.code}
                            </span>
                            <span className="text-xs text-neutral-500 truncate">
                                Display: {item.displayOrder}
                            </span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.projectStages.columns.project'),
            field: 'project',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <FaBuilding className="w-4 h-4 text-neutral-500" />
                    <span className="font-medium text-third-900">
                        {item.project?.name || getProjectName(item.projectId)}
                    </span>
                </div>
            )
        },
        {
            header: t('dashboard.projectStages.columns.deliveryDate'),
            field: 'deliveryDate',
            render: (item) => (
                <DateDisplay
                    date={item.deliveryDate}
                    format="medium"
                    className="font-medium"
                />
            )
        },
        {
            header: t('dashboard.projectStages.columns.unitModels'),
            field: 'unitModels',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <FaHome className="w-4 h-4 text-neutral-500" />
                    <span className="font-semibold text-third-900">
                        {item.unitModels?.length || 0}
                    </span>
                </div>
            )
        },
        {
            header: t('dashboard.projectStages.columns.status'),
            field: 'isActive',
            render: (item) => (
                <button
                    onClick={() => handleStatusToggle(item.id, item.isActive)}
                    className="inline-flex items-center"
                >
                    <StatusBadge
                        status={item.isActive}
                        activeText={t('dashboard.common.active')}
                        inactiveText={t('dashboard.common.inactive')}
                    />
                </button>
            )
        },
        {
            header: t('dashboard.projectStages.columns.createdAt'),
            field: 'createdAt',
            render: (item) => (
                <DateDisplay
                    date={item.createdAt}
                    format="short"
                    className="text-sm"
                />
            )
        }
    ];

    // Custom header with filters
    const renderTableHeader = () => (
        <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Project Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('dashboard.projectStages.filters.project')}
                    </label>
                    <select
                        value={selectedProject}
                        onChange={(e) => handleProjectFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">{t('dashboard.projectStages.filters.allProjects')}</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('dashboard.projectStages.filters.status')}
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">{t('dashboard.projectStages.filters.allStatus')}</option>
                        <option value="active">{t('dashboard.common.active')}</option>
                        <option value="inactive">{t('dashboard.common.inactive')}</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <ProjectStageForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                projects={projects}
            />
        );
    };

    return (
        <div>
            {renderTableHeader()}
            <CRUDTable
                title={t('dashboard.projectStages.title')}
                description={t('dashboard.projectStages.description')}
                data={stages}
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
                searchPlaceholder={t('dashboard.projectStages.searchPlaceholder')}
                showDateFilter={true}
                customActions={(item) => (
                    <button
                        onClick={() => handleStatusToggle(item.id, item.isActive)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${item.isActive
                                ? 'bg-error-50 text-error-700 hover:bg-error-100'
                                : 'bg-success-50 text-success-700 hover:bg-success-100'
                            }`}
                    >
                        {item.isActive
                            ? t('dashboard.actions.deactivate')
                            : t('dashboard.actions.activate')
                        }
                    </button>
                )}
            />
        </div>
    );
}