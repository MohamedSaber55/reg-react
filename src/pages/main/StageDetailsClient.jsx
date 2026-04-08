import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useParams, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchStageById, clearCurrentStage } from '@/store/slices/stageSlice';
import { fetchUnitModelsByStage } from '@/store/slices/unitModelSlice';
import Loading from '@/components/layout/Loading';
import Pagination from '@/components/common/Pagination';
import {
    FiLayers,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiPackage,
    FiFilter,
    FiX,
    FiGrid,
    FiList,
    FiChevronDown,
    FiChevronUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/utils/priceUtils';


export default function StageDetailsClient({ projectId, stageId }) {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const resolvedProjectId = typeof id === 'string' && id !== 'placeholder'
        ? id
        : projectId;
    const resolvedStageId = typeof params?.stageId === 'string' && params.stageId !== 'placeholder'
        ? params.stageId
        : stageId;
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    const { currentStage, operationLoading } = useAppSelector((state) => state.stage);
    const { unitModels, loading: unitsLoading, pagination } = useAppSelector((state) => state.unitModel);

    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        search: '',
        minPrice: null,
        maxPrice: null,
        minArea: null,
        maxArea: null,
        minBedrooms: null,
        maxBedrooms: null,
        minBathrooms: null,
        maxBathrooms: null,
        pageNumber: 1,
        pageSize: 12
    });

    useEffect(() => {
        if (resolvedStageId && resolvedStageId !== 'placeholder') {
            dispatch(fetchStageById(resolvedStageId));
            dispatch(fetchUnitModelsByStage({ stageId: resolvedStageId, params: localFilters }));
        }

        return () => {
            dispatch(clearCurrentStage());
        };
    }, [dispatch, resolvedStageId]);

    const applyFilters = () => {
        const filtersWithPageReset = { ...localFilters, pageNumber: 1 };
        setLocalFilters(filtersWithPageReset);
        dispatch(fetchUnitModelsByStage({ stageId: resolvedStageId, params: filtersWithPageReset }));
    };

    const clearFilters = () => {
        const defaultFilters = {
            search: '',
            minPrice: null,
            maxPrice: null,
            minArea: null,
            maxArea: null,
            minBedrooms: null,
            maxBedrooms: null,
            minBathrooms: null,
            maxBathrooms: null,
            pageNumber: 1,
            pageSize: 12
        };
        setLocalFilters(defaultFilters);
        dispatch(fetchUnitModelsByStage({ stageId: resolvedStageId, params: defaultFilters }));
    };

    const handlePageChange = (newPage) => {
        const newFilters = { ...localFilters, pageNumber: newPage };
        setLocalFilters(newFilters);
        dispatch(fetchUnitModelsByStage({ stageId: resolvedStageId, params: newFilters }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleUnitClick = (unitId) => {
        navigate(`/projects/${resolvedProjectId}/stages/${resolvedStageId}/units/${unitId}`);
    };

    if (operationLoading || !currentStage) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const stage = currentStage;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const activeFiltersCount = [
        localFilters.search,
        localFilters.minPrice,
        localFilters.maxPrice,
        localFilters.minArea,
        localFilters.maxArea,
        localFilters.minBedrooms,
        localFilters.maxBedrooms,
        localFilters.minBathrooms,
        localFilters.maxBathrooms
    ].filter(f => f !== null && f !== '').length;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
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
                                    <FiLayers className="text-3xl text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
                                {stage.name}
                            </h1>
                            <p className="text-lg text-white/90 mb-2">
                                {stage.project?.name}
                            </p>
                            {stage.code && (
                                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full">
                                    {stage.code}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stage Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                                <FiCalendar className="text-2xl text-accent-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('stages.deliveryDate', 'Delivery Date')}
                                </div>
                                <div className="text-lg font-bold text-third-900">
                                    {formatDate(stage.deliveryDate)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stage.isActive ? 'bg-success-100' : 'bg-error-100'} rounded-xl flex items-center justify-center`}>
                                {stage.isActive ? (
                                    <FiCheckCircle className="text-2xl text-success-600" />
                                ) : (
                                    <FiXCircle className="text-2xl text-error-600" />
                                )}
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('stages.status', 'Status')}
                                </div>
                                <div className="text-lg font-bold text-third-900">
                                    {stage.isActive ? t('stages.active', 'Active') : t('stages.inactive', 'Inactive')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <FiPackage className="text-2xl text-primary-600" />
                            </div>
                            <div>
                                <div className="text-sm text-third-500">
                                    {t('stages.unitModels', 'Unit Models')}
                                </div>
                                <div className="text-lg font-bold text-third-900">
                                    {pagination.totalCount}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Description */}
                {stage.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-neutral-50 rounded-2xl p-6 border border-neutral-400 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-third-900 mb-4 font-serif">
                            {t('stages.description', 'Description')}
                        </h2>
                        <p className="text-third-500 leading-relaxed whitespace-pre-wrap">
                            {stage.description}
                        </p>
                    </motion.div>
                )}

                {/* Unit Models Section */}
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
                                {/* Search */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('filters.searchPlaceholder', 'Search...')}
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    />
                                </div>

                                {/* Advanced Filters */}
                                <div>
                                    <button
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-neutral-50 border border-neutral-400 text-sm font-medium mb-2"
                                    >
                                        <span>{t("filters.moreFilters")}</span>
                                        {showAdvancedFilters ? <FiChevronUp /> : <FiChevronDown />}
                                    </button>

                                    <AnimatePresence>
                                        {showAdvancedFilters && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                {/* Price Range */}
                                                <div>
                                                    <label className="block text-sm text-third-500 mb-2">
                                                        {t('filters.priceRange')}
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.min', 'Min')}
                                                            value={localFilters.minPrice || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minPrice: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.max', 'Max')}
                                                            value={localFilters.maxPrice || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Area Range */}
                                                <div>
                                                    <label className="block text-sm text-third-500 mb-2">
                                                        {t('filters.areaRange', 'Area Range (sqm)')}
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.min', 'Min')}
                                                            value={localFilters.minArea || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minArea: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.max', 'Max')}
                                                            value={localFilters.maxArea || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxArea: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Bedrooms Range */}
                                                <div>
                                                    <label className="block text-sm text-third-500 mb-2">
                                                        {t('filters.bedrooms', 'Bedrooms')}
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.min', 'Min')}
                                                            value={localFilters.minBedrooms || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minBedrooms: e.target.value ? parseInt(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.max', 'Max')}
                                                            value={localFilters.maxBedrooms || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxBedrooms: e.target.value ? parseInt(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Bathrooms Range */}
                                                <div>
                                                    <label className="block text-sm text-third-500 mb-2">
                                                        {t('filters.bathrooms', 'Bathrooms')}
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.min', 'Min')}
                                                            value={localFilters.minBathrooms || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minBathrooms: e.target.value ? parseInt(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder={t('filters.max', 'Max')}
                                                            value={localFilters.maxBathrooms || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxBathrooms: e.target.value ? parseInt(e.target.value) : null
                                                            })}
                                                            className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
                        {/* Header Bar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-third-500">
                                <span className="font-medium text-third-900">
                                    {pagination.totalCount}
                                </span> {t('units.resultsFound', 'unit models found')}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-neutral-50 rounded-lg p-1 border border-neutral-400">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-third-500'}`}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-third-500'}`}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Unit Models Grid */}
                        {unitsLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-neutral-50 rounded-2xl border border-neutral-400 p-6 animate-pulse">
                                        <div className="h-48 bg-neutral-200 rounded-xl mb-4"></div>
                                        <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                                        <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : unitModels.length > 0 ? (
                            <>
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {unitModels.map((unit) => (
                                        <UnitModelCard
                                            key={unit.id}
                                            unit={unit}
                                            onClick={() => handleUnitClick(unit.id)}
                                            viewMode={viewMode}
                                            t={t}
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
                            <div className="text-center py-16">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                                        <FiPackage className="text-3xl text-primary-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-third-900">
                                        {t('units.noResults')}
                                    </h3>
                                    <p className="text-third-500">
                                        {t('units.tryDifferent')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const UnitModelCard = ({ unit, onClick, viewMode, t }) => {
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

                {unit.description && (
                    <p className="text-sm text-third-500 mb-4 line-clamp-2">
                        {unit.description}
                    </p>
                )}

                <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
                    {t('units.viewDetails', 'View Details')}
                </button>
            </div>
        </motion.div>
    );
};