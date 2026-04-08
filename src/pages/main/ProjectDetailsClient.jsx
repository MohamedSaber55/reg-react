// app/(main)/projects/[id]/ProjectDetailsClient.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useParams, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProjectById, clearCurrentProject } from '@/store/slices/projectSlice';
import { fetchUnitModelsByStage } from '@/store/slices/unitModelSlice';
import Loading from '@/components/layout/Loading';
import EmptyState from '@/components/common/EmptyState';
import { FiPackage, FiLayers, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/priceUtils';

export default function ProjectDetailsClient({ projectId }) {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const resolvedProjectId = typeof params?.id === 'string' && params.id !== 'placeholder'
        ? params.id
        : params?.id;
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const { currentProject, operationLoading } = useAppSelector((state) => state.project);
    const { unitModels, loading: unitsLoading } = useAppSelector((state) => state.unitModel);

    const [selectedStage, setSelectedStage] = useState(null);

    useEffect(() => {
        if (resolvedProjectId && resolvedProjectId !== 'placeholder') {
            dispatch(fetchProjectById(resolvedProjectId));
        }

        return () => {
            dispatch(clearCurrentProject());
        };
    }, [dispatch, resolvedProjectId]);

    useEffect(() => {
        if (currentProject?.stages && currentProject.stages.length > 0) {
            setSelectedStage(currentProject.stages[0]);
        }
    }, [currentProject]);

    useEffect(() => {
        if (selectedStage?.id) {
            dispatch(fetchUnitModelsByStage({
                stageId: selectedStage.id,
                params: {
                    pageNumber: 1,
                    pageSize: 100
                }
            }));
        }
    }, [selectedStage?.id, dispatch]);

    if (operationLoading || !currentProject) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const project = currentProject;
    const stages = project.stages || [];
    const activeStages = stages.filter(s => s.isActive);

    const handleStageClick = (stageId) => {
        navigate(`/projects/${project.id}/stages/${stageId}`);
    };

    const handleUnitClick = (stageId, unitId) => {
        navigate(`/projects/${project.id}/stages/${stageId}/units/${unitId}`);
    };

    const handleStageTabClick = (stage) => {
        setSelectedStage(stage);
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className="layer flex items-center justify-center w-full bg-linear-to-r from-primary-600/60 to-primary-800/60 py-20">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <FiPackage className="text-3xl text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
                                {project.name}
                            </h1>
                            <p className="text-lg text-white/90">
                                {stages.length} {t('projects.stages', 'Stages')} | {activeStages.length} {t('projects.active', 'Active')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <FiLayers className="text-2xl text-primary-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('projects.totalStages', 'Total Stages')}
                                </div>
                                <div className="text-2xl font-bold text-third-900">
                                    {stages.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                                <FiCheckCircle className="text-2xl text-success-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('projects.activeStages', 'Active Stages')}
                                </div>
                                <div className="text-2xl font-bold text-third-900">
                                    {activeStages.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {project.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-third-900 mb-4 font-serif">
                            {t('projects.description', 'Description')}
                        </h2>
                        <p className="text-third-500 leading-relaxed whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-third-900 mb-6 font-serif">
                        {t('projects.projectStages', 'Project Stages')}
                    </h2>

                    {stages.length === 0 ? (
                        <EmptyState
                            icon={FiLayers}
                            title={t('projects.noStages', 'No Stages Available')}
                            description={t('projects.noStagesDescription', 'This project does not have any stages yet.')}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stages.map((stage) => (
                                <StageCard
                                    key={stage.id}
                                    stage={stage}
                                    projectId={project.id}
                                    onClick={() => handleStageClick(stage.id)}
                                    t={t}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>

                {stages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-third-900 mb-6 font-serif">
                            {t('projects.unitModels', 'Unit Models')}
                        </h2>

                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {stages.map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => handleStageTabClick(stage)}
                                    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedStage?.id === stage.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-neutral-50 text-third-900 border border-neutral-400 hover:bg-primary-50'
                                        }`}
                                >
                                    {stage.name}
                                </button>
                            ))}
                        </div>

                        {selectedStage && (
                            <div>
                                {unitsLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden animate-pulse">
                                                <div className="aspect-video bg-neutral-200"></div>
                                                <div className="p-6 space-y-3">
                                                    <div className="h-6 bg-neutral-200 rounded"></div>
                                                    <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                                                    <div className="h-8 bg-neutral-200 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : unitModels.length === 0 ? (
                                    <EmptyState
                                        icon={FiPackage}
                                        title={t('projects.noUnits', 'No Unit Models Available')}
                                        description={t('projects.noUnitsDescription', 'This stage does not have any unit models yet.')}
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {unitModels.map((unit) => (
                                            <UnitModelCard
                                                key={unit.id}
                                                unit={unit}
                                                stageId={selectedStage.id}
                                                projectId={project.id}
                                                onClick={() => handleUnitClick(selectedStage.id, unit.id)}
                                                t={t}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

const StageCard = ({ stage, projectId, onClick, t }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-neutral-50 rounded-2xl border border-neutral-400 p-6 cursor-pointer hover:shadow-xl transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-third-900 font-serif flex-1">
                    {stage.name}
                </h3>
                {stage.isActive ? (
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                        <FiCheckCircle className="text-lg text-success-600" />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                        <FiXCircle className="text-lg text-error-600" />
                    </div>
                )}
            </div>

            {stage.code && (
                <div className="mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                        {stage.code}
                    </span>
                </div>
            )}

            {stage.description && (
                <p className="text-third-500 text-sm mb-4 line-clamp-2">
                    {stage.description}
                </p>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-2 text-third-500">
                        <FiCalendar className="text-accent-600" />
                        <span className="text-sm">{t('stages.deliveryDate', 'Delivery Date')}</span>
                    </div>
                    <span className="text-sm font-bold text-third-900">
                        {formatDate(stage.deliveryDate)}
                    </span>
                </div>
            </div>

            <button className="w-full mt-4 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                {t('stages.viewDetails', 'View Stage Details')}
            </button>
        </motion.div>
    );
};

const UnitModelCard = ({ unit, stageId, projectId, onClick, t }) => {
    const mainImage = unit.images?.find(img => img.isMain) || unit.images?.[0];

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
        >
            {mainImage && (
                <div className="aspect-video overflow-hidden">
                    <img
                        src={mainImage.imageUrl}
                        alt={unit.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-third-900 font-serif flex-1">
                        {unit.name}
                    </h3>
                    {unit.isAvailable ? (
                        <span className="px-3 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                            {t('units.available', 'Available')}
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-error-100 text-error-700 text-xs font-semibold rounded-full">
                            {t('units.soldOut', 'Sold Out')}
                        </span>
                    )}
                </div>

                {unit.modelCode && (
                    <div className="mb-3">
                        <span className="text-sm text-third-500">{unit.modelCode}</span>
                    </div>
                )}

                <div className="mb-4">
                    <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(unit.startingPrice, { t, currency: 'models.currency' })}
                    </div>
                    <div className="text-xs text-third-500">{t('units.startingFrom', 'Starting from')}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.area', 'Area')}</div>
                        <div className="font-bold text-third-900">{unit.area}m²</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.beds', 'Beds')}</div>
                        <div className="font-bold text-third-900">{unit.bedrooms}</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-50 rounded-lg">
                        <div className="text-xs text-third-500">{t('units.baths', 'Baths')}</div>
                        <div className="font-bold text-third-900">{unit.bathrooms}</div>
                    </div>
                </div>

                <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                    {t('units.viewDetails', 'View Details')}
                </button>
            </div>
        </motion.div>
    );
};