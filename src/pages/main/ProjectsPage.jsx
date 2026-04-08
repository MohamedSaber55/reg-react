import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProjects, setPagination } from '@/store/slices/projectSlice';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ProjectCardSkeleton } from '@/components/project/ProjectCardSkeleton';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import {
    FiFilter,
    FiX,
    FiGrid,
    FiList,
    FiSearch,
    FiPackage
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useComprehensivePageTracking,
    useSearchTracking
} from '@/hooks/useMetaPixelPageView';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

export default function ProjectsPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const { projects, loading, pagination } = useAppSelector((state) => state.project);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [localFilters, setLocalFilters] = useState({
        search: searchParams.get('search') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        pageNumber: searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
        pageSize: 12
    });

    // ─── Tracking hooks ───────────────────────────────────────────────────────
    // Comprehensive page tracking: page view + scroll depth + time on page
    useComprehensivePageTracking('Projects Page', {
        additionalParams: {
            initial_search: localFilters.search || null,
            initial_start_date: localFilters.startDate || null,
            initial_end_date: localFilters.endDate || null,
        }
    });

    // Search & filter tracking helpers
    const { trackSearch, trackFilter, trackSort } = useSearchTracking();
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        applyFilters(false);
    }, []);

    const updateURL = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] !== null && newFilters[key] !== '' && key !== 'pageSize') {
                if (key === 'pageNumber') {
                    params.set('page', newFilters[key]);
                } else {
                    params.set(key, newFilters[key]);
                }
            }
        });
        const queryString = params.toString();
        navigate(`/projects${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    const applyFilters = (updateUrl = true) => {
        const filtersWithPageReset = { ...localFilters, pageNumber: 1 };
        setLocalFilters(filtersWithPageReset);
        dispatch(fetchProjects(filtersWithPageReset));

        if (updateUrl) {
            updateURL(localFilters);

            // Track the search query if present
            if (localFilters.search) {
                trackSearch(localFilters.search, {
                    start_date: localFilters.startDate || null,
                    end_date: localFilters.endDate || null,
                });
            }

            // Track date filter changes
            if (localFilters.startDate) {
                trackFilter('startDate', localFilters.startDate);
            }
            if (localFilters.endDate) {
                trackFilter('endDate', localFilters.endDate);
            }
        }
    };

    const clearFilters = () => {
        const defaultFilters = {
            pageNumber: 1,
            pageSize: 12,
            search: '',
            startDate: '',
            endDate: ''
        };
        setLocalFilters(defaultFilters);
        dispatch(fetchProjects(defaultFilters));
        navigate('/projects');

        // Track clear filters action
        metaPixelEvents.buttonClick('Clear Filters', 'projects_page', {
            cleared_search: localFilters.search || null,
            cleared_start_date: localFilters.startDate || null,
            cleared_end_date: localFilters.endDate || null,
        });
    };

    const handlePageChange = (newPage) => {
        const newFilters = { ...localFilters, pageNumber: newPage };
        setLocalFilters(newFilters);
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));
        dispatch(fetchProjects(newFilters));
        updateURL(newFilters);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Track pagination navigation
        metaPixelEvents.buttonClick('Pagination', 'projects_page', {
            page_number: newPage,
            total_pages: pagination.totalPages,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);

        // Track view mode toggle
        metaPixelEvents.buttonClick('View Mode Toggle', 'projects_page', {
            view_mode: mode,
        });
    };

    const activeFiltersCount = [
        localFilters.search,
        localFilters.startDate,
        localFilters.endDate
    ].filter(f => f !== null && f !== '').length;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className="layer flex items-center justify-center w-full aspect-21/5 bg-linear-to-r from-primary-600/60 to-primary-800/60 py-20">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {t('projects.title', 'Our Real Estate Projects')}
                            </h1>
                            <p className="text-lg text-white/90 mb-8">
                                {t('projects.subtitle', 'Explore our premium development projects')}
                            </p>

                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onSubmit={handleSearch}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('filters.searchPlaceholder', 'Search projects...')}
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                        className="w-full px-6 py-4 pe-16 rounded-xl bg-white/95 text-third-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-e-2 top-1/2 -translate-y-1/2 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                    >
                                        <FiSearch className="text-lg" />
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex gap-6 lg:gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 xl:w-72 font-medium shrink-0">
                        <div className="px-4 py-3 sticky top-24 space-y-4 bg-neutral-50 rounded-lg border border-neutral-400 text-third-900">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-third-900">
                                    {t('filters.title', 'Filters')}
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        {t('filters.clear')}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-5">
                                {/* Date Range */}
                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('filters.startDate', 'Start Date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.startDate}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            startDate: e.target.value
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                        {t('filters.endDate', 'End Date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={localFilters.endDate}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            endDate: e.target.value
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    />
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={applyFilters}
                                    className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    {t('filters.apply')}
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => {
                                    setShowMobileFilters(true);
                                    metaPixelEvents.buttonClick('Open Mobile Filters', 'projects_page');
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-400 text-third-900 font-medium"
                            >
                                <FiFilter />
                                {t('filters.title', 'Filters')}
                                {activeFiltersCount > 0 && (
                                    <span className="ms-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Filters Modal */}
                        <AnimatePresence>
                            {showMobileFilters && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowMobileFilters(false)}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                        className="fixed inset-y-0 inset-s-0 w-80 bg-neutral-50 z-50 lg:hidden overflow-y-auto"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-xl font-semibold text-third-900">
                                                    {t('filters.title', 'Filters')}
                                                </h2>
                                                <button
                                                    onClick={() => setShowMobileFilters(false)}
                                                    className="p-2 hover:bg-neutral-50 rounded-lg"
                                                >
                                                    <FiX className="text-lg" />
                                                </button>
                                            </div>

                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                                        {t('filters.startDate', 'Start Date')}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={localFilters.startDate}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            startDate: e.target.value
                                                        })}
                                                        className="w-full border px-4 py-3 rounded-lg bg-neutral-50 border-neutral-400"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-third-900 mb-2">
                                                        {t('filters.endDate', 'End Date')}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={localFilters.endDate}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            endDate: e.target.value
                                                        })}
                                                        className="w-full border px-4 py-3 rounded-lg bg-neutral-50 border-neutral-400"
                                                    />
                                                </div>

                                                <div className="pt-4 space-y-3 border-t border-neutral-400">
                                                    <button
                                                        onClick={() => {
                                                            applyFilters();
                                                            setShowMobileFilters(false);
                                                        }}
                                                        className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg"
                                                    >
                                                        {t('filters.apply')}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            clearFilters();
                                                            setShowMobileFilters(false);
                                                        }}
                                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-400 text-third-900 font-medium rounded-lg"
                                                    >
                                                        {t('filters.clear')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Header Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-third-500">
                                <span className="font-medium text-third-900">
                                    {pagination.totalCount}
                                </span> {t('projects.resultsFound', 'projects found')}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-neutral-50 rounded-lg p-1 border border-neutral-400">
                                    <button
                                        onClick={() => handleViewModeChange('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-third-500'}`}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleViewModeChange('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-third-500'}`}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Bar */}
                        {activeFiltersCount > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center flex-wrap gap-2 p-4 bg-neutral-50 rounded-lg border border-neutral-400">
                                    <span className="text-sm text-third-500">{t("filters.activeFilters")}</span>
                                    {localFilters.search && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                            "{localFilters.search}"
                                            <button
                                                onClick={() => {
                                                    setLocalFilters({ ...localFilters, search: '' });
                                                    trackFilter('search', '');
                                                }}
                                                className="ms-1 hover:text-primary-900"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {localFilters.startDate && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                            From: {localFilters.startDate}
                                            <button
                                                onClick={() => {
                                                    setLocalFilters({ ...localFilters, startDate: '' });
                                                    trackFilter('startDate', '');
                                                }}
                                                className="ms-1 hover:text-primary-900"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={clearFilters}
                                        className="ms-auto text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        {t('filters.clear')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Projects Grid/List */}
                        {loading ? (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                {[...Array(6)].map((_, i) => (
                                    <ProjectCardSkeleton key={i} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : projects.length > 0 ? (
                            <>
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {projects.map((project) => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={pagination.pageNumber}
                                            totalPages={pagination.totalPages}
                                            totalCount={pagination.totalCount}
                                            pageSize={pagination.pageSize}
                                            hasPreviousPage={pagination.hasPreviousPage}
                                            hasNextPage={pagination.hasNextPage}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon={FiPackage}
                                title={t('projects.noResults', 'No Projects Found')}
                                description={t('projects.tryDifferent', 'Try adjusting your filters or search criteria')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}