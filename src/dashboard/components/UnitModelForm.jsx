// dashboard/components/UnitModelForm.jsx
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Input';
import FileUpload from '@/components/common/FileUpload';
import ImagePreview from '@/components/common/ImagePreview';

export default function UnitModelForm({ item, onSubmit, onCancel, stages, projects }) {
    const { t } = useTranslation();
    const [images, setImages] = useState([]); // All images (new uploads)
    const [mainImageIndex, setMainImageIndex] = useState(0); // Index of main image in new uploads
    const [removedImageIds, setRemovedImageIds] = useState([]);
    const [existingMainImageId, setExistingMainImageId] = useState(null); // Track existing main image
    const [filteredStages, setFilteredStages] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // Filter stages based on selected project
    useEffect(() => {
        if (selectedProject) {
            const filtered = stages.filter(stage => stage.projectId === parseInt(selectedProject));
            setFilteredStages(filtered);

            if (item?.stageId && !filtered.find(s => s.id === item.stageId)) {
                formik.setFieldValue('stageId', '');
            }
        } else {
            setFilteredStages(stages);
        }
    }, [selectedProject, stages, item]);

    // Set initial values and existing main image
    useEffect(() => {
        if (item) {
            const stage = stages.find(s => s.id === item.stageId);
            if (stage) {
                setSelectedProject(stage.projectId.toString());
            }

            // Find existing main image
            const mainImg = item.images?.find(img => img.isMain);
            if (mainImg) {
                setExistingMainImageId(mainImg.id);
            }
        }
    }, [item, stages]);

    // Validation schema
    const validationSchema = Yup.object({
        stageId: Yup.number()
            .required(t('validation.required'))
            .positive(t('validation.positiveNumber')),
        name: Yup.string()
            .required(t('validation.required'))
            .min(3, t('validation.minLength', { min: 3 }))
            .max(100, t('validation.maxLength', { max: 100 })),
        modelCode: Yup.string()
            .required(t('validation.required'))
            .max(20, t('validation.maxLength', { max: 20 }))
            .matches(/^[A-Z0-9_-]+$/, t('validation.alphaNumeric')),
        area: Yup.number()
            .required(t('validation.required'))
            .positive(t('validation.positiveNumber'))
            .max(10000, t('validation.maxValue', { max: 10000 })),
        bedrooms: Yup.number()
            .required(t('validation.required'))
            .min(0, t('validation.minValue', { min: 0 }))
            .integer(t('validation.integer')),
        bathrooms: Yup.number()
            .required(t('validation.required'))
            .min(0, t('validation.minValue', { min: 0 }))
            .integer(t('validation.integer')),
        startingPrice: Yup.number()
            .required(t('validation.required'))
            .positive(t('validation.positiveNumber'))
            .max(100000000, t('validation.maxValue', { max: 100000000 })),
        description: Yup.string()
            .max(1000, t('validation.maxLength', { max: 1000 })),
        isAvailable: Yup.boolean()
            .default(true)
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            stageId: item?.stageId || '',
            name: item?.name || '',
            modelCode: item?.modelCode || '',
            area: item?.area || '',
            bedrooms: item?.bedrooms || '',
            bathrooms: item?.bathrooms || '',
            startingPrice: item?.startingPrice || '',
            description: item?.description || '',
            isAvailable: item?.isAvailable ?? true
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Validate: must have at least one main image
                const hasExistingMainImage = getExistingImages().some(img => img.isMain);
                const hasNewImages = images.length > 0;

                if (!item && !hasNewImages) {
                    setFormErrors({ image: t('validation.mainImageRequired') });
                    setSubmitting(false);
                    return;
                }

                if (item && !hasExistingMainImage && !hasNewImages) {
                    setFormErrors({ image: t('validation.mainImageRequired') });
                    setSubmitting(false);
                    return;
                }

                // Prepare form data
                const formData = new FormData();

                // Add form values
                Object.keys(values).forEach(key => {
                    if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
                        formData.append(key, values[key]);
                    }
                });

                if (item) {
                    // UPDATE MODE
                    // Add new images
                    images.forEach((image) => {
                        formData.append('NewImages', image);
                    });

                    // Add removed image IDs
                    removedImageIds.forEach(id => {
                        formData.append('RemoveImageIds', id);
                    });
                } else {
                    // CREATE MODE
                    // Add all images in the correct order (main image first is better practice)
                    // First add the main image
                    if (images[mainImageIndex]) {
                        formData.append('Images', images[mainImageIndex]);
                    }

                    // Then add other images
                    images.forEach((image, index) => {
                        if (index !== mainImageIndex) {
                            formData.append('Images', image);
                        }
                    });
                }

                // Pass additional data about which image should be main
                const additionalData = {
                    mainImageIndex: item ? null : mainImageIndex,
                    newImagesCount: images.length,
                };

                await onSubmit(formData, additionalData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    // Helper function to check if field has error
    const getFieldError = (fieldName) => {
        return formik.touched[fieldName] && formik.errors[fieldName];
    };

    // Handle images upload
    const handleImagesUpload = (files) => {
        const filesArray = Array.isArray(files) ? files : [files];
        setImages(prev => [...prev, ...filesArray]);
        setFormErrors(prev => ({ ...prev, image: null }));

        // If this is the first image, set it as main
        if (images.length === 0 && filesArray.length > 0) {
            setMainImageIndex(0);
        }
    };

    // Remove uploaded image
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));

        // Adjust main image index if needed
        if (index === mainImageIndex) {
            setMainImageIndex(0); // Reset to first image
        } else if (index < mainImageIndex) {
            setMainImageIndex(prev => prev - 1);
        }
    };

    // Set main image from new uploads
    const setAsMainImage = (index) => {
        setMainImageIndex(index);
    };

    // Remove existing image
    const removeExistingImage = (imageId) => {
        if (!removedImageIds.includes(imageId)) {
            setRemovedImageIds(prev => [...prev, imageId]);

            // If removing the main image, clear the existing main image ID
            if (imageId === existingMainImageId) {
                setExistingMainImageId(null);
            }
        }
    };

    // Set existing image as main
    const setExistingAsMain = (imageId) => {
        setExistingMainImageId(imageId);
    };

    // Get existing images (not removed)
    const getExistingImages = () => {
        if (!item?.images) return [];
        return item.images.filter(img => !removedImageIds.includes(img.id));
    };

    // Check if form has at least one main image
    const hasMainImage = () => {
        const hasExistingMain = getExistingImages().some(img => img.isMain);
        const hasNewImages = images.length > 0;
        return hasExistingMain || hasNewImages;
    };

    // Check if form is ready for submission
    const isFormReady = () => {
        const imageValid = hasMainImage();
        return formik.isValid && imageValid;
    };

    // Format price for display
    const formatPrice = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Calculate total image count
    const getTotalImageCount = () => {
        return getExistingImages().length + images.length;
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* Project and Stage Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Selection */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t('dashboard.unitModels.form.project')}
                            <span className="text-error-500"> *</span>
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
                            disabled={formik.isSubmitting || !!item}
                        >
                            <option value="">{t('dashboard.unitModels.form.selectProject')}</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stage Selection */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {t('dashboard.unitModels.form.stage')}
                            <span className="text-error-500"> *</span>
                        </label>
                        <select
                            name="stageId"
                            value={formik.values.stageId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${getFieldError('stageId')
                                ? 'border-error-500 focus:ring-error-500'
                                : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                                }`}
                            disabled={formik.isSubmitting || !selectedProject}
                        >
                            <option value="">{t('dashboard.unitModels.form.selectStage')}</option>
                            {filteredStages.map(stage => (
                                <option key={stage.id} value={stage.id}>
                                    {stage.name} ({stage.code})
                                </option>
                            ))}
                        </select>
                        {getFieldError('stageId') && (
                            <p className="mt-1 text-sm text-error-500">{formik.errors.stageId}</p>
                        )}
                    </div>
                </div>

                {/* Name and Model Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t('dashboard.unitModels.form.name')}
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('name')}
                        required
                        placeholder={t('dashboard.unitModels.form.namePlaceholder')}
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        label={t('dashboard.unitModels.form.modelCode')}
                        name="modelCode"
                        value={formik.values.modelCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('modelCode')}
                        required
                        placeholder="2BR-001"
                        disabled={formik.isSubmitting}
                    />
                </div>

                {/* Area, Bedrooms, Bathrooms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label={t('dashboard.unitModels.form.area')}
                        name="area"
                        type="number"
                        value={formik.values.area}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('area')}
                        required
                        placeholder="120"
                        min="0"
                        max="10000"
                        step="0.1"
                        suffix="m²"
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        label={t('dashboard.unitModels.form.bedrooms')}
                        name="bedrooms"
                        type="number"
                        value={formik.values.bedrooms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('bedrooms')}
                        required
                        placeholder="2"
                        min="0"
                        max="10"
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        label={t('dashboard.unitModels.form.bathrooms')}
                        name="bathrooms"
                        type="number"
                        value={formik.values.bathrooms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={getFieldError('bathrooms')}
                        required
                        placeholder="2"
                        min="0"
                        max="10"
                        step="0.5"
                        disabled={formik.isSubmitting}
                    />
                </div>

                {/* Starting Price */}
                <Input
                    label={t('dashboard.unitModels.form.startingPrice')}
                    name="startingPrice"
                    type="number"
                    value={formik.values.startingPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('startingPrice')}
                    required
                    placeholder="250000"
                    min="0"
                    max="100000000"
                    prefix="$"
                    disabled={formik.isSubmitting}
                    helperText={formik.values.startingPrice ? formatPrice(formik.values.startingPrice) : ''}
                />

                {/* Description */}
                <Textarea
                    label={t('dashboard.unitModels.form.description')}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={getFieldError('description')}
                    rows={4}
                    placeholder={t('dashboard.unitModels.form.descriptionPlaceholder')}
                    disabled={formik.isSubmitting}
                />

                {/* Images Section */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {t('dashboard.unitModels.form.images')}
                        <span className="text-error-500"> *</span>
                        <span className="text-xs text-neutral-500 ml-2">
                            ({getTotalImageCount()}/10 {t('dashboard.unitModels.form.imagesCount')})
                        </span>
                    </label>

                    <div className="space-y-4">
                        {/* Existing Images */}
                        {getExistingImages().length > 0 && (
                            <div>
                                <p className="text-xs text-neutral-600 mb-2">
                                    {t('dashboard.unitModels.form.existingImages')}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {getExistingImages().map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={image.imageUrl}
                                                alt={`Image ${image.id}`}
                                                className={`w-full h-32 object-cover rounded-lg ${image.isMain ? 'ring-2 ring-primary-500' : ''
                                                    }`}
                                            />

                                            {/* Main Badge */}
                                            {image.isMain && (
                                                <div className="absolute top-2 inset-s-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                                    {t('dashboard.unitModels.form.main')}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="absolute top-2 inset-e-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!image.isMain && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setExistingAsMain(image.id)}
                                                        className="bg-primary-500 text-white p-1.5 rounded-full hover:bg-primary-600 transition-colors text-xs"
                                                        title={t('dashboard.unitModels.form.setAsMain')}
                                                    >
                                                        ⭐
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(image.id)}
                                                    className="bg-error-500 text-white p-1.5 rounded-full hover:bg-error-600 transition-colors"
                                                    title={t('dashboard.unitModels.form.remove')}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        {images.length > 0 && (
                            <div>
                                <p className="text-xs text-neutral-600 mb-2">
                                    {t('dashboard.unitModels.form.newImages')}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <ImagePreview
                                                file={image}
                                                className={`w-full h-32 ${index === mainImageIndex ? 'ring-2 ring-primary-500' : ''
                                                    }`}
                                            />

                                            {/* Main Badge */}
                                            {index === mainImageIndex && (
                                                <div className="absolute top-2 inset-s-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                                    {t('dashboard.unitModels.form.main')}
                                                </div>
                                            )}

                                            {/* New Badge */}
                                            <div className="absolute bottom-2 inset-s-2 bg-success-500 text-white text-xs px-2 py-1 rounded">
                                                {t('dashboard.unitModels.form.new')}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="absolute top-2 inset-e-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {index !== mainImageIndex && !item && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAsMainImage(index)}
                                                        className="bg-primary-500 text-white p-1.5 rounded-full hover:bg-primary-600 transition-colors text-xs"
                                                        title={t('dashboard.unitModels.form.setAsMain')}
                                                    >
                                                        ⭐
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="bg-error-500 text-white p-1.5 rounded-full hover:bg-error-600 transition-colors"
                                                    title={t('dashboard.unitModels.form.remove')}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {getTotalImageCount() < 10 && (
                            <FileUpload
                                onFileSelect={handleImagesUpload}
                                accept="image/*"
                                maxSize={5}
                                multiple
                                maxFiles={10 - getTotalImageCount()}
                                label={t('dashboard.unitModels.form.uploadImages')}
                            />
                        )}

                        {getTotalImageCount() >= 10 && (
                            <p className="text-sm text-neutral-500">
                                {t('dashboard.unitModels.form.maxImagesReached')}
                            </p>
                        )}

                        {formErrors.image && (
                            <p className="text-sm text-error-500">{formErrors.image}</p>
                        )}

                        {/* Helper Text */}
                        {!item && images.length > 0 && (
                            <p className="text-xs text-neutral-500">
                                {t('dashboard.unitModels.form.mainImageHelp')}
                            </p>
                        )}
                    </div>
                </div>

                {/* Availability Status */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isAvailable"
                        name="isAvailable"
                        checked={formik.values.isAvailable}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        disabled={formik.isSubmitting}
                    />
                    <label htmlFor="isAvailable" className="ms-2 text-sm text-neutral-700">
                        {t('dashboard.unitModels.form.isAvailable')}
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-300">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={formik.isSubmitting}
                    disabled={!isFormReady() || formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}