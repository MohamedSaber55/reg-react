// dashboard/components/SliderImageForm.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { FiUpload, FiX, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const validationSchema = Yup.object({
    images: Yup.array()
        .min(1, 'At least one image is required')
        .of(
            Yup.object({
                file: Yup.mixed()
                    .required('Image file is required')
                    .test('fileType', 'Only image files are allowed', (value) => {
                        if (!value) return false;
                        return value.type?.startsWith('image/');
                    })
                    .test('fileSize', 'File size must be less than 5MB', (value) => {
                        if (!value) return false;
                        return value.size <= 5 * 1024 * 1024;
                    }),
                titleEn: Yup.string().max(200, 'Title must be less than 200 characters'),
                titleAr: Yup.string().max(200, 'Title must be less than 200 characters'),
                link: Yup.string().url('Must be a valid URL').required(),
                order: Yup.number().integer().min(1),
                isActive: Yup.boolean(),
            })
        ),
});

export const SliderImageForm = ({ slider, onSubmit, onCancel, initialImagesCount = 0 }) => {
    const { t } = useTranslation();
    const [uploadError, setUploadError] = useState('');

    const formik = useFormik({
        initialValues: {
            images: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setUploadError('');
                await onSubmit(values.images);
            } catch (error) {
                setUploadError(error?.message || 'Failed to upload images');
            }
        },
    });

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const validFiles = [];
        const errors = [];

        files.forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                errors.push(`${file.name} is not an image file.`);
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                errors.push(`${file.name} exceeds the 5MB size limit.`);
                return;
            }

            validFiles.push({
                file,
                preview: URL.createObjectURL(file),
                titleEn: '',
                titleAr: '',
                link: '',
                order: initialImagesCount + formik.values.images.length + index + 1,
                isActive: true,
            });
        });

        if (errors.length > 0) {
            setUploadError(errors.join('\n'));
            return;
        }

        setUploadError('');
        formik.setFieldValue('images', [...formik.values.images, ...validFiles]);

        // Reset file input
        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        const newImages = [...formik.values.images];
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);

        // Reorder remaining images
        const reorderedImages = newImages.map((img, idx) => ({
            ...img,
            order: initialImagesCount + idx + 1,
        }));

        formik.setFieldValue('images', reorderedImages);
    };

    const handleImageFieldChange = (index, field, value) => {
        formik.setFieldValue(`images[${index}].${field}`, value);
    };

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            formik.values.images.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, []);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {(uploadError || formik.errors.images) && (
                <Alert
                    variant="error"
                    dismissible
                    onDismiss={() => {
                        setUploadError('');
                        formik.setFieldError('images', undefined);
                    }}
                >
                    {uploadError || (typeof formik.errors.images === 'string' ? formik.errors.images : 'Please fix the errors in the form')}
                </Alert>
            )}

            <div>
                <p className="text-sm text-third-500   mb-4">
                    {t('dashboard.sliderImagesPage.uploadModal.selectedSlider')}:
                    <span className="font-medium text-third-900   ms-1">
                        {slider?.name}
                    </span>
                </p>

                <label className="flex flex-col items-center justify-center gap-4 px-6 py-12 border-2 border-dashed border-neutral-400   rounded-xl hover:border-primary-500   transition-colors cursor-pointer">
                    <div className="p-3 bg-primary-50   rounded-full">
                        <FiUpload className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-third-900   font-medium mb-1">
                            {t('dashboard.sliderImagesPage.uploadModal.clickToUpload')}
                        </p>
                        <p className="text-sm text-third-500">
                            {t('dashboard.sliderImagesPage.uploadModal.fileTypes')}
                        </p>
                    </div>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
            </div>

            {formik.values.images.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-third-900">
                            {t('dashboard.sliderImagesPage.uploadModal.imageDetails')}
                        </h3>
                        <span className="text-sm text-third-500">
                            {formik.values.images.length} {formik.values.images.length === 1 ? 'image' : 'images'}
                        </span>
                    </div>

                    {formik.values.images.map((image, index) => (
                        <div
                            key={index}
                            className="p-4 bg-neutral-50  rounded-xl border border-neutral-400"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 shrink-0 relative group">
                                    <img
                                        src={image.preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 inset-e-1 p-1.5 bg-error-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label={t('dashboard.forms.titleEn')}
                                            value={image.titleEn}
                                            onChange={(e) => handleImageFieldChange(index, 'titleEn', e.target.value)}
                                            placeholder="Welcome to DreamHome"
                                            error={
                                                formik.touched.images?.[index]?.titleEn &&
                                                formik.errors.images?.[index]?.titleEn
                                            }
                                        />
                                        <Input
                                            label={t('dashboard.forms.titleAr')}
                                            value={image.titleAr}
                                            onChange={(e) => handleImageFieldChange(index, 'titleAr', e.target.value)}
                                            placeholder="مرحبا بكم في دريم هوم"
                                            dir="rtl"
                                            error={
                                                formik.touched.images?.[index]?.titleAr &&
                                                formik.errors.images?.[index]?.titleAr
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label={t('dashboard.sliderImagesPage.uploadModal.linkUrl')}
                                            type="url"
                                            value={image.link}
                                            onChange={(e) => handleImageFieldChange(index, 'link', e.target.value)}
                                            placeholder="https://example.com"
                                            error={
                                                formik.touched.images?.[index]?.link &&
                                                formik.errors.images?.[index]?.link
                                            }
                                        />
                                        <Input
                                            label="Order"
                                            type="number"
                                            value={image.order}
                                            onChange={(e) => handleImageFieldChange(index, 'order', parseInt(e.target.value))}
                                            min={1}
                                            error={
                                                formik.touched.images?.[index]?.order &&
                                                formik.errors.images?.[index]?.order
                                            }
                                        />
                                    </div>

                                    <div className="text-xs text-third-500">
                                        {image.file.name} ({(image.file.size / 1024).toFixed(2)} KB)
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={onCancel}
                    disabled={formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<FiUpload />}
                    loading={formik.isSubmitting}
                    disabled={formik.values.images.length === 0 || formik.isSubmitting}
                >
                    {t('dashboard.sliderImagesPage.uploadModal.uploadButton', {
                        count: formik.values.images.length
                    })}
                </Button>
            </div>
        </form>
    );
};