// dashboard/components/SliderImagesForm.jsx
import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { FiUpload, FiTrash2, FiPlus, FiImage } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const SliderImagesForm = ({ sliderId, onSubmit, onCancel, initialImages = [] }) => {
    const { t } = useTranslation();
    const [images, setImages] = useState(
        initialImages.map(img => ({
            id: img.image?.id || null,
            file: null,
            preview: img.imageUrl || null,
            titleEn: img.titleEn || '',
            titleAr: img.titleAr || '',
            descriptionEn: img.descriptionEn || '',
            descriptionAr: img.descriptionAr || '',
            link: img.link || '',
            order: img.order || 1,
            isNew: !img.image?.id, // distinguish new vs existing
        }))
    );
    const [error, setError] = useState('');

    const handleAddImage = () => {
        setImages(prev => [...prev, {
            id: null,
            file: null,
            preview: null,
            titleEn: '',
            titleAr: '',
            descriptionEn: '',
            descriptionAr: '',
            link: '',
            order: images.length + 1,
            isNew: true,
        }]);
    };

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError(t('dashboard.sliderImagesPage.uploadModal.invalidFileType'));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError(t('dashboard.sliderImagesPage.uploadModal.fileTooLarge'));
            return;
        }

        setError('');
        const preview = URL.createObjectURL(file);
        setImages(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], file, preview };
            return updated;
        });
    };

    const updateField = (index, field, value) => {
        setImages(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            // Separate new vs existing
            const newImages = images.filter(img => img.isNew);
            const existingImages = images.filter(img => !img.isNew);

            const formData = new FormData();

            // Add new images
            newImages.forEach((img, idx) => {
                formData.append(`dtos[${idx}].image`, img.file);
                formData.append(`dtos[${idx}].titleEn`, img.titleEn || '');
                formData.append(`dtos[${idx}].titleAr`, img.titleAr || '');
                formData.append(`dtos[${idx}].link`, img.link || '');
                formData.append(`dtos[${idx}].order`, img.order.toString());
            });

            // Existing images are **not** sent here — they’re managed via update/delete APIs separately
            // So this form is **only for adding new images**

            if (newImages.length === 0) {
                setError(t('dashboard.sliderImagesPage.uploadModal.noImagesToAdd'));
                return;
            }

            await onSubmit({ sliderId, formData });
        } catch (err) {
            setError(err.message || 'Failed to upload images');
        }
    };

    return (
        <div className="space-y-6">
            {error && <Alert variant="error" dismissible onDismiss={() => setError('')}>{error}</Alert>}

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('dashboard.sliderImagesPage.addImages')}</h3>
                <Button variant="primary" size="sm" leftIcon={<FiPlus />} onClick={handleAddImage}>
                    {t('dashboard.sliderImagesPage.addImage')}
                </Button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto ps-2">
                {images.map((image, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg border border-neutral-400 relative">
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -inset-e-2 p-1 bg-error-500 text-white rounded-full hover:bg-error-600"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {image.preview ? (
                                    <img src={image.preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
                                ) : (
                                    <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-neutral-400 rounded cursor-pointer hover:border-primary-500">
                                        <FiUpload className="w-6 h-6 text-primary-600" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, index)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Input
                                    label={t('dashboard.forms.titleEn')}
                                    value={image.titleEn}
                                    onChange={(e) => updateField(index, 'titleEn', e.target.value)}
                                />
                                <Input
                                    label={t('dashboard.forms.titleAr')}
                                    value={image.titleAr}
                                    onChange={(e) => updateField(index, 'titleAr', e.target.value)}
                                    dir="rtl"
                                />
                                <Input
                                    label={t('dashboard.sliderImagesPage.uploadModal.linkUrl')}
                                    type="url"
                                    value={image.link}
                                    onChange={(e) => updateField(index, 'link', e.target.value)}
                                />
                                <Input
                                    label={t('dashboard.sliderImagesPage.uploadModal.order')}
                                    type="number"
                                    min="1"
                                    value={image.order}
                                    onChange={(e) => updateField(index, 'order', parseInt(e.target.value) || 1)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={onCancel}>
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button variant="primary" leftIcon={<FiUpload />} onClick={handleSubmit} disabled={images.length === 0}>
                    {t('dashboard.sliderImagesPage.uploadModal.uploadButton', { count: images.filter(i => i.isNew).length })}
                </Button>
            </div>
        </div>
    );
};