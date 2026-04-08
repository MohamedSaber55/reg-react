import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch,
    FiHome,
    FiDollarSign,
    FiMaximize,
    FiChevronDown,
    FiSliders,
    FiX,
} from 'react-icons/fi';

/* ============================================
   OPTION 1: MODERN CINEMATIC SEARCH
   ============================================
   Features:
   - Diagonal accent elements
   - Inline filter tabs with bronze highlights
   - Dark sophisticated background
   - Expandable advanced filters
   - Editorial spacing
*/

export function SearchOption1({
    localFilters,
    setLocalFilters,
    propertyTypes,
    transactionTypes,
    handleSearch,
    getLocalizedName,
    isRTL,
    t
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <section className="relative py-12 bg-secondary-900   overflow-hidden">
            {/* Diagonal Background Accent */}
            <div
                className="absolute top-0 inset-e-0 w-1/3 h-full opacity-5"
                style={{
                    background: `linear-gradient(${isRTL ? '225deg' : '135deg'}, transparent 40%, var(--color-primary-500) 40%)`,
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className={`flex items-center gap-3 mb-8 `}>
                        <div className="h-px w-12 bg-primary-500" />
                        <h2 className="text-2xl font-bold text-white">
                            {t('properties.searchTitle', 'Find Your Property')}
                        </h2>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Main Search Bar */}
                        <div className="bg-secondary-800 border-s-4 border-primary-500 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-5">
                                    <div className="relative">
                                        <FiSearch className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="text"
                                            placeholder={t('filters.searchPlaceholder', 'Search by location, name...')}
                                            value={localFilters.search}
                                            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                            className="w-full ps-12 pe-4 py-3 bg-secondary-900   border border-secondary-700 text-white placeholder-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.propertyTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            propertyTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-secondary-900   border border-secondary-700 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                    >
                                        <option value="">{t('filters.allTypes', 'All Types')}</option>
                                        {propertyTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transaction Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.transactionTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            transactionTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-secondary-900   border border-secondary-700 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                    >
                                        <option value="">{t('filters.buyRent', 'Buy/Rent')}</option>
                                        {transactionTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Button */}
                                <div className="md:col-span-1">
                                    <button
                                        type="submit"
                                        className="w-full h-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors"
                                    >
                                        <FiSearch className="mx-auto text-xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Advanced Filters Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="mt-4 flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                <FiSliders className="text-lg" />
                                <span className="text-sm font-medium">
                                    {showAdvanced ? t('filters.hideAdvanced', 'Hide') : t('filters.showAdvanced', 'More Filters')}
                                </span>
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-secondary-800 border-s-4 border-primary-500 p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Price Range */}
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-3">
                                                    <FiDollarSign className="inline me-2" />
                                                    {t('filters.priceRange', 'Price Range')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-secondary-900   border border-secondary-700 text-white placeholder-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-secondary-900   border border-secondary-700 text-white placeholder-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Area Range */}
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-3">
                                                    <FiMaximize className="inline me-2" />
                                                    {t('filters.areaRange', 'Area (sqft)')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-secondary-900   border border-secondary-700 text-white placeholder-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-secondary-900   border border-secondary-700 text-white placeholder-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST SEARCH
   ============================================
   Features:
   - Bold borders everywhere
   - Offset shadow effects
   - High contrast layout
   - Geometric precision
   - Stacked filter boxes
*/

export function SearchOption2({
    localFilters,
    setLocalFilters,
    propertyTypes,
    transactionTypes,
    handleSearch,
    getLocalizedName,
    isRTL,
    t
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <section className="py-12 bg-neutral-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-black text-third-900   uppercase tracking-tighter mb-8 font-serif">
                        {t('properties.searchTitle', 'Search Properties')}
                    </h2>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="space-y-6">
                        {/* Main Search Box */}
                        <div className="relative">
                            <div className="relative z-10 bg-neutral-50  border-4 border-neutral-900   p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Search Input */}
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            placeholder={t('filters.searchPlaceholder', 'Search...')}
                                            value={localFilters.search}
                                            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                            className="w-full px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   placeholder-third-500   font-bold uppercase text-sm focus:border-primary-600 outline-none"
                                        />
                                    </div>

                                    {/* Property Type */}
                                    <div>
                                        <select
                                            value={localFilters.propertyTypeId || ''}
                                            onChange={(e) => setLocalFilters({
                                                ...localFilters,
                                                propertyTypeId: e.target.value ? parseInt(e.target.value) : null
                                            })}
                                            className="w-full px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold uppercase text-sm focus:border-primary-600 outline-none"
                                        >
                                            <option value="">TYPE</option>
                                            {propertyTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {getLocalizedName(type)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Search Button */}
                                    <div>
                                        <button
                                            type="submit"
                                            className="relative w-full group"
                                        >
                                            <div className="relative z-10 px-4 py-3 bg-primary-600   text-white font-black uppercase text-sm border-4 border-neutral-900   flex items-center justify-center gap-2">
                                                <FiSearch />
                                                SEARCH
                                            </div>
                                            <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Transaction Type */}
                                <div className="mt-4">
                                    <select
                                        value={localFilters.transactionTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            transactionTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full md:w-auto px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold uppercase text-sm focus:border-primary-600 outline-none"
                                    >
                                        <option value="">BUY / RENT</option>
                                        {transactionTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Offset Shadow */}
                            <div className="absolute inset-0 border-4 border-neutral-900   translate-x-3 translate-y-3" />
                        </div>

                        {/* Advanced Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="relative group"
                        >
                            <div className="relative z-10 px-6 py-3 bg-neutral-900   text-neutral-50  font-bold uppercase text-sm border-4 border-neutral-900   flex items-center gap-2">
                                <FiSliders />
                                {showAdvanced ? 'HIDE FILTERS' : 'MORE FILTERS'}
                            </div>
                            <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                        </button>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <div className="relative z-10 bg-neutral-50  border-4 border-neutral-900   p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Price */}
                                                <div>
                                                    <label className="block text-sm font-black text-third-900   mb-3 uppercase">
                                                        Price Range
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input
                                                            type="number"
                                                            placeholder="MIN"
                                                            value={localFilters.minPrice || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minPrice: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="MAX"
                                                            value={localFilters.maxPrice || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Area */}
                                                <div>
                                                    <label className="block text-sm font-black text-third-900   mb-3 uppercase">
                                                        Area (sqft)
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input
                                                            type="number"
                                                            placeholder="MIN"
                                                            value={localFilters.minArea || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                minArea: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="MAX"
                                                            value={localFilters.maxArea || ''}
                                                            onChange={(e) => setLocalFilters({
                                                                ...localFilters,
                                                                maxArea: e.target.value ? parseFloat(e.target.value) : null
                                                            })}
                                                            className="px-4 py-3 bg-neutral-50  border-4 border-neutral-900   text-third-900   font-bold text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 border-4 border-neutral-900   translate-x-3 translate-y-3" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC SEARCH
   ============================================
   Features:
   - Rounded corners everywhere
   - Glass morphism effects
   - Soft bronze gradients
   - Warm, inviting layout
   - Floating elements
*/

export function SearchOption3({
    localFilters,
    setLocalFilters,
    propertyTypes,
    transactionTypes,
    handleSearch,
    getLocalizedName,
    t
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <section className="py-12 bg-linear-to-b from-primary-50 to-neutral-50 relative overflow-hidden">
            {/* Decorative Blob */}
            <div className="absolute top-0 inset-e-0 w-96 h-96 bg-linear-to-br from-primary-200/30 to-accent-200/30     rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Title Badge */}
                    <div className="text-center mb-8">
                        <div className="inline-block px-6 py-3 bg-neutral-50/60  /60 backdrop-blur-sm rounded-full border border-primary-300/50">
                            <span className="text-primary-700   font-semibold text-sm">
                                {t('properties.searchTitle', 'Find Your Dream Home')}
                            </span>
                        </div>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        {/* Main Search Card */}
                        <div className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-primary-200/50   shadow-xl shadow-primary-500/10   mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-4">
                                    <div className="relative">
                                        <FiSearch className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                                        <input
                                            type="text"
                                            placeholder={t('filters.searchPlaceholder', 'Search location...')}
                                            value={localFilters.search}
                                            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                            className="w-full ps-12 pe-4 py-3 bg-neutral-50  rounded-2xl border border-primary-200/50   text-third-900   placeholder-third-500   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.propertyTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            propertyTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-neutral-50  rounded-2xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                    >
                                        <option value="">{t('filters.propertyType', 'Property Type')}</option>
                                        {propertyTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transaction Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.transactionTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            transactionTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-neutral-50  rounded-2xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                    >
                                        <option value="">{t('filters.buyRent', 'Buy or Rent')}</option>
                                        {transactionTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Button */}
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full h-full px-6 py-3 bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800         text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <FiSearch />
                                        <span className="hidden md:inline">{t('filters.search', 'Search')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Advanced Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="mt-4 flex items-center gap-2 text-primary-700  hover:text-primary-800   transition-colors"
                            >
                                <FiSliders className="text-lg" />
                                <span className="text-sm font-medium">
                                    {showAdvanced ? t('filters.hideAdvanced', 'Hide') : t('filters.showAdvanced', 'More Options')}
                                </span>
                                <FiChevronDown className={`text-sm transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-primary-200/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Price Range */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700   mb-3">
                                                    <FiDollarSign />
                                                    {t('filters.priceRange', 'Price Range')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-neutral-50  rounded-xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-neutral-50  rounded-xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Area Range */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700   mb-3">
                                                    <FiMaximize />
                                                    {t('filters.areaRange', 'Area (sqft)')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-neutral-50  rounded-xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-neutral-50  rounded-xl border border-primary-200/50   text-third-900   focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM SEARCH
   ============================================
   Features:
   - Dark navy background
   - Frosted glass search card
   - Gradient orbs
   - Professional depth
   - Modern tech aesthetic
*/

export function SearchOption4({
    localFilters,
    setLocalFilters,
    propertyTypes,
    transactionTypes,
    handleSearch,
    getLocalizedName,
    isRTL,
    t
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <section className="py-16 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900       relative overflow-hidden">
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-accent-500/20 to-primary-500/20     rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-primary-500/20 to-accent-500/20     rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Title Badge */}
                    <div className="text-center mb-8">
                        <div className="inline-block px-6 py-3 bg-white/10  backdrop-blur-md border border-white/20   rounded-full">
                            <span className="text-accent-200   font-semibold text-sm">
                                {t('properties.searchTitle', 'Search Premium Properties')}
                            </span>
                        </div>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        {/* Main Search Card */}
                        <div className="bg-white/10  backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20   shadow-2xl mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-4">
                                    <div className="relative">
                                        <FiSearch className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-accent-300" />
                                        <input
                                            type="text"
                                            placeholder={t('filters.searchPlaceholder', 'Search...')}
                                            value={localFilters.search}
                                            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                                            className="w-full ps-12 pe-4 py-3 bg-white/10  backdrop-blur-md rounded-2xl border border-white/20   text-white placeholder-accent-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Property Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.propertyTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            propertyTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-white/10  backdrop-blur-md rounded-2xl border border-white/20   text-white focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-colors"
                                    >
                                        <option value="" className="bg-secondary-900">{t('filters.propertyType', 'Type')}</option>
                                        {propertyTypes.map(type => (
                                            <option key={type.id} value={type.id} className="bg-secondary-900">
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Transaction Type */}
                                <div className="md:col-span-3">
                                    <select
                                        value={localFilters.transactionTypeId || ''}
                                        onChange={(e) => setLocalFilters({
                                            ...localFilters,
                                            transactionTypeId: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="w-full px-4 py-3 bg-white/10  backdrop-blur-md rounded-2xl border border-white/20   text-white focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-colors"
                                    >
                                        <option value="" className="bg-secondary-900">{t('filters.buyRent', 'Buy/Rent')}</option>
                                        {transactionTypes.map(type => (
                                            <option key={type.id} value={type.id} className="bg-secondary-900">
                                                {getLocalizedName(type)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Button */}
                                <div className="md:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full h-full px-6 py-3 bg-linear-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700         text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <FiSearch />
                                        <span className="hidden md:inline">{t('filters.search', 'Search')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Advanced Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="mt-4 flex items-center gap-2 text-primary-300  hover:text-primary-200   transition-colors"
                            >
                                <FiSliders className="text-lg" />
                                <span className="text-sm font-medium">
                                    {showAdvanced ? t('filters.hideAdvanced', 'Hide') : t('filters.showAdvanced', 'Advanced Filters')}
                                </span>
                                <FiChevronDown className={`text-sm transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white/10  backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Price Range */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-accent-200   mb-3">
                                                    <FiDollarSign />
                                                    {t('filters.priceRange', 'Price Range')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-white/10  backdrop-blur-md rounded-xl border border-white/20   text-white placeholder-accent-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxPrice || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxPrice: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-white/10  backdrop-blur-md rounded-xl border border-white/20   text-white placeholder-accent-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Area Range */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-accent-200   mb-3">
                                                    <FiMaximize />
                                                    {t('filters.areaRange', 'Area (sqft)')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.min', 'Min')}
                                                        value={localFilters.minArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            minArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-white/10  backdrop-blur-md rounded-xl border border-white/20   text-white placeholder-accent-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('filters.max', 'Max')}
                                                        value={localFilters.maxArea || ''}
                                                        onChange={(e) => setLocalFilters({
                                                            ...localFilters,
                                                            maxArea: e.target.value ? parseFloat(e.target.value) : null
                                                        })}
                                                        className="px-4 py-3 bg-white/10  backdrop-blur-md rounded-xl border border-white/20   text-white placeholder-accent-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}