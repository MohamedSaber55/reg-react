// app/(dashboard)/dashboard/unit-model-images/page.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchUnitModelImages,
    deleteUnitModelImage,
    setMainUnitModelImage,
    updateUnitModelImage,
} from '@/store/slices/unitModelImageSlice';
import {
    fetchUnitModels
} from '@/store/slices/unitModelSlice';
import { FiImage, FiStar, FiTrash2, FiGrid, FiList } from 'react-icons/fi';
// import ImageUploadModal from '@/dashboard/components/ImageUploadModal';
// import ConfirmationModal from '@/dashboard/components/ConfirmationModal';
import UnitModelImageForm from '@/dashboard/components/UnitModelImageForm';

export default function UnitModelImagesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { unitModelImages, operationLoading } = useAppSelector((state) => state.unitModelImage);
    const { unitModels } = useAppSelector((state) => state.unitModel);

    const [selectedUnitModel, setSelectedUnitModel] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [dragOrder, setDragOrder] = useState([]);

    // Load unit models on mount
    useEffect(() => {
        dispatch(fetchUnitModels({ PageNumber: 1, PageSize: 100 }));
    }, [dispatch]);

    // Load images when unit model is selected
    useEffect(() => {
        if (selectedUnitModel) {
            dispatch(fetchUnitModelImages({
                unitModelId: selectedUnitModel,
                params: { PageNumber: 1, PageSize: 100 }
            }));
        }
    }, [selectedUnitModel, dispatch]);

    // Initialize drag order when images change
    useEffect(() => {
        const ordered = [...unitModelImages]
            .sort((a, b) => a.displayOrder - b.displayOrder);
        setDragOrder(ordered);
    }, [unitModelImages]);

    const handleUnitModelChange = (unitModelId) => {
        setSelectedUnitModel(unitModelId);
    };

    const handleSetMainImage = async (imageId) => {
        if (!selectedUnitModel) return;

        await dispatch(setMainUnitModelImage({
            unitModelId: selectedUnitModel,
            imageId
        })).unwrap();
    };

    const handleDeleteImage = async () => {
        if (!selectedUnitModel || !selectedImage) return;

        await dispatch(deleteUnitModelImage({
            unitModelId: selectedUnitModel,
            imageId: selectedImage.id
        })).unwrap();

        setDeleteModalOpen(false);
        setSelectedImage(null);
    };

    const handleEditImage = async (data) => {
        if (!selectedUnitModel || !selectedImage) return;

        await dispatch(updateUnitModelImage({
            unitModelId: selectedUnitModel,
            imageId: selectedImage.id,
            data
        })).unwrap();

        setEditModalOpen(false);
        setSelectedImage(null);
    };

    const handleDragEnd = useCallback(async (result) => {
        if (!result.destination || !selectedUnitModel) return;

        const items = Array.from(dragOrder);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local order
        setDragOrder(items);

        // Update display order for each image
        const updates = items.map((item, index) => ({
            ...item,
            displayOrder: index + 1
        }));

        // Update each image's display order
        for (const image of updates) {
            await dispatch(updateUnitModelImage({
                unitModelId: selectedUnitModel,
                imageId: image.id,
                data: { displayOrder: image.displayOrder }
            }));
        }

    }, [dragOrder, selectedUnitModel, dispatch]);

    const getUnitModelName = () => {
        const unitModel = unitModels.find(um => um.id === parseInt(selectedUnitModel));
        return unitModel?.name || '';
    };

    const getMainImage = () => {
        return unitModelImages.find(img => img.isMain);
    };

    const handleOpenDeleteModal = (image) => {
        setSelectedImage(image);
        setDeleteModalOpen(true);
    };

    const handleOpenEditModal = (image) => {
        setSelectedImage(image);
        setEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-third-900">
                        {t('dashboard.unitModelImages.title')}
                    </h1>
                    <p className="text-neutral-600 mt-1">
                        {t('dashboard.unitModelImages.description')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-neutral-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
                        >
                            <FiGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
                        >
                            <FiList className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Unit Model Selector */}
            <div className="bg-white rounded-xl border border-neutral-300 p-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('dashboard.unitModelImages.selectUnitModel')}
                </label>
                <select
                    value={selectedUnitModel}
                    onChange={(e) => handleUnitModelChange(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="">{t('dashboard.unitModelImages.selectUnitModelPlaceholder')}</option>
                    {unitModels.map(unitModel => (
                        <option key={unitModel.id} value={unitModel.id}>
                            {unitModel.name} ({unitModel.modelCode})
                        </option>
                    ))}
                </select>
            </div>

            {/* Main Image Display */}
            {selectedUnitModel && getMainImage() && (
                <div className="bg-white rounded-xl border border-neutral-300 p-6">
                    <h3 className="text-lg font-semibold text-third-900 mb-4 flex items-center gap-2">
                        <FiStar className="w-5 h-5 text-warning-500" />
                        {t('dashboard.unitModelImages.mainImage')}
                    </h3>
                    <div className="relative group">
                        <img
                            src={getMainImage().imageUrl}
                            alt="Main"
                            className="w-full max-w-2xl h-64 object-cover rounded-lg"
                        />
                        <div className="absolute top-4 inset-e-4 flex gap-2">
                            <div className="bg-warning-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {t('dashboard.unitModelImages.main')}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Images Gallery */}
            {selectedUnitModel ? (
                <div className="bg-white rounded-xl border border-neutral-300 overflow-hidden">
                    {viewMode === 'grid' ? (
                        // Grid View
                        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {unitModelImages.map((image) => (
                                <div key={image.id} className="relative group rounded-lg overflow-hidden border border-neutral-300">
                                    <div className="relative aspect-square">
                                        <img
                                            src={image.imageUrl}
                                            alt={`Image ${image.displayOrder}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {/* Image Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                                        {/* Image Actions */}
                                        <div className="absolute top-2 inset-e-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {!image.isMain && (
                                                <button
                                                    onClick={() => handleSetMainImage(image.id)}
                                                    className="bg-warning-500 text-white p-2 rounded-full hover:bg-warning-600 transition-colors"
                                                    title={t('dashboard.unitModelImages.actions.setMain')}
                                                >
                                                    <FiStar className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenEditModal(image)}
                                                className="bg-info-500 text-white p-2 rounded-full hover:bg-info-600 transition-colors"
                                                title={t('dashboard.unitModelImages.actions.edit')}
                                            >
                                                <FiImage className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(image)}
                                                className="bg-error-500 text-white p-2 rounded-full hover:bg-error-600 transition-colors"
                                                title={t('dashboard.unitModelImages.actions.delete')}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Image Info */}
                                        <div className="absolute bottom-0 inset-s-0 inset-e-0 bg-linear-to-t from-black to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">
                                                        Order: {image.displayOrder}
                                                    </span>
                                                    {image.isMain && (
                                                        <span className="bg-warning-500 text-white px-2 py-0.5 rounded-full text-xs">
                                                            {t('dashboard.unitModelImages.main')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List View
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-300">
                                            <th className="text-start py-3 px-4 text-sm font-medium text-neutral-700">
                                                {t('dashboard.unitModelImages.columns.image')}
                                            </th>
                                            <th className="text-start py-3 px-4 text-sm font-medium text-neutral-700">
                                                {t('dashboard.unitModelImages.columns.order')}
                                            </th>
                                            <th className="text-start py-3 px-4 text-sm font-medium text-neutral-700">
                                                {t('dashboard.unitModelImages.columns.status')}
                                            </th>
                                            <th className="text-start py-3 px-4 text-sm font-medium text-neutral-700">
                                                {t('dashboard.unitModelImages.columns.actions')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unitModelImages.map((image) => (
                                            <tr key={image.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={`Image ${image.displayOrder}`}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="text-sm">
                                                            <div className="font-medium text-neutral-900">
                                                                ID: {image.id}
                                                            </div>
                                                            <div className="text-neutral-500">
                                                                Unit Model: {getUnitModelName()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                                                        {image.displayOrder}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {image.isMain ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-800">
                                                            <FiStar className="w-3 h-3 me-1" />
                                                            {t('dashboard.unitModelImages.main')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800">
                                                            {t('dashboard.unitModelImages.additional')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        {!image.isMain && (
                                                            <button
                                                                onClick={() => handleSetMainImage(image.id)}
                                                                className="px-3 py-1.5 bg-warning-100 text-warning-700 rounded-lg text-sm font-medium hover:bg-warning-200 transition-colors flex items-center gap-1"
                                                            >
                                                                <FiStar className="w-3 h-3" />
                                                                {t('dashboard.unitModelImages.actions.setMain')}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleOpenEditModal(image)}
                                                            className="px-3 py-1.5 bg-info-100 text-info-700 rounded-lg text-sm font-medium hover:bg-info-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <FiImage className="w-3 h-3" />
                                                            {t('dashboard.unitModelImages.actions.edit')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenDeleteModal(image)}
                                                            className="px-3 py-1.5 bg-error-100 text-error-700 rounded-lg text-sm font-medium hover:bg-error-200 transition-colors flex items-center gap-1"
                                                        >
                                                            <FiTrash2 className="w-3 h-3" />
                                                            {t('dashboard.unitModelImages.actions.delete')}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {unitModelImages.length === 0 && (
                        <div className="p-12 text-center">
                            <FiImage className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-neutral-700 mb-2">
                                {t('dashboard.unitModelImages.noImages')}
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                {t('dashboard.unitModelImages.uploadPrompt')}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setUploadModalOpen(true)}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                                >
                                    {t('dashboard.unitModelImages.actions.uploadSingle')}
                                </button>
                                <button
                                    onClick={() => setBulkUploadModalOpen(true)}
                                    className="px-4 py-2 bg-secondary-500 text-white rounded-lg font-medium hover:bg-secondary-600 transition-colors"
                                >
                                    {t('dashboard.unitModelImages.actions.uploadMultiple')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // No Unit Model Selected State
                <div className="bg-white rounded-xl border border-neutral-300 p-12 text-center">
                    <FiImage className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-2">
                        {t('dashboard.unitModelImages.selectUnitModelPrompt')}
                    </h3>
                    <p className="text-neutral-500">
                        {t('dashboard.unitModelImages.selectUnitModelDescription')}
                    </p>
                </div>
            )}

            <UnitModelImageForm
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedImage(null);
                }}
                onSubmit={handleEditImage}
                image={selectedImage}
                loading={operationLoading}
            />

            {/* Confirmation Modal for Delete */}
            {deleteModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-third-900 mb-2">
                            {t('dashboard.unitModelImages.confirmDelete')}
                        </h3>
                        <p className="text-neutral-600 mb-6">
                            {t('dashboard.unitModelImages.confirmDeleteDescription')}
                        </p>

                        {/* Show image preview if needed */}
                        <div className="mb-6">
                            <img
                                src={selectedImage.imageUrl}
                                alt="To delete"
                                className="w-32 h-32 object-cover rounded-lg mx-auto"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setSelectedImage(null);
                                }}
                                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                                disabled={operationLoading}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteImage}  // This will call the actual delete function
                                className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-colors flex items-center gap-2"
                                disabled={operationLoading}
                            >
                                {operationLoading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        {t('common.deleting')}
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 className="w-4 h-4" />
                                        {t('common.delete')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}