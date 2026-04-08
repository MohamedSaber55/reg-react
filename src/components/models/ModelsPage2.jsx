import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiLayers, FiHome, FiMaximize, FiDroplet, FiDollarSign, FiCalendar,
    FiCheckCircle, FiXCircle, FiChevronRight, FiChevronLeft, FiGrid,
    FiList, FiFilter, FiX, FiImage, FiInfo
} from 'react-icons/fi';
import { FaBed } from 'react-icons/fa';
import { Badge } from '@/components/common/Badge';

/* ============================================
   OPTION 3: SOFT ORGANIC CURVES
   ============================================
   Models page with flowing, inviting design
*/

export function ModelsPageOption3({
    stages,
    unitModels,
    selectedStage,
    handleStageSelect,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    clearFilters,
    filteredModels,
    activeFiltersCount,
    selectedModel,
    setSelectedModel,
    showModelDetails,
    setShowModelDetails,
    handleModelClick,
    isRTL,
    t
}) {
    return (
        <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50">
            {/* Animated Blob Shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -inset-s-1/4 w-200 h-200 bg-linear-to-br from-primary-300/30 to-primary-400/30     rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -inset-e-1/4 w-500 h-500 bg-linear-to-br from-accent-300/30 to-primary-300/30     rounded-full blur-3xl"
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-block px-6 py-3 bg-neutral-50/60  /60 backdrop-blur-sm rounded-full mb-8 border border-primary-300/50">
                            <span className="text-primary-700   font-semibold text-sm">
                                ✨ {t('models.exploreModels', 'Explore Our Models')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-primary-700 via-primary-600 to-primary-800       bg-clip-text text-transparent">
                            {t('models.title', 'Unit Models')}
                        </h1>

                        <p className="text-2xl text-neutral-800   max-w-2xl mx-auto">
                            {t('models.subtitle', 'Discover our carefully designed unit models')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stages Section */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-third-900   mb-6 font-serif">
                        {t('models.selectStage', 'Select Stage')}
                    </h2>

                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory">
                        <button
                            onClick={() => handleStageSelect(null)}
                            className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all snap-start ${selectedStage === null
                                ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-xl'
                                : 'bg-neutral-50/80  /80 backdrop-blur-sm text-third-900   border border-primary-300/50   hover:shadow-lg'
                                }`}
                        >
                            {t('models.allStages', 'All Stages')}
                        </button>

                        {stages
                            .filter(stage => stage.isActive)
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => handleStageSelect(stage.id)}
                                    className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all snap-start flex items-center gap-2 ${selectedStage === stage.id
                                        ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-xl'
                                        : 'bg-neutral-50/80  /80 backdrop-blur-sm text-third-900   border border-primary-300/50   hover:shadow-lg'
                                        }`}
                                >
                                    <FiLayers />
                                    {stage.name}
                                    <Badge variant="info" size="sm">
                                        {stage.unitModels?.length || 0}
                                    </Badge>
                                </button>
                            ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {/* Filters Sidebar - Desktop */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <div className="sticky top-24 space-y-6 bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl p-6 border border-primary-300/50   shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-third-900">
                                        {t('models.filters', 'Filters')}
                                    </h3>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-primary-600  hover:text-primary-700"
                                        >
                                            {t('models.clearAll', 'Clear all')}
                                        </button>
                                    )}
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-third-900   mb-2">
                                        {t('models.priceRange', 'Price Range')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Area Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-third-900   mb-2">
                                        {t('models.areaRange', 'Area Range (sqm)')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minArea || ''}
                                            onChange={(e) => setFilters({ ...filters, minArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxArea || ''}
                                            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Bedrooms Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-third-900   mb-2">
                                        {t('models.bedroomsRange', 'Bedrooms')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, maxBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-sm font-semibold text-third-900   mb-2">
                                        {t('models.availability', 'Availability')}
                                    </label>
                                    <select
                                        value={filters.availability}
                                        onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50/50  /50 border-2 border-primary-300/50   text-third-900   focus:border-primary-500 outline-none"
                                    >
                                        <option value="all">{t('models.allModels', 'All Models')}</option>
                                        <option value="available">{t('models.availableOnly', 'Available Only')}</option>
                                        <option value="unavailable">{t('models.unavailableOnly', 'Unavailable Only')}</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(true)}
                            className="lg:hidden fixed bottom-6 inset-e-6 z-40 w-14 h-14 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center"
                        >
                            <FiFilter className="text-xl" />
                            {activeFiltersCount > 0 && (
                                <div className="absolute -top-1 -inset-e-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-xs font-bold">
                                    {activeFiltersCount}
                                </div>
                            )}
                        </button>

                        {/* Mobile Filters Modal */}
                        <AnimatePresence>
                            {showFilters && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, x: isRTL ? 300 : -300 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: isRTL ? 300 : -300 }}
                                        className="lg:hidden fixed inset-y-0 inset-s-0 w-80 bg-neutral-50/95  /95 backdrop-blur-xl z-50 overflow-y-auto rounded-r-3xl"
                                    >
                                        <div className="p-6 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-third-900">
                                                    {t('models.filters', 'Filters')}
                                                </h3>
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="p-2 hover:bg-neutral-50/50   rounded-xl"
                                                >
                                                    <FiX className="text-xl" />
                                                </button>
                                            </div>

                                            {/* Same filter inputs as desktop */}
                                            <div>
                                                <label className="block text-sm font-semibold text-third-900   mb-2">
                                                    {t('models.priceRange', 'Price Range')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.min', 'Min')}
                                                        value={filters.minPrice || ''}
                                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.max', 'Max')}
                                                        value={filters.maxPrice || ''}
                                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-third-900   mb-2">
                                                    {t('models.areaRange', 'Area (sqm)')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.min', 'Min')}
                                                        value={filters.minArea || ''}
                                                        onChange={(e) => setFilters({ ...filters, minArea: e.target.value ? parseFloat(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.max', 'Max')}
                                                        value={filters.maxArea || ''}
                                                        onChange={(e) => setFilters({ ...filters, maxArea: e.target.value ? parseFloat(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-third-900   mb-2">
                                                    {t('models.bedroomsRange', 'Bedrooms')}
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.min', 'Min')}
                                                        value={filters.minBedrooms || ''}
                                                        onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder={t('models.max', 'Max')}
                                                        value={filters.maxBedrooms || ''}
                                                        onChange={(e) => setFilters({ ...filters, maxBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                                        className="px-3 py-2 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-third-900   mb-2">
                                                    {t('models.availability', 'Availability')}
                                                </label>
                                                <select
                                                    value={filters.availability}
                                                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-neutral-50/50 border-2 border-primary-300/50 text-third-900"
                                                >
                                                    <option value="all">{t('models.allModels', 'All')}</option>
                                                    <option value="available">{t('models.availableOnly', 'Available')}</option>
                                                    <option value="unavailable">{t('models.unavailableOnly', 'Unavailable')}</option>
                                                </select>
                                            </div>

                                            <div className="pt-4 space-y-3">
                                                <button
                                                    onClick={() => setShowFilters(false)}
                                                    className="w-full px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-xl"
                                                >
                                                    {t('models.applyFilters', 'Apply Filters')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        clearFilters();
                                                        setShowFilters(false);
                                                    }}
                                                    className="w-full px-6 py-3 bg-neutral-50/80 border-2 border-primary-300/50 text-third-900 font-semibold rounded-2xl"
                                                >
                                                    {t('models.clearAll', 'Clear All')}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Models Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-third-900">
                                    <span className="font-bold text-2xl">{filteredModels.length}</span>
                                    <span className="text-third-500   ms-2">
                                        {t('models.modelsFound', 'models found')}
                                    </span>
                                </div>

                                <div className="flex gap-2 bg-neutral-50/80  /80 backdrop-blur-sm p-1 rounded-2xl border border-primary-300/50">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid'
                                            ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                            : 'text-third-500   hover:text-third-900  '
                                            }`}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-xl transition-all ${viewMode === 'list'
                                            ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                            : 'text-third-500   hover:text-third-900  '
                                            }`}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {filteredModels.length > 0 ? (
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {filteredModels.map((model, index) => (
                                        <motion.div
                                            key={model.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleModelClick(model)}
                                            className="bg-neutral-50/80  /80 backdrop-blur-sm rounded-3xl overflow-hidden border border-primary-300/50   hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group"
                                        >
                                            <div className="relative aspect-4/3">
                                                {model.images?.[0]?.imageUrl ? (
                                                    <img
                                                        src={model.images[0].imageUrl}
                                                        alt={model.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary-100   flex items-center justify-center">
                                                        <FiHome className="w-16 h-16 text-primary-600" />
                                                    </div>
                                                )}

                                                <div className="absolute top-3 inset-s-3">
                                                    <Badge variant={model.isAvailable ? 'success' : 'secondary'} className="backdrop-blur-sm">
                                                        {model.isAvailable ? t('models.available', 'Available') : t('models.unavailable', 'Unavailable')}
                                                    </Badge>
                                                </div>

                                                {model.images?.length > 1 && (
                                                    <div className="absolute top-3 inset-e-3">
                                                        <Badge variant="dark" className="backdrop-blur-sm bg-black/50">
                                                            <FiImage className="w-3 h-3 me-1" />
                                                            {model.images.length}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-third-900   mb-2 font-serif group-hover:text-primary-600   transition-colors">
                                                    {model.name}
                                                </h3>
                                                <p className="text-sm text-third-500   mb-4">
                                                    {model.modelCode}
                                                </p>

                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-2 text-sm bg-primary-50   px-3 py-2 rounded-xl">
                                                        <FiMaximize className="text-primary-600" />
                                                        <span className="text-third-900   font-medium">
                                                            {model.area} sqm
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm bg-accent-50   px-3 py-2 rounded-xl">
                                                        <FaBed className="text-accent-600" />
                                                        <span className="text-third-900   font-medium">
                                                            {model.bedrooms} beds
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t-2 border-primary-100">
                                                    <div>
                                                        <p className="text-xs text-third-500   mb-1">
                                                            {t('models.startingPrice', 'Starting Price')}
                                                        </p>
                                                        <p className="text-xl font-bold bg-linear-to-r from-primary-700 to-primary-800     bg-clip-text text-transparent">
                                                            {model.startingPrice ? `${model.startingPrice.toLocaleString()}` : 'TBD'}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                        {isRTL ? <FiChevronLeft className="text-white text-xl" /> : <FiChevronRight className="text-white text-xl" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-neutral-50/60  /60 backdrop-blur-sm rounded-3xl border border-primary-300/50">
                                    <div className="w-20 h-20 mx-auto bg-primary-100   rounded-full flex items-center justify-center mb-4">
                                        <FiHome className="text-3xl text-primary-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-third-900   mb-2">
                                        {t('models.noModelsFound', 'No models found')}
                                    </h3>
                                    <p className="text-third-500   mb-6">
                                        {t('models.tryAdjustingFilters', 'Try adjusting your filters')}
                                    </p>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-2xl shadow-xl hover:scale-105 transition-transform"
                                        >
                                            {t('models.clearFilters', 'Clear Filters')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Model Details Modal */}
            <AnimatePresence>
                {showModelDetails && selectedModel && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModelDetails(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-8 lg:inset-16 bg-neutral-50/95  /95 backdrop-blur-xl rounded-3xl z-50 overflow-y-auto border border-primary-300/50"
                        >
                            <div className="sticky top-0 bg-neutral-50/95  /95 backdrop-blur-xl border-b border-primary-300/50   p-6 flex items-center justify-between z-10">
                                <h2 className="text-2xl font-bold text-third-900   font-serif">
                                    {selectedModel.name}
                                </h2>
                                <button
                                    onClick={() => setShowModelDetails(false)}
                                    className="p-2 hover:bg-neutral-50/50   rounded-2xl transition-colors"
                                >
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Images Gallery */}
                                {selectedModel.images && selectedModel.images.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-third-900   mb-4">
                                            {t('models.gallery', 'Gallery')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {selectedModel.images.map((image) => (
                                                <div key={image.id} className="relative aspect-4/3 rounded-3xl overflow-hidden border border-primary-300/50">
                                                    <img
                                                        src={image.imageUrl}
                                                        alt={selectedModel.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {image.isMain && (
                                                        <div className="absolute top-2 inset-s-2">
                                                            <Badge variant="warning">{t('models.mainImage', 'Main')}</Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-third-900">{t('models.details', 'Details')}</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: t('models.modelCode', 'Code'), value: selectedModel.modelCode },
                                                { label: t('models.area', 'Area'), value: `${selectedModel.area} sqm` },
                                                { label: t('models.bedrooms', 'Bedrooms'), value: selectedModel.bedrooms },
                                                { label: t('models.bathrooms', 'Bathrooms'), value: selectedModel.bathrooms },
                                                { label: t('models.stage', 'Stage'), value: selectedModel.stageName }
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between p-3 bg-neutral-50/50  /50 rounded-xl">
                                                    <span className="text-third-500">{item.label}</span>
                                                    <span className="font-semibold text-third-900">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-third-900">{t('models.pricing', 'Pricing')}</h3>
                                        <div className="p-6 bg-linear-to-br from-primary-50 to-accent-50     rounded-3xl border-2 border-primary-500">
                                            <p className="text-sm text-third-500   mb-2">
                                                {t('models.startingPrice', 'Starting Price')}
                                            </p>
                                            <p className="text-3xl font-bold bg-linear-to-r from-primary-700 to-primary-800     bg-clip-text text-transparent mb-4">
                                                {selectedModel.startingPrice ? `${selectedModel.startingPrice.toLocaleString()}` : t('models.priceOnRequest', 'TBD')}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {selectedModel.isAvailable ? (
                                                    <>
                                                        <FiCheckCircle className="text-success-600" />
                                                        <span className="text-success-600   font-semibold">
                                                            {t('models.available', 'Available')}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiXCircle className="text-error-600" />
                                                        <span className="text-error-600   font-semibold">
                                                            {t('models.unavailable', 'Unavailable')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {selectedModel.description && (
                                            <div className="p-4 bg-neutral-50/50  /50 rounded-2xl">
                                                <h4 className="font-semibold text-third-900   mb-2">
                                                    {t('models.description', 'Description')}
                                                </h4>
                                                <p className="text-third-500   leading-relaxed">
                                                    {selectedModel.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ============================================
   OPTION 4: MODERN GLASS MORPHISM
   ============================================
   Models page with premium glass effects
*/

export function ModelsPageOption4({
    stages,
    unitModels,
    selectedStage,
    handleStageSelect,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    clearFilters,
    filteredModels,
    activeFiltersCount,
    selectedModel,
    setSelectedModel,
    showModelDetails,
    setShowModelDetails,
    handleModelClick,
    isRTL,
    t
}) {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900" />

                <div className="absolute inset-0">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 inset-s-1/4 w-96 h-96 bg-linear-to-r from-accent-500/30 to-primary-500/30 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 inset-e-1/4 w-96 h-96 bg-linear-to-r from-primary-500/30 to-accent-500/30 rounded-full blur-[120px]"
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                            <span className="text-accent-200 font-semibold text-sm">
                                ⭐ {t('models.exploreModels', 'Explore Our Collection')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-serif bg-linear-to-br from-white via-primary-100 to-accent-100 bg-clip-text text-transparent">
                            {t('models.title', 'Unit Models')}
                        </h1>

                        <p className="text-2xl text-accent-200 max-w-2xl mx-auto">
                            {t('models.subtitle', 'Discover premium unit designs')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stages */}
            <section className="py-12 bg-linear-to-br from-secondary-950 via-accent-950 to-secondary-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-serif">
                        {t('models.selectStage', 'Select Stage')}
                    </h2>

                    <div className="flex overflow-x-auto pb-4 gap-4">
                        <button
                            onClick={() => handleStageSelect(null)}
                            className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${selectedStage === null
                                ? 'bg-linear-to-r from-primary-500 to-accent-500 text-white shadow-2xl'
                                : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15'
                                }`}
                        >
                            {t('models.allStages', 'All Stages')}
                        </button>

                        {stages
                            .filter(stage => stage.isActive)
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => handleStageSelect(stage.id)}
                                    className={`px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${selectedStage === stage.id
                                        ? 'bg-linear-to-r from-primary-500 to-accent-500 text-white shadow-2xl'
                                        : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15'
                                        }`}
                                >
                                    <FiLayers />
                                    {stage.name}
                                    <Badge variant="dark" size="sm">{stage.unitModels?.length || 0}</Badge>
                                </button>
                            ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-linear-to-br from-accent-950 via-secondary-950 to-accent-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Filters Sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <div className="sticky top-24 space-y-6 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">{t('models.filters', 'Filters')}</h3>
                                    {activeFiltersCount > 0 && (
                                        <button onClick={clearFilters} className="text-sm text-accent-300 hover:text-accent-200">
                                            {t('models.clearAll', 'Clear')}
                                        </button>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        {t('models.priceRange', 'Price Range')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                    </div>
                                </div>

                                {/* Area */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        {t('models.areaRange', 'Area (sqm)')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minArea || ''}
                                            onChange={(e) => setFilters({ ...filters, minArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxArea || ''}
                                            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        {t('models.bedroomsRange', 'Bedrooms')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, maxBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 rounded-xl bg-white/5 border-2 border-white/20 text-white placeholder-white/50"
                                        />
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        {t('models.availability', 'Availability')}
                                    </label>
                                    <select
                                        value={filters.availability}
                                        onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/20 text-white"
                                    >
                                        <option value="all" className="bg-secondary-900">{t('models.allModels', 'All')}</option>
                                        <option value="available" className="bg-secondary-900">{t('models.availableOnly', 'Available')}</option>
                                        <option value="unavailable" className="bg-secondary-900">{t('models.unavailableOnly', 'Unavailable')}</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Models Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-white">
                                    <span className="font-bold text-2xl">{filteredModels.length}</span>
                                    <span className="text-accent-300 ms-2">{t('models.modelsFound', 'models')}</span>
                                </div>

                                <div className="flex gap-2 bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-linear-to-r from-primary-500 to-accent-500 text-white' : 'text-accent-300'
                                            }`}
                                    >
                                        <FiGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-linear-to-r from-primary-500 to-accent-500 text-white' : 'text-accent-300'
                                            }`}
                                    >
                                        <FiList className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {filteredModels.length > 0 ? (
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {filteredModels.map((model) => (
                                        <motion.div
                                            key={model.id}
                                            onClick={() => handleModelClick(model)}
                                            className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all cursor-pointer group"
                                        >
                                            <div className="relative aspect-4/3">
                                                {model.images?.[0]?.imageUrl ? (
                                                    <img src={model.images[0].imageUrl} alt={model.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                        <FiHome className="w-16 h-16 text-white/30" />
                                                    </div>
                                                )}

                                                <div className="absolute top-3 inset-s-3">
                                                    <Badge variant={model.isAvailable ? 'success' : 'secondary'} className="backdrop-blur-sm">
                                                        {model.isAvailable ? t('models.available', 'Available') : t('models.unavailable', 'Unavailable')}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-accent-200 transition-colors">
                                                    {model.name}
                                                </h3>
                                                <p className="text-sm text-accent-300 mb-4">{model.modelCode}</p>

                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-2 text-sm bg-white/5 px-3 py-2 rounded-xl">
                                                        <FiMaximize className="text-accent-300" />
                                                        <span className="text-white">{model.area} sqm</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm bg-white/5 px-3 py-2 rounded-xl">
                                                        <FaBed className="text-accent-300" />
                                                        <span className="text-white">{model.bedrooms} beds</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div>
                                                        <p className="text-xs text-accent-300 mb-1">{t('models.startingPrice', 'Starting')}</p>
                                                        <p className="text-xl font-bold text-white">
                                                            {model.startingPrice?.toLocaleString() || 'TBD'}
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-linear-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        {isRTL ? <FiChevronLeft className="text-white text-xl" /> : <FiChevronRight className="text-white text-xl" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                                    <FiHome className="w-20 h-20 mx-auto text-white/30 mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-2">{t('models.noModelsFound', 'No models found')}</h3>
                                    <p className="text-accent-300 mb-6">{t('models.tryAdjustingFilters', 'Try adjusting filters')}</p>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-linear-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-2xl shadow-2xl"
                                        >
                                            {t('models.clearFilters', 'Clear Filters')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}