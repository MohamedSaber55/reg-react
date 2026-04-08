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
   OPTION 1: MODERN CINEMATIC SPLIT
   ============================================
   Models page with editorial aesthetic
*/

export function ModelsPageOption1({
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
        <div className="min-h-screen bg-secondary-950">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-secondary-950 via-secondary-900 to-secondary-950" />
                <div className="absolute inset-0 bg-[url('/banner.jpeg')] bg-cover bg-center opacity-10" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl"
                    >
                        <div className={`mb-6 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="h-px w-12 bg-primary-500" />
                            <span className="text-primary-500 text-sm tracking-[0.2em] uppercase font-medium">
                                {t('models.exploreModels', 'Explore Models')}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif">
                            {t('models.title', 'Unit Models')}
                        </h1>

                        <p className="text-xl text-neutral-300 max-w-2xl">
                            {t('models.subtitle', 'Discover our carefully designed unit models')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stages Section */}
            <section className="bg-white   py-12 border-b-4 border-secondary-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-third-900   mb-6 font-serif">
                        {t('models.selectStage', 'Select Stage')}
                    </h2>

                    <div className="flex overflow-x-auto pb-4 gap-4">
                        <button
                            onClick={() => handleStageSelect(null)}
                            className={`px-6 py-3 font-medium whitespace-nowrap transition-all ${selectedStage === null
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-900   text-white border-2 border-secondary-800'
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
                                    className={`px-6 py-3 font-medium whitespace-nowrap transition-all flex items-center gap-2 ${selectedStage === stage.id
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-secondary-900   text-white border-2 border-secondary-800 hover:border-primary-500'
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
            <section className="bg-white   py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        {/* Filters Sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <div className="sticky top-24 bg-secondary-900   p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white">{t('models.filters', 'Filters')}</h3>
                                    {activeFiltersCount > 0 && (
                                        <button onClick={clearFilters} className="text-sm text-primary-500">
                                            {t('models.clearAll', 'Clear')}
                                        </button>
                                    )}
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold uppercase text-white mb-2">
                                        {t('models.priceRange', 'Price Range')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Area Range */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold uppercase text-white mb-2">
                                        {t('models.areaRange', 'Area (sqm)')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minArea || ''}
                                            onChange={(e) => setFilters({ ...filters, minArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxArea || ''}
                                            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold uppercase text-white mb-2">
                                        {t('models.bedroomsRange', 'Bedrooms')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder={t('models.min', 'Min')}
                                            value={filters.minBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder={t('models.max', 'Max')}
                                            value={filters.maxBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, maxBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 bg-secondary-950 border-2 border-secondary-800 text-white"
                                        />
                                    </div>
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-sm font-bold uppercase text-white mb-2">
                                        {t('models.availability', 'Availability')}
                                    </label>
                                    <select
                                        value={filters.availability}
                                        onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary-950 border-2 border-secondary-800 text-white"
                                    >
                                        <option value="all">{t('models.allModels', 'All Models')}</option>
                                        <option value="available">{t('models.availableOnly', 'Available')}</option>
                                        <option value="unavailable">{t('models.unavailableOnly', 'Unavailable')}</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Models Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-white">
                                    <span className="font-bold">{filteredModels.length}</span> {t('models.modelsFound', 'models')}
                                </div>

                                <div className="flex gap-2 bg-secondary-950 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-400'}`}
                                    >
                                        <FiGrid />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-400'}`}
                                    >
                                        <FiList />
                                    </button>
                                </div>
                            </div>

                            {filteredModels.length > 0 ? (
                                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                    {filteredModels.map((model) => (
                                        <motion.div
                                            key={model.id}
                                            onClick={() => handleModelClick(model)}
                                            className="bg-neutral-50   border-t-4 border-primary-500 cursor-pointer hover:shadow-2xl transition-all group"
                                        >
                                            <div className="relative aspect-4/3">
                                                {model.images?.[0]?.imageUrl ? (
                                                    <img
                                                        src={model.images[0].imageUrl}
                                                        alt={model.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary-800 flex items-center justify-center">
                                                        <FiHome className="w-16 h-16 text-neutral-600" />
                                                    </div>
                                                )}

                                                <div className="absolute top-3 inset-s-3">
                                                    <Badge variant={model.isAvailable ? 'success' : 'secondary'}>
                                                        {model.isAvailable ? t('models.available', 'Available') : t('models.unavailable', 'Unavailable')}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-third-900   mb-2 font-serif group-hover:text-primary-500">
                                                    {model.name}
                                                </h3>
                                                <p className="text-sm text-third-500   mb-4">
                                                    {model.modelCode}
                                                </p>

                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <FiMaximize className="text-primary-500" />
                                                        <span>{model.area} sqm</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaBed className="text-primary-500" />
                                                        <span>{model.bedrooms} beds</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-400">
                                                    <div>
                                                        <p className="text-xs text-third-500 uppercase">{t('models.startingPrice', 'Starting')}</p>
                                                        <p className="text-xl font-bold text-primary-500">
                                                            {model.startingPrice?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 bg-primary-500 flex items-center justify-center group-hover:bg-primary-600">
                                                        {isRTL ? <FiChevronLeft className="text-white" /> : <FiChevronRight className="text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <FiHome className="w-20 h-20 mx-auto text-neutral-600 mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-2">{t('models.noModelsFound', 'No models found')}</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST
   ============================================
   Models page with stark brutalist design
*/

export function ModelsPageOption2({
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
        <div className="min-h-screen bg-neutral-50">
            {/* Grid Background */}
            <div
                className="fixed inset-0 opacity-[0.03]   pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Hero */}
            <section className="relative py-20 border-b-4 border-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="inline-block mb-8 px-8 py-4 bg-neutral-900   text-neutral-50  relative">
                        <span className="relative z-10 text-lg font-bold uppercase tracking-wider">
                            {t('models.exploreModels', 'Explore')}
                        </span>
                        <div className="absolute inset-0 border-4 border-neutral-900   translate-x-2 translate-y-2" />
                    </div>

                    <h1 className="text-[clamp(3rem,12vw,10rem)] font-black text-third-900   leading-[0.85] tracking-tighter font-serif">
                        {t('models.title', 'Models')}
                    </h1>
                </div>
            </section>

            {/* Stages */}
            <section className="py-12 border-b-4 border-neutral-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-0">
                        <button
                            onClick={() => handleStageSelect(null)}
                            className={`px-8 py-4 border-4 border-neutral-900   font-black uppercase whitespace-nowrap ${selectedStage === null ? 'bg-neutral-900 text-neutral-50    ' : 'hover:bg-neutral-900 hover:text-neutral-50'
                                }`}
                        >
                            {t('models.allStages', 'All')}
                        </button>

                        {stages
                            .filter(stage => stage.isActive)
                            .map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => handleStageSelect(stage.id)}
                                    className={`px-8 py-4 border-4 border-neutral-900 border-s-0 font-black uppercase whitespace-nowrap ${selectedStage === stage.id ? 'bg-neutral-900 text-neutral-50    ' : 'hover:bg-neutral-900 hover:text-neutral-50'
                                        }`}
                                >
                                    {stage.name}
                                </button>
                            ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Filters */}
                        <div className="lg:col-span-3 border-e-4 border-neutral-900   p-8">
                            <h3 className="text-2xl font-black uppercase mb-8">{t('models.filters', 'Filters')}</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">
                                        {t('models.priceRange', 'Price')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="MIN"
                                            value={filters.minPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                        <input
                                            type="number"
                                            placeholder="MAX"
                                            value={filters.maxPrice || ''}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">
                                        {t('models.areaRange', 'Area')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="MIN"
                                            value={filters.minArea || ''}
                                            onChange={(e) => setFilters({ ...filters, minArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                        <input
                                            type="number"
                                            placeholder="MAX"
                                            value={filters.maxArea || ''}
                                            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value ? parseFloat(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black uppercase mb-2">
                                        {t('models.bedroomsRange', 'Bedrooms')}
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="MIN"
                                            value={filters.minBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                        <input
                                            type="number"
                                            placeholder="MAX"
                                            value={filters.maxBedrooms || ''}
                                            onChange={(e) => setFilters({ ...filters, maxBedrooms: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-3 border-4 border-neutral-900   bg-neutral-50  font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Models Grid */}
                        <div className="lg:col-span-9 p-8">
                            <div className="mb-8 flex justify-between items-center">
                                <h2 className="text-4xl font-black uppercase">{filteredModels.length} {t('models.modelsFound', 'Models')}</h2>

                                <div className="flex gap-0">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`w-12 h-12 border-4 border-neutral-900   ${viewMode === 'grid' ? 'bg-neutral-900 text-neutral-50' : ''}`}
                                    >
                                        <FiGrid className="mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`w-12 h-12 border-4 border-neutral-900 border-s-0 ${viewMode === 'list' ? 'bg-neutral-900 text-neutral-50' : ''}`}
                                    >
                                        <FiList className="mx-auto" />
                                    </button>
                                </div>
                            </div>

                            {filteredModels.length > 0 ? (
                                <div className="space-y-0">
                                    {filteredModels.map((model, index) => (
                                        <div
                                            key={model.id}
                                            onClick={() => handleModelClick(model)}
                                            className="border-t-4 border-neutral-900   p-8 hover:bg-neutral-900 hover:text-neutral-50     transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-6">
                                                <div className="text-6xl font-black opacity-20">{String(index + 1).padStart(2, '0')}</div>
                                                <div className="flex-1">
                                                    <h3 className="text-3xl font-black uppercase mb-2">{model.name}</h3>
                                                    <div className="flex gap-6 text-sm font-bold">
                                                        <span>{model.area} SQM</span>
                                                        <span>{model.bedrooms} BEDS</span>
                                                        <span>{model.bathrooms} BATHS</span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="text-3xl font-black">{model.startingPrice?.toLocaleString()}</div>
                                                    <div className="text-sm font-bold uppercase">{t('models.currency', 'EGP')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-8xl font-black opacity-10 mb-4">404</div>
                                    <h3 className="text-3xl font-black uppercase">{t('models.noModelsFound', 'No Models')}</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}