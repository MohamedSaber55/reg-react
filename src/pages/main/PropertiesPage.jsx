import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProperties, setFilters, setPagination } from '@/store/slices/propertySlice';
import { fetchPropertyTypes } from '@/store/slices/propertyTypeSlice';
import { fetchTransactionTypes } from '@/store/slices/transactionTypeSlice';
import { fetchPropertyStatuses } from '@/store/slices/propertyStatusSlice';
import { fetchFinishingLevels } from '@/store/slices/finishingLevelSlice';
import { fetchFurnishingStatuses } from '@/store/slices/furnishingStatusSlice';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyCardSkeleton } from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import {
    FiFilter,
    FiX,
    FiGrid,
    FiList,
    FiSearch,
    FiMapPin,
    FiChevronDown,
    FiChevronUp,
    FiCheck,
    FiHome,
    FiLayers,
    FiShoppingCart,
    FiTag,
    FiArchive,
    FiSliders,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {
    useComprehensivePageTracking,
    useSearchTracking,
} from '@/hooks/useMetaPixelPageView';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

export default function PropertiesPage() {
    // ==================== HOOKS ====================
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';

    // ==================== REDUX SELECTORS ====================
    const { properties, loading, pagination } = useAppSelector((state) => state.property);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);
    const { transactionTypes } = useAppSelector((state) => state.transactionType);
    const { propertyStatuses } = useAppSelector((state) => state.propertyStatus);
    const { finishingLevels } = useAppSelector((state) => state.finishingLevel);
    const { furnishingStatuses } = useAppSelector((state) => state.furnishingStatus);

    // ==================== STATE ====================
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Initialize filters from URL or default
    const [localFilters, setLocalFilters] = useState({
        search: searchParams.get('search') || '',
        propertyTypeId: searchParams.get('propertyTypeId') ? parseInt(searchParams.get('propertyTypeId')) : null,
        transactionTypeId: searchParams.get('transactionTypeId') ? parseInt(searchParams.get('transactionTypeId')) : null,
        propertyStatusId: searchParams.get('propertyStatusId') ? parseInt(searchParams.get('propertyStatusId')) : null,
        finishingLevelId: searchParams.get('finishingLevelId') ? parseInt(searchParams.get('finishingLevelId')) : null,
        furnishingStatusId: searchParams.get('furnishingStatusId') ? parseInt(searchParams.get('furnishingStatusId')) : null,
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
        minArea: searchParams.get('minArea') ? parseFloat(searchParams.get('minArea')) : null,
        maxArea: searchParams.get('maxArea') ? parseFloat(searchParams.get('maxArea')) : null,
        isActive: true,
        // isAvailable: searchParams.get('isAvailable') ? searchParams.get('isAvailable') === 'true' : null,
        pageNumber: searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
        pageSize: 12
    });

    // ==================== TRACKING HOOKS ====================
    // Comprehensive page tracking: page view + scroll depth milestones + time on page
    useComprehensivePageTracking('Properties Page', {
        additionalParams: {
            initial_search: localFilters.search || null,
            initial_property_type: localFilters.propertyTypeId || null,
            initial_transaction_type: localFilters.transactionTypeId || null,
        }
    });

    // Search & filter tracking helpers
    const { trackSearch, trackFilter } = useSearchTracking();
    // =====================================================

    // ==================== EFFECTS ====================
    useEffect(() => {
        dispatch(fetchPropertyTypes({ pageSize: 100 }));
        dispatch(fetchTransactionTypes({ pageSize: 100 }));
        dispatch(fetchPropertyStatuses({ pageSize: 100 }));
        dispatch(fetchFinishingLevels({ pageSize: 100 }));
        dispatch(fetchFurnishingStatuses({ pageSize: 100 }));
    }, [dispatch]);

    useEffect(() => {
        applyFilters(false);
    }, []);

    // ==================== HELPER FUNCTIONS ====================
    const getLocalizedName = (item) => {
        return isRTL ? item.nameAr : item.nameEn;
    };

    const getActiveFiltersCount = () => {
        return Object.keys(localFilters).filter(key => {
            const value = localFilters[key];
            return (
                value !== null &&
                value !== '' &&
                value !== false &&
                !['pageNumber', 'pageSize', 'isActive'].includes(key)
            );
        }).length;
    };

    const updateURL = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key] !== null && newFilters[key] !== '' && key !== 'pageSize') {
                if (key === 'pageNumber') {
                    params.set('page', newFilters[key]);
                } else {
                    params.set(key, newFilters[key].toString());
                }
            }
        });
        const queryString = params.toString();
        navigate(`/properties${queryString ? `?${queryString}` : ''}`, { scroll: false });
    };

    // ==================== FILTER HANDLERS ====================
    const applyFilters = (updateUrl = true) => {
        const filtersWithPageReset = { ...localFilters, pageNumber: 1 };
        setLocalFilters(filtersWithPageReset);
        dispatch(setFilters(filtersWithPageReset));

        const apiParams = {
            ...filtersWithPageReset,
            // isAvailable: filtersWithPageReset.isAvailable !== null ? filtersWithPageReset.isAvailable : undefined,
        };
        dispatch(fetchProperties(apiParams));

        if (updateUrl) {
            updateURL(localFilters);

            // Track search query
            if (localFilters.search) {
                trackSearch(localFilters.search, {
                    property_type_id: localFilters.propertyTypeId || null,
                    transaction_type_id: localFilters.transactionTypeId || null,
                    min_price: localFilters.minPrice || null,
                    max_price: localFilters.maxPrice || null,
                    min_area: localFilters.minArea || null,
                    max_area: localFilters.maxArea || null,
                });
            }

            // Track all active filters on apply
            const filterMap = {
                propertyTypeId: 'property_type',
                transactionTypeId: 'transaction_type',
                propertyStatusId: 'property_status',
                finishingLevelId: 'finishing_level',
                furnishingStatusId: 'furnishing_status',
                minPrice: 'min_price',
                maxPrice: 'max_price',
                minArea: 'min_area',
                maxArea: 'max_area',
                // isAvailable: 'availability',
            };
            Object.entries(filterMap).forEach(([key, trackKey]) => {
                if (localFilters[key] !== null && localFilters[key] !== '') {
                    trackFilter(trackKey, localFilters[key]);
                }
            });
        }
    };

    const clearFilters = () => {
        const defaultFilters = {
            pageNumber: 1,
            pageSize: 12,
            search: '',
            propertyTypeId: null,
            transactionTypeId: null,
            propertyStatusId: null,
            finishingLevelId: null,
            furnishingStatusId: null,
            minPrice: null,
            maxPrice: null,
            minArea: null,
            maxArea: null,
            isActive: true,
            // isAvailable: null,
        };
        setLocalFilters(defaultFilters);
        dispatch(setFilters(defaultFilters));
        dispatch(fetchProperties({ ...defaultFilters, isActive: true }));
        navigate('/properties');

        // Track clear all filters action
        metaPixelEvents.buttonClick('Clear All Filters', 'properties_page', {
            filters_cleared: getActiveFiltersCount(),
        });
    };

    const handlePageChange = (newPage) => {
        const newFilters = { ...localFilters, pageNumber: newPage };
        setLocalFilters(newFilters);
        dispatch(setPagination({ pageNumber: newPage, pageSize: pagination.pageSize }));

        const apiParams = {
            ...newFilters,
            // isAvailable: newFilters.isAvailable !== null ? newFilters.isAvailable : undefined,
        };
        dispatch(fetchProperties(apiParams));
        updateURL(newFilters);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Track pagination
        metaPixelEvents.buttonClick('Pagination', 'properties_page', {
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
        metaPixelEvents.buttonClick('View Mode Toggle', 'properties_page', { view_mode: mode });
    };

    const handleAdvancedFiltersToggle = () => {
        const newState = !showAdvancedFilters;
        setShowAdvancedFilters(newState);
        metaPixelEvents.buttonClick(
            newState ? 'Expand Advanced Filters' : 'Collapse Advanced Filters',
            'properties_page'
        );
    };

    const handleBooleanFilterToggle = (filterName) => {
        setLocalFilters(prev => ({
            ...prev,
            [filterName]: prev[filterName] === null ? true :
                prev[filterName] === true ? false : null
        }));
    };

    // ==================== UI COMPONENTS ====================
    const renderBooleanFilter = (filterName, label, icon) => {
        const value = localFilters[filterName];
        return (
            <button
                type="button"
                onClick={() => handleBooleanFilterToggle(filterName)}
                className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
                    ${value === true
                        ? 'bg-primary-500 text-white border-primary-500'
                        : value === false
                            ? 'bg-error-100 text-error-700 border-error-200'
                            : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    }
                `}
            >
                {icon}
                <span>{label}</span>
                {value === true && <FiCheck className="w-4 h-4" />}
            </button>
        );
    };

    const renderFilterSelect = (label, value, options, onChange, icon, placeholder) => {
        return (
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-third-900 mb-2">
                    {icon}
                    <span>{label}</span>
                </label>
                <select
                    value={value || ''}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                >
                    <option value="">{placeholder}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {getLocalizedName(option)}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const renderRangeInput = (label, minField, maxField, minPlaceholder, maxPlaceholder, suffix = '') => {
        return (
            <div>
                <label className="block text-sm text-third-500 mb-2">{label}</label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder={minPlaceholder}
                            value={localFilters[minField] || ''}
                            onChange={(e) => setLocalFilters({
                                ...localFilters,
                                [minField]: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            className="w-full px-3 py-2 pl-8 rounded-lg bg-white border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        />
                        {suffix && <span className="absolute leinset-sft-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{suffix}</span>}
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder={maxPlaceholder}
                            value={localFilters[maxField] || ''}
                            onChange={(e) => setLocalFilters({
                                ...localFilters,
                                [maxField]: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            className="w-full px-3 py-2 pl-8 rounded-lg bg-white border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                        />
                        {suffix && <span className="absolute inset-s-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">{suffix}</span>}
                    </div>
                </div>
            </div>
        );
    };

    // ==================== FILTER PANEL (shared between desktop & mobile) ====================
    const FilterPanel = () => (
        <div className="space-y-4">
            {/* Search */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-third-900 mb-2">
                    <FiSearch />
                    {t('filters.search', 'Search')}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('filters.searchPlaceholder', 'Search properties...')}
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                        className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                    />
                    <FiSearch className="absolute inset-s-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                </div>
            </div>

            {/* Property Type */}
            {renderFilterSelect(
                t('filters.propertyType', 'Property Type'),
                localFilters.propertyTypeId,
                propertyTypes,
                (e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setLocalFilters({ ...localFilters, propertyTypeId: val });
                    trackFilter('property_type', val);
                },
                <FiHome className="w-4 h-4" />,
                t("filters.allTypes", "All Types")
            )}

            {/* Transaction Type */}
            {renderFilterSelect(
                t('filters.transactionType', 'Transaction Type'),
                localFilters.transactionTypeId,
                transactionTypes,
                (e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setLocalFilters({ ...localFilters, transactionTypeId: val });
                    trackFilter('transaction_type', val);
                },
                <FiShoppingCart className="w-4 h-4" />,
                t("filters.allTransactions", "All Transactions")
            )}

            {/* Property Status */}
            {renderFilterSelect(
                t('filters.propertyStatus', 'Property Status'),
                localFilters.propertyStatusId,
                propertyStatuses,
                (e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setLocalFilters({ ...localFilters, propertyStatusId: val });
                    trackFilter('property_status', val);
                },
                <FiTag className="w-4 h-4" />,
                t("filters.allStatuses", "All Statuses")
            )}

            {/* Finishing Level */}
            {renderFilterSelect(
                t('filters.finishingLevel', 'Finishing Level'),
                localFilters.finishingLevelId,
                finishingLevels,
                (e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setLocalFilters({ ...localFilters, finishingLevelId: val });
                    trackFilter('finishing_level', val);
                },
                <FiLayers className="w-4 h-4" />,
                t("filters.allFinishingLevels", "All Levels")
            )}

            {/* Furnishing Status */}
            {renderFilterSelect(
                t('filters.furnishingStatus', 'Furnishing Status'),
                localFilters.furnishingStatusId,
                furnishingStatuses,
                (e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null;
                    setLocalFilters({ ...localFilters, furnishingStatusId: val });
                    trackFilter('furnishing_status', val);
                },
                <FiArchive className="w-4 h-4" />,
                t("filters.allFurnishingStatuses", "All Statuses")
            )}

            {/* Advanced Filters toggle */}
            <div>
                <button
                    onClick={handleAdvancedFiltersToggle}
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-sm font-medium"
                >
                    <span>{t("filters.moreFilters", "More Filters")}</span>
                    {showAdvancedFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                    {showAdvancedFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 mt-3 overflow-hidden"
                        >
                            {/* Price Range */}
                            {renderRangeInput(
                                t('filters.priceRange', 'Price Range'),
                                'minPrice', 'maxPrice',
                                t('filters.min', 'Min'), t('filters.max', 'Max'), '$'
                            )}

                            {/* Area Range */}
                            {renderRangeInput(
                                t('filters.areaRange', 'Area Range (sqm)'),
                                'minArea', 'maxArea',
                                t('filters.min', 'Min'), t('filters.max', 'Max')
                            )}

                            {/* Availability */}
                            {/* <div>
                                <label className="flex items-center gap-2 text-sm text-third-500 mb-2">
                                    <FiCheck className="w-4 h-4" />
                                    {t('filters.availability', 'Availability')}
                                </label>
                                <select
                                    value={localFilters.isAvailable === null ? '' : localFilters.isAvailable.toString()}
                                    onChange={(e) => {
                                        const val = e.target.value === '' ? null : e.target.value === 'true';
                                        setLocalFilters({ ...localFilters, isAvailable: val });
                                        trackFilter('availability', val);
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm"
                                >
                                    <option value="">{t('filters.all', 'All')}</option>
                                    <option value="true">{t('filters.available', 'Available')}</option>
                                    <option value="false">{t('filters.notAvailable', 'Not Available')}</option>
                                </select>
                            </div> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Apply Button */}
            <button
                onClick={applyFilters}
                className="w-full hidden lg:block px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
                {t('filters.apply', 'Apply Filters')}
            </button>
        </div>
    );

    // ==================== DESKTOP FILTERS SIDEBAR ====================
    const DesktopFilters = () => {
        const activeFiltersCount = getActiveFiltersCount();
        return (
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="bg-white rounded-md shadow-l border border-primary-200  top-24 max-h-[calc(100vh-rem)] overflow-y-auto">
                    <div className="p-4 border-b border-neutral-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-third-900 flex items-center gap-2">
                                <FiSliders />
                                {t('filters.title', 'Filters')}
                            </h2>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    {t('filters.clear', 'Clear All')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="p-4">
                        <FilterPanel />
                    </div>
                </div>
            </aside>
        );
    };

    // ==================== MOBILE FILTERS SIDEBAR ====================
    const MobileFilters = () => {
        const activeFiltersCount = getActiveFiltersCount();
        return (
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
                            initial={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isRTL ? '100%' : '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 150 }}
                            className="fixed inset-y-0 inset-s-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-third-900 flex items-center gap-2">
                                        <FiSliders />
                                        {t('filters.title', 'Filters')}
                                        {activeFiltersCount > 0 && (
                                            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </h2>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-lg"
                                    >
                                        <FiX className="text-lg" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <FilterPanel />

                                    {/* Extra mobile action buttons */}
                                    <div className="pt-4 space-y-2 border-t border-neutral-200">
                                        <button
                                            onClick={() => {
                                                applyFilters();
                                                setShowMobileFilters(false);
                                            }}
                                            className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg"
                                        >
                                            {t('filters.apply', 'Apply Filters')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                clearFilters();
                                                setShowMobileFilters(false);
                                            }}
                                            className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-third-900 font-medium rounded-lg hover:bg-neutral-50"
                                        >
                                            {t('filters.clear', 'Clear All')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    };

    // ==================== ACTIVE FILTERS BAR ====================
    const ActiveFiltersBar = () => {
        const activeFiltersCount = getActiveFiltersCount();
        if (activeFiltersCount === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex items-center flex-wrap gap-2 p-3 bg-white rounded-lg border border-neutral-300">
                    <span className="text-sm text-third-500 font-medium">
                        {t("filters.activeFilters", "Active Filters:")}
                    </span>

                    {localFilters.search && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
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

                    {localFilters.propertyTypeId && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                            {getLocalizedName(propertyTypes.find(t => t.id === localFilters.propertyTypeId))}
                            <button
                                onClick={() => {
                                    setLocalFilters({ ...localFilters, propertyTypeId: null });
                                    trackFilter('property_type', null);
                                }}
                                className="ms-1 hover:text-primary-900"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {localFilters.minPrice && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                            ${localFilters.minPrice}+
                            <button
                                onClick={() => {
                                    setLocalFilters({ ...localFilters, minPrice: null });
                                    trackFilter('min_price', null);
                                }}
                                className="ms-1 hover:text-primary-900"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {localFilters.maxPrice && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                            &lt;${localFilters.maxPrice}
                            <button
                                onClick={() => {
                                    setLocalFilters({ ...localFilters, maxPrice: null });
                                    trackFilter('max_price', null);
                                }}
                                className="ms-1 hover:text-primary-900"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </span>
                    )}

                    {activeFiltersCount > 3 && (
                        <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-md text-xs">
                            +{activeFiltersCount - 3} more
                        </span>
                    )}

                    <button
                        onClick={clearFilters}
                        className="ms-auto text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                        {t('filters.clear', 'Clear All')}
                    </button>
                </div>
            </div>
        );
    };

    // ==================== RENDER ====================
    const activeFiltersCount = getActiveFiltersCount();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="relative bg-no-repeat bg-cover bg-bottom" style={{ backgroundImage: `url("/banner.jpeg")` }}>
                <div className="layer flex items-center justify-center w-full aspect-21/5 bg-linear-to-r from-primary-600/60 to-primary-800/60 py-16">
                    <div className="container px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                {t('properties.title', 'Find Your Dream Property')}
                            </h1>
                            <p className="text-base md:text-lg text-white/90 mb-6">
                                {t('properties.subtitle', 'Browse our curated collection of premium properties')}
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
                                        placeholder={t('filters.searchPlaceholder', 'Search properties...')}
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                        className="w-full px-5 py-3 pe-14 rounded-xl bg-white/95 text-third-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute inset-e-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                    >
                                        <FiSearch className="text-base" />
                                    </button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    {/* Desktop Filters */}
                    <DesktopFilters />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => {
                                    setShowMobileFilters(true);
                                    metaPixelEvents.buttonClick('Open Mobile Filters', 'properties_page');
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-neutral-300 text-third-900 font-medium shadow-sm"
                            >
                                <FiFilter className="w-4 h-4" />
                                {t('filters.title', 'Filters')}
                                {activeFiltersCount > 0 && (
                                    <span className="ms-2 px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Filters Modal */}
                        <MobileFilters />

                        {/* Header Bar */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-third-500">
                                <span className="font-medium text-third-900">
                                    {pagination.totalCount || 0}
                                </span> {t('properties.resultsFound', 'results found')}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-white rounded-md p-0.5 border border-neutral-300">
                                    <button
                                        onClick={() => handleViewModeChange('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-third-500 hover:bg-neutral-100'}`}
                                        title={t('view.grid', 'Grid View')}
                                    >
                                        <FiGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleViewModeChange('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-third-500 hover:bg-neutral-100'}`}
                                        title={t('view.list', 'List View')}
                                    >
                                        <FiList className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Bar */}
                        <ActiveFiltersBar />

                        {/* Properties Grid/List */}
                        {loading ? (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                                {[...Array(6)].map((_, i) => (
                                    <PropertyCardSkeleton key={i} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : properties.length > 0 ? (
                            <>
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
                                    {properties.map((property) => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            viewMode={viewMode}
                                            designOption={3}
                                        />
                                    ))}
                                </div>

                                {pagination.totalPages > 1 && (
                                    <div className="mt-6">
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
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto space-y-3">
                                    <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                                        <FiMapPin className="text-2xl text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-third-900">
                                        {t('properties.noResults', 'No properties found')}
                                    </h3>
                                    <p className="text-third-500 text-sm">
                                        {t('properties.tryDifferent', 'Try adjusting your filters or search terms')}
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