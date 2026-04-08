// app/(dashboard)/dashboard/slider-images/page.jsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchSliders
} from '@/store/slices/sliderSlice';
import {
    fetchSliderImages,
    createMultipleSliderImages,
    deleteSliderImage,
    resetSliderImages
} from '@/store/slices/sliderImageSlice';
import { SliderImageForm } from '@/dashboard/components/SliderImageForm';
import { useTranslation } from 'react-i18next';
import { FiImage, FiLink, FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { Button, IconButton } from '@/components/common/Button';
import { Select } from '@/components/common/Input';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';

export default function SliderImagesPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { sliders, loading: slidersLoading } = useAppSelector((state) => state.slider);
    const { sliderImages, loading: imagesLoading, operationLoading, error } = useAppSelector((state) => state.sliderImage);

    const [selectedSlider, setSelectedSlider] = useState(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchSliders({ pageSize: 100 }));
    }, [dispatch]);

    useEffect(() => {
        if (selectedSlider) {
            dispatch(fetchSliderImages({ sliderId: selectedSlider.id, params: { pageSize: 100 } }));
        }
        return () => {
            dispatch(resetSliderImages());
        };
    }, [dispatch, selectedSlider]);

    const handleSliderChange = (e) => {
        const sliderId = parseInt(e.target.value);
        const slider = sliders.find(s => s.id === sliderId);
        setSelectedSlider(slider || null);
    };

    const handleUploadSubmit = async (images) => {
        if (!selectedSlider) return;

        await dispatch(createMultipleSliderImages({
            sliderId: selectedSlider.id,
            images
        })).unwrap();

        setUploadModalOpen(false);
    };

    const handleDelete = async () => {
        if (!selectedSlider || !imageToDelete) return;

        try {
            await dispatch(deleteSliderImage({
                sliderId: selectedSlider.id,
                imageId: imageToDelete.image?.id
            })).unwrap();
            setDeleteModalOpen(false);
            setImageToDelete(null);
        } catch (err) {
            console.error('Failed to delete image:', err);
        }
    };

    const handleExportImagesCSV = () => {
        if (!selectedSlider || sliderImages.length === 0) return;

        const headers = [
            'Order',
            'Image URL',
            'Title (English)',
            'Title (Arabic)',
            'Link',
            'Alt Text (English)',
            'Alt Text (Arabic)'
        ];

        const rows = sliderImages.map(img => [
            img.order,
            `"${img.image?.imageUrl || ''}"`,
            `"${img.image?.titleEn || ''}"`,
            `"${img.image?.titleAr || ''}"`,
            `"${img.image?.link || ''}"`,
            `"${img.image?.altTextEn || ''}"`,
            `"${img.image?.altTextAr || ''}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedSlider.name.replace(/\s+/g, '_')}_images_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-third-900   font-serif mb-2">
                        {t('dashboard.sliderImagesPage.title')}
                    </h1>
                    <p className="text-third-500">
                        {t('dashboard.sliderImagesPage.description')}
                    </p>
                </div>
            </div>

            {/* Slider Selection */}
            <div className="bg-neutral-50   border border-neutral-400   rounded-2xl p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-third-900   mb-2">
                        {t('dashboard.sliderImagesPage.selectSlider')}
                    </label>
                    <Select
                        value={selectedSlider?.id || ''}
                        onChange={handleSliderChange}
                        options={[
                            { value: '', label: t('dashboard.sliderImagesPage.selectSliderPlaceholder') },
                            ...sliders.map(slider => ({
                                value: slider.id.toString(),
                                label: slider.name
                            }))
                        ]}
                        className="w-full"
                    />
                </div>

                {selectedSlider && (
                    <div className="mt-4 p-4 bg-neutral-50  rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary-100   rounded-lg">
                                <FiImage className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-third-900">
                                    {selectedSlider.name}
                                </h3>
                                <p className="text-sm text-third-500   mt-1">
                                    {selectedSlider.description || t('dashboard.sliderImagesPage.noDescription')}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="primary" size="sm">
                                        {t('dashboard.sliderImagesPage.imagesCount', { count: sliderImages.length })}
                                    </Badge>
                                    <Badge variant={selectedSlider.isActive ? 'success' : 'secondary'} size="sm">
                                        {selectedSlider.isActive ? t('dashboard.common.active') : t('dashboard.common.inactive')}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <Alert variant="error" dismissible>
                    {error}
                </Alert>
            )}

            {/* Action Buttons */}
            {selectedSlider && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-sm text-third-500">
                        {t('dashboard.sliderImagesPage.showing', {
                            count: sliderImages.length,
                            name: selectedSlider.name
                        })}
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            leftIcon={<FiDownload />}
                            onClick={handleExportImagesCSV}
                            disabled={!selectedSlider || sliderImages.length === 0}
                        >
                            {t('dashboard.sliderImagesPage.exportImages')}
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<FiPlus />}
                            onClick={() => setUploadModalOpen(true)}
                            disabled={operationLoading}
                        >
                            {t('dashboard.sliderImagesPage.addImages')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Images Grid */}
            {selectedSlider ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {imagesLoading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="aspect-4/3 bg-neutral-50   rounded-xl overflow-hidden">
                                <Spinner size="lg" className="h-full flex items-center justify-center" />
                            </div>
                        ))
                    ) : sliderImages.length > 0 ? (
                        sliderImages.map((sliderImage, i) => (
                            <div
                                key={i}
                                className="bg-neutral-50   rounded-xl overflow-hidden border border-neutral-400   hover:shadow-lg transition-all duration-300"
                            >
                                <div className="aspect-4/3 relative overflow-hidden">
                                    <img
                                        src={sliderImage.image?.imageUrl}
                                        alt={sliderImage.image?.titleEn || `Slider image ${sliderImage.order}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 inset-e-3 z-10">
                                        <IconButton
                                            variant="danger"
                                            size="sm"
                                            icon={<FiTrash2 />}
                                            aria-label={t('dashboard.common.delete')}
                                            onClick={() => {
                                                setImageToDelete(sliderImage);
                                                setDeleteModalOpen(true);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-third-900   line-clamp-1">
                                                {sliderImage.image?.titleEn || `Image ${sliderImage.order}`}
                                            </h3>
                                            {sliderImage.image?.titleAr && (
                                                <p className="text-sm text-third-500   mt-1 line-clamp-1">
                                                    {sliderImage.image.titleAr}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="primary" size="sm">
                                            #{sliderImage.order}
                                        </Badge>
                                    </div>

                                    {sliderImage.image?.link && (
                                        <div className="mt-3 flex items-center gap-2 text-sm text-third-500">
                                            <FiLink className="w-4 h-4" />
                                            <a
                                                href={sliderImage.image.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary-600   truncate"
                                            >
                                                {sliderImage.image.link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <FiImage className="w-16 h-16 text-third-500   mx-auto mb-4" />
                            <p className="text-third-500">
                                {t('dashboard.sliderImagesPage.noImages')}
                            </p>
                            <Button
                                variant="primary"
                                leftIcon={<FiPlus />}
                                className="mt-4"
                                onClick={() => setUploadModalOpen(true)}
                            >
                                {t('dashboard.sliderImagesPage.addImages')}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20">
                    <FiImage className="w-16 h-16 text-third-500   mx-auto mb-4" />
                    <p className="text-third-500">
                        {t('dashboard.sliderImagesPage.selectSliderPrompt')}
                    </p>
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                title={t('dashboard.sliderImagesPage.uploadModal.title')}
                size="lg"
            >
                <SliderImageForm
                    slider={selectedSlider}
                    onSubmit={handleUploadSubmit}
                    onCancel={() => setUploadModalOpen(false)}
                    initialImagesCount={sliderImages.length}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setImageToDelete(null);
                }}
                onConfirm={handleDelete}
                title={t('dashboard.sliderImagesPage.deleteModal.title')}
                message={t('dashboard.sliderImagesPage.deleteModal.message', {
                    name: selectedSlider?.name
                })}
                variant="danger"
                confirmText={t('dashboard.common.delete')}
                cancelText={t('dashboard.forms.cancel')}
            />
        </div>
    );
}