// dashboard/components/AboutSectionForm.jsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import { FiUpload, FiX } from 'react-icons/fi';

export default function AboutSectionForm({ item, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(item?.imageUrl || null);
    const [loading, setLoading] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        TitleEn: Yup.string()
            .required(t('validation.required'))
            .max(200, t('validation.maxLength', { max: 200 })),
        TitleAr: Yup.string()
            .required(t('validation.required'))
            .max(200, t('validation.maxLength', { max: 200 })),
        SubTitleEn: Yup.string()
            .max(200, t('validation.maxLength', { max: 200 })),
        SubTitleAr: Yup.string()
            .max(200, t('validation.maxLength', { max: 200 })),
        DescriptionEn: Yup.string()
            .required(t('validation.required'))
            .max(2000, t('validation.maxLength', { max: 2000 })),
        DescriptionAr: Yup.string()
            .required(t('validation.required'))
            .max(2000, t('validation.maxLength', { max: 2000 })),
        MissionEn: Yup.string()
            .max(1000, t('validation.maxLength', { max: 1000 })),
        MissionAr: Yup.string()
            .max(1000, t('validation.maxLength', { max: 1000 })),
        VisionEn: Yup.string()
            .max(1000, t('validation.maxLength', { max: 1000 })),
        VisionAr: Yup.string()
            .max(1000, t('validation.maxLength', { max: 1000 })),
        DisplayOrder: Yup.number()
            .integer(t('validation.integer'))
            .min(0, t('validation.min', { min: 0 }))
            .typeError(t('validation.number')),
        IsActive: Yup.boolean()
            .default(true),
    });

    const formik = useFormik({
        initialValues: {
            TitleEn: item?.titleEn || '',
            TitleAr: item?.titleAr || '',
            SubTitleEn: item?.subtitleEn || '',
            SubTitleAr: item?.subtitleAr || '',
            DescriptionEn: item?.descriptionEn || '',
            DescriptionAr: item?.descriptionAr || '',
            MissionEn: item?.missionEn || '',
            MissionAr: item?.missionAr || '',
            VisionEn: item?.visionEn || '',
            VisionAr: item?.visionAr || '',
            DisplayOrder: item?.displayOrder || 1,
            IsActive: item?.isActive ?? true,
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const submitData = new FormData();

                // Append all form values
                Object.keys(values).forEach(key => {
                    if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                        submitData.append(key, values[key]);
                    }
                });

                // Append image if selected
                if (imageFile) {
                    submitData.append('NewImage', imageFile); // Changed from 'image' to 'NewImage'
                }

                // Append RemoveImage flag if user removed the image
                if (removeImage) {
                    submitData.append('RemoveImage', true.toString());
                }

                await onSubmit(submitData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setLoading(false);
            }
        },
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                formik.setFieldError('NewImage', t('validation.fileSize', { size: '5MB' }));
                return;
            }

            if (!file.type.startsWith('image/')) {
                formik.setFieldError('NewImage', t('validation.notImage'));
                return;
            }

            setImageFile(file);
            setRemoveImage(false);
            formik.setFieldError('NewImage', null);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(true);
        formik.setFieldError('NewImage', null);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-third-900 mb-2">
                    {t('dashboard.forms.image')}
                    {imageFile && (
                        <span className="ms-2 text-xs text-third-500">
                            ({imageFile.name})
                        </span>
                    )}
                </label>

                {formik.errors.NewImage && (
                    <p className="text-sm text-error-500 mb-2">{formik.errors.NewImage}</p>
                )}

                {imagePreview ? (
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-w-md h-48 object-cover rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 inset-e-2 p-2 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-400 rounded-xl cursor-pointer hover:border-primary-500 transition-colors">
                        <FiUpload className="w-12 h-12 text-third-500 mb-2" />
                        <p className="text-sm text-third-500">
                            {t('dashboard.forms.clickToUpload')}
                        </p>
                        <p className="text-xs text-third-500 mt-1">
                            {t('dashboard.forms.imageRequirements')}
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {/* Display Order */}
            <Input
                label={t('dashboard.forms.displayOrder')}
                name="DisplayOrder"
                type="number"
                value={formik.values.DisplayOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.DisplayOrder && formik.errors.DisplayOrder}
                helperText={t('dashboard.forms.displayOrderHelper')}
            />

            {/* English Fields - Updated field names */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.englishContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleEn')}
                    name="TitleEn"
                    value={formik.values.TitleEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.TitleEn && formik.errors.TitleEn}
                    required
                />
                <Input
                    label={t('dashboard.forms.subtitleEn')}
                    name="SubTitleEn"
                    value={formik.values.SubTitleEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.SubTitleEn && formik.errors.SubTitleEn}
                />
                <Textarea
                    label={t('dashboard.forms.descriptionEn')}
                    name="DescriptionEn"
                    value={formik.values.DescriptionEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.DescriptionEn && formik.errors.DescriptionEn}
                    rows={4}
                    required
                />
                <Textarea
                    label={t('dashboard.forms.missionEn')}
                    name="MissionEn"
                    value={formik.values.MissionEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.MissionEn && formik.errors.MissionEn}
                    rows={3}
                />
                <Textarea
                    label={t('dashboard.forms.visionEn')}
                    name="VisionEn"
                    value={formik.values.VisionEn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.VisionEn && formik.errors.VisionEn}
                    rows={3}
                />
            </div>

            {/* Arabic Fields - Updated field names */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.arabicContent')}
                </h3>
                <Input
                    label={t('dashboard.forms.titleAr')}
                    name="TitleAr"
                    value={formik.values.TitleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.TitleAr && formik.errors.TitleAr}
                    dir="rtl"
                    required
                />
                <Input
                    label={t('dashboard.forms.subtitleAr')}
                    name="SubTitleAr"
                    value={formik.values.SubTitleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.SubTitleAr && formik.errors.SubTitleAr}
                    dir="rtl"
                />
                <Textarea
                    label={t('dashboard.forms.descriptionAr')}
                    name="DescriptionAr"
                    value={formik.values.DescriptionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.DescriptionAr && formik.errors.DescriptionAr}
                    dir="rtl"
                    rows={4}
                    required
                />
                <Textarea
                    label={t('dashboard.forms.missionAr')}
                    name="MissionAr"
                    value={formik.values.MissionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.MissionAr && formik.errors.MissionAr}
                    dir="rtl"
                    rows={3}
                />
                <Textarea
                    label={t('dashboard.forms.visionAr')}
                    name="VisionAr"
                    value={formik.values.VisionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.VisionAr && formik.errors.VisionAr}
                    dir="rtl"
                    rows={3}
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
                <Switch
                    checked={formik.values.IsActive}
                    onCheckedChange={(checked) => formik.setFieldValue('IsActive', checked)}
                />
                <label className="text-sm font-medium text-third-900">
                    {t('dashboard.forms.active')}
                </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading || formik.isSubmitting}
                >
                    {t('dashboard.forms.cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    loading={loading || formik.isSubmitting}
                    disabled={loading || formik.isSubmitting || !formik.isValid}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}