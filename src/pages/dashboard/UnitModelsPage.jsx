// app/(dashboard)/dashboard/unit-models/page.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchUnitModels,
    fetchUnitModelsByStage,
    createUnitModel,
    updateUnitModel,
    deleteUnitModel,
    changeUnitModelAvailability,
    setPagination
} from '@/store/slices/unitModelSlice';
import { fetchStages } from '@/store/slices/stageSlice';
import { fetchProjects } from '@/store/slices/projectSlice';
import CRUDTable from '@/dashboard/components/CRUDTable';
import UnitModelForm from '@/dashboard/components/UnitModelForm';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa6';
import { FiImage } from 'react-icons/fi';
import StatusBadge from '@/dashboard/components/StatusBadge';
import DateDisplay from '@/dashboard/components/DateDisplay';
import {Link} from 'react-router-dom';

export default function UnitModelsPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { unitModels, loading, pagination } = useAppSelector((state) => state.unitModel);
    const { stages } = useAppSelector((state) => state.stage);
    const { projects } = useAppSelector((state) => state.project);

    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedStage, setSelectedStage] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'unavailable'
    const [filteredStages, setFilteredStages] = useState([]);

    // Load data on mount
    useEffect(() => {
        dispatch(fetchUnitModels({ PageNumber: 1, PageSize: 10 }));
        dispatch(fetchStages({ PageNumber: 1, PageSize: 100 }));
        dispatch(fetchProjects({ PageNumber: 1, PageSize: 100 }));
    }, [dispatch]);

    // Filter stages based on selected project
    useEffect(() => {
        if (selectedProject === 'all') {
            setFilteredStages(stages);
        } else {
            const filtered = stages.filter(stage => stage.projectId === parseInt(selectedProject));
            setFilteredStages(filtered);
            // Reset stage filter if selected stage is not in filtered stages
            if (selectedStage !== 'all' && !filtered.find(s => s.id === parseInt(selectedStage))) {
                setSelectedStage('all');
            }
        }
    }, [selectedProject, stages, selectedStage]);

    const handleCreate = async (formData) => {
        await dispatch(createUnitModel(formData)).unwrap();
        refetchData();
    };

    const handleEdit = async (id, formData) => {
        await dispatch(updateUnitModel({ id, formData })).unwrap();
        refetchData();
    };

    const handleDelete = async (id) => {
        await dispatch(deleteUnitModel(id)).unwrap();
        refetchData();
    };

    const handleAvailabilityToggle = async (id, currentStatus) => {
        await dispatch(changeUnitModelAvailability({ id, isAvailable: !currentStatus })).unwrap();
        refetchData();
    };

    const handlePageChange = (newPage) => {
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        refetchData(newPage);
    };

    const handleSearch = (query) => {
        dispatch(fetchUnitModels({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            Search: query,
            ...(selectedStage !== 'all' && { stageId: selectedStage }),
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(availabilityFilter !== 'all' && { isAvailable: availabilityFilter === 'available' })
        }));
    };

    const handleDateFilter = (startDate, endDate) => {
        dispatch(fetchUnitModels({
            PageNumber: 1,
            PageSize: pagination.pageSize,
            StartDate: startDate,
            EndDate: endDate,
            ...(selectedStage !== 'all' && { stageId: selectedStage }),
            ...(selectedProject !== 'all' && { projectId: selectedProject }),
            ...(availabilityFilter !== 'all' && { isAvailable: availabilityFilter === 'available' })
        }));
    };

    const handleProjectFilterChange = (projectId) => {
        setSelectedProject(projectId);
        setSelectedStage('all');
        refetchData(1, projectId, 'all', availabilityFilter);
    };

    const handleStageFilterChange = (stageId) => {
        setSelectedStage(stageId);
        refetchData(1, selectedProject, stageId, availabilityFilter);
    };

    const handleAvailabilityFilterChange = (availability) => {
        setAvailabilityFilter(availability);
        refetchData(1, selectedProject, selectedStage, availability);
    };

    const refetchData = (page = pagination.pageNumber, project = selectedProject, stage = selectedStage, availability = availabilityFilter) => {
        const params = {
            PageNumber: page,
            PageSize: pagination.pageSize,
            ...(stage !== 'all' && { stageId: stage }),
            ...(project !== 'all' && { projectId: project }),
            ...(availability !== 'all' && { isAvailable: availability === 'available' })
        };

        if (stage !== 'all') {
            dispatch(fetchUnitModelsByStage({ stageId: stage, params }));
        } else {
            dispatch(fetchUnitModels(params));
        }
    };

    const getStageName = (stageId) => {
        const stage = stages.find(s => s.id === stageId);
        return stage?.name || 'N/A';
    };

    const getProjectName = (stageId) => {
        const stage = stages.find(s => s.id === stageId);
        const project = projects.find(p => p.id === stage?.projectId);
        return project?.name || 'N/A';
    };

    const getMainImage = (images) => {
        if (!images || !Array.isArray(images)) return null;
        const mainImage = images.find(img => img.isMain);
        return mainImage || images[0];
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const columns = [
        {
            header: t('dashboard.unitModels.columns.unit'),
            field: 'name',
            render: (item) => {
                const mainImage = getMainImage(item.images);
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 shrink-0">
                            {mainImage?.imageUrl ? (
                                <img
                                    src={mainImage.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-lg bg-primary-100 flex items-center justify-center">
                                    <FaHome className="w-6 h-6 text-primary-600" />
                                </div>
                            )}
                            {item.images?.length > 0 && (
                                <div className="absolute -bottom-1 -inset-e-1 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {item.images.length}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <span className="font-semibold text-third-900 block truncate">
                                {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-md text-neutral-600">
                                    {item.modelCode}
                                </span>
                                <span className="text-xs text-neutral-500 truncate">
                                    {getStageName(item.stageId)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: t('dashboard.unitModels.columns.specs'),
            field: 'specs',
            render: (item) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <FaRulerCombined className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-sm">{item.area} m²</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <FaBed className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{item.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaBath className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{item.bathrooms}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.unitModels.columns.price'),
            field: 'startingPrice',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-success-700">
                        {formatPrice(item.startingPrice)}
                    </span>
                </div>
            )
        },
        {
            header: t('dashboard.unitModels.columns.projectStage'),
            field: 'stage',
            render: (item) => (
                <div className="space-y-1">
                    <div className="font-medium text-third-900">
                        {getProjectName(item.stageId)}
                    </div>
                    <div className="text-sm text-neutral-500">
                        {getStageName(item.stageId)}
                    </div>
                </div>
            )
        },
        {
            header: t('dashboard.unitModels.columns.status'),
            field: 'isAvailable',
            render: (item) => (
                <button
                    onClick={() => handleAvailabilityToggle(item.id, item.isAvailable)}
                    className="inline-flex items-center"
                >
                    <StatusBadge
                        status={item.isAvailable}
                        activeText={t('dashboard.unitModels.status.available')}
                        inactiveText={t('dashboard.unitModels.status.unavailable')}
                    />
                </button>
            )
        },
        {
            header: t('dashboard.unitModels.columns.createdAt'),
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
                        {t('dashboard.unitModels.filters.project')}
                    </label>
                    <select
                        value={selectedProject}
                        onChange={(e) => handleProjectFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">{t('dashboard.unitModels.filters.allProjects')}</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stage Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('dashboard.unitModels.filters.stage')}
                    </label>
                    <select
                        value={selectedStage}
                        onChange={(e) => handleStageFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        disabled={filteredStages.length === 0}
                    >
                        <option value="all">{t('dashboard.unitModels.filters.allStages')}</option>
                        {filteredStages.map(stage => (
                            <option key={stage.id} value={stage.id}>
                                {stage.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Availability Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('dashboard.unitModels.filters.availability')}
                    </label>
                    <select
                        value={availabilityFilter}
                        onChange={(e) => handleAvailabilityFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">{t('dashboard.unitModels.filters.allAvailability')}</option>
                        <option value="available">{t('dashboard.unitModels.status.available')}</option>
                        <option value="unavailable">{t('dashboard.unitModels.status.unavailable')}</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderForm = ({ item, onSubmit, onCancel }) => {
        return (
            <UnitModelForm
                item={item}
                onSubmit={onSubmit}
                onCancel={onCancel}
                stages={stages}
                projects={projects}
            />
        );
    };

    const renderCustomActions = (item) => (
        <div className="flex gap-2">
            <Link
                to={`/dashboard/unit-models/${item.id}/images`}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-sm font-medium transition-colors"
            >
                <FiImage className="w-4 h-4" />
                <span>{t('dashboard.unitModels.actions.manageImages')}</span>
            </Link>
            <button
                onClick={() => handleAvailabilityToggle(item.id, item.isAvailable)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${item.isAvailable
                    ? 'bg-error-50 text-error-700 hover:bg-error-100'
                    : 'bg-success-50 text-success-700 hover:bg-success-100'
                    }`}
            >
                {item.isAvailable
                    ? t('dashboard.unitModels.actions.markUnavailable')
                    : t('dashboard.unitModels.actions.markAvailable')
                }
            </button>
        </div>
    );

    return (
        <div>
            {renderTableHeader()}
            <CRUDTable
                title={t('dashboard.unitModels.title')}
                description={t('dashboard.unitModels.description')}
                data={unitModels}
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
                customActions={renderCustomActions}
                searchPlaceholder={t('dashboard.unitModels.searchPlaceholder')}
                showDateFilter={true}
                createButtonText={t('dashboard.unitModels.createButton')}
            />
        </div>
    );
}