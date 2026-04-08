// app/components/FeaturedProjects.jsx
import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
// next/image removed;
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProjects } from '@/store/slices/projectSlice';
import { FaBuilding, FaCalendar, FaArrowRight } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function FeaturedProjects() {
    const dispatch = useAppDispatch();
    const { projects, loading } = useAppSelector((state) => state.project);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language == "ar";
    console.log(isRtl);
    
    useEffect(() => {
        dispatch(fetchProjects({ PageNumber: 1, PageSize: 6 }));
    }, [dispatch]);

    const getProjectStats = (project) => {
        const totalStages = project.stages?.length || 0;
        const totalUnits = project.stages?.reduce((total, stage) => {
            return total + (stage.unitModels?.length || 0);
        }, 0) || 0;

        return { totalStages, totalUnits };
    };

    if (loading) {
        return (
            <div className="py-16">
                <div className="text-center">Loading projects...</div>
            </div>
        );
    }

    if (!projects.length) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-third-900 mb-4">
                        {t("projects.featuredProjects.title", "Our Featured Projects")}
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        {t("projects.featuredProjects.description", "Discover our premium real estate developments with world-class amenities and strategic locations")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const stats = getProjectStats(project);
                        return (
                            <div key={project.id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                {/* Project Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {project.stages?.[0]?.unitModels?.[0]?.images?.[0]?.imageUrl ? (
                                        <img src={project.stages[0].unitModels[0].images[0].imageUrl}
                                            alt={project.name} className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                            <FaBuilding className="w-16 h-16 text-primary-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                                    {/* Badges */}
                                    <div className="absolute top-4 inset-e-4 flex gap-2">
                                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                                            {stats.totalStages} {t("projects.featuredProjects.phases", "Phases")}
                                        </div>
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-third-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {project.name}
                                    </h3>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            <FaHome className="w-4 h-4" />
                                            <span>{stats.totalUnits} {t("projects.featuredProjects.units", "Units")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-600">
                                            <FaCalendar className="w-4 h-4" />
                                            <span>{project.stages?.length || 0} {t("projects.featuredProjects.phases", "Phases")}</span>
                                        </div>
                                    </div>

                                    {/* Active Stages */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                                            {t("projects.featuredProjects.currentPhases", "Current Phases")}:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.stages?.slice(0, 3).map((stage) => (
                                                <div
                                                    key={stage.id}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${stage.isActive
                                                        ? 'bg-success-100 text-success-800'
                                                        : 'bg-neutral-100 text-neutral-800'
                                                        }`}
                                                >
                                                    {stage.name}
                                                </div>
                                            ))}
                                            {project.stages?.length > 3 && (
                                                <div className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                    +{project.stages.length - 3} {t("projects.featuredProjects.more", "more")}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group/btn"
                                    >
                                        {t("projects.featuredProjects.viewDetails", "View Details")}
                                        <FaArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform  ${isRtl ? "rotate-y-180 " : ""}`} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        {t("projects.featuredProjects.viewAllProjects", "View All Projects")}
                        <FaArrowRight className={`w-5 h-5 ${isRtl ? "rotate-y-180 " : ""}`} />
                    </Link>
                </div>
            </div>
        </section>
    );
}