import React from 'react';
import { TrackedLink } from '@/components/tracking';
import { FiCalendar, FiHome, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * NOTE: ProjectDetailsClient currently renders its own local StageCard, so this
 * component is not mounted anywhere today. It is kept working rather than
 * deleted because it is the general-purpose version.
 *
 * The units link needs a project id: the route is
 * /projects/:id/stages/:stageId, not /projects/stages/:stageId.
 */
export function StageCard({ stage, projectId, projectName }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'TBA';
        }
    };

    const unitModelsCount = stage.unitModels?.length || 0;

    // Prefer the explicit prop, fall back to the id carried on the stage itself.
    const resolvedProjectId = projectId ?? stage.projectId;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-neutral-50 rounded-2xl border border-neutral-400 p-6 hover:shadow-lg transition-all"
        >
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-third-900">
                        {stage.name}
                    </h3>
                    {stage.code && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                            {stage.code}
                        </span>
                    )}
                </div>

                {projectName && (
                    <p className="text-third-500 text-sm mb-4">
                        Project: <span className="font-medium text-third-900">{projectName}</span>
                    </p>
                )}
            </div>

            {/* Stage Details */}
            <div className="space-y-3 mb-6">
                {stage.deliveryDate && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-third-500">Delivery Date</span>
                        <span className="font-semibold text-third-900">
                            {formatDate(stage.deliveryDate)}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-third-500">Available Units</span>
                    <span className="font-semibold text-third-900">
                        {unitModelsCount}
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <span className="text-third-500">Status</span>
                    <span className={`font-semibold ${stage.isActive ? 'text-success-600' : 'text-error-600'}`}>
                        {stage.isActive ? 'Active' : 'Completed'}
                    </span>
                </div>
            </div>

            {/* View Units Button — omitted without a project id rather than
                rendering a link that would 404. */}
            {unitModelsCount > 0 && resolvedProjectId && (
                <TrackedLink
                    href={`/projects/${resolvedProjectId}/stages/${stage.id}`}
                    trackName="View Units"
                    trackEvent="cta"
                    trackLocation="stage_card"
                    additionalParams={{
                        project_id: resolvedProjectId,
                        stage_id: stage.id,
                        stage_name: stage.name,
                        unit_count: unitModelsCount,
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
                >
                    View {unitModelsCount} Units
                    <FiChevronRight className="text-lg" />
                </TrackedLink>
            )}
        </motion.div>
    );
}