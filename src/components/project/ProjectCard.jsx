import React from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiLayers, FiCalendar } from 'react-icons/fi';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

export const ProjectCard = ({ project, viewMode = 'grid' }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const stagesCount = project.stages?.length || 0;
    const activeStagesCount = project.stages?.filter(s => s.isActive)?.length || 0;

    const handleClick = () => {
        // Track project view when card is clicked
        metaPixelEvents.viewProject(
            project.id,
            project.name,
            stagesCount
        );

        navigate(`/projects/${project.id}`);
    };

    const handleViewDetailsClick = (e) => {
        // Prevent double-firing since the parent div also has onClick
        e.stopPropagation();

        // Track CTA click specifically for the "View Details" button
        metaPixelEvents.ctaClick(
            'View Details',
            `/projects/${project.id}`,
            viewMode === 'list' ? 'project_card_list' : 'project_card_grid'
        );

        navigate(`/projects/${project.id}`);
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={handleClick}
                className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-third-900 mb-2 font-serif">
                                {project.name}
                            </h3>
                        </div>
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                            <FiPackage className="text-2xl text-primary-600" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                                <FiLayers className="text-lg text-accent-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('projects.totalStages', 'Total Stages')}
                                </div>
                                <div className="text-lg font-bold text-third-900">
                                    {stagesCount}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                                <FiLayers className="text-lg text-success-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('projects.activeStages', 'Active Stages')}
                                </div>
                                <div className="text-lg font-bold text-third-900">
                                    {activeStagesCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-400">
                        <button
                            onClick={handleViewDetailsClick}
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                        >
                            {t('projects.viewDetails', 'View Details')}
                            <span className={isRTL ? 'rotate-180' : ''}>→</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onClick={handleClick}
            className="bg-neutral-50 rounded-2xl border border-neutral-400 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
        >
            <div className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                    <FiPackage className="text-3xl text-primary-600" />
                </div>

                <h3 className="text-xl font-bold text-third-900 mb-4 font-serif">
                    {project.name}
                </h3>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-2 text-third-500">
                            <FiLayers className="text-accent-600" />
                            <span className="text-sm">{t('projects.totalStages', 'Total Stages')}</span>
                        </div>
                        <span className="font-bold text-third-900">{stagesCount}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <div className="flex items-center gap-2 text-third-500">
                            <FiLayers className="text-success-600" />
                            <span className="text-sm">{t('projects.activeStages', 'Active Stages')}</span>
                        </div>
                        <span className="font-bold text-third-900">{activeStagesCount}</span>
                    </div>
                </div>

                <button
                    onClick={handleViewDetailsClick}
                    className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                    {t('projects.viewDetails', 'View Details')}
                </button>
            </div>
        </motion.div>
    );
};