// dashboard/components/HeroSectionForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiUpload, FiX } from 'react-icons/fi';

export default function HeroSectionForm({ item, onSubmit: submitHero, onCancel }) {
    const { t } = useTranslation();
    const [imagePreview, setImagePreview] = useState(item?.imageUrl || null);
    const [removeImage, setRemoveImage] = useState(false);

    // Validation Schema
    const validationSchema = Yup.object({
        titleEn: Yup.string()
            .required(t('dashboard.validation.titleEnRequired', 'English title is required'))
            .min(2, t('dashboard.validation.titleEnMin', 'Title must be at least 2 characters'))
            .max(200, t('dashboard.validation.titleEnMax', 'Title must not exceed 200 characters')),
        titleAr: Yup.string()
            .required(t('dashboard.validation.titleArRequired', 'Arabic title is required'))
            .min(2, t('dashboard.validation.titleArMin', 'Title must be at least 2 characters'))
            .max(200, t('dashboard.validation.titleArMax', 'Title must not exceed 200 characters')),
        subTitleEn: Yup.string()
            .max(300, t('dashboard.validation.subTitleEnMax', 'Subtitle must not exceed 300 characters')),
        subTitleAr: Yup.string()
            .max(300, t('dashboard.validation.subTitleArMax', 'Subtitle must not exceed 300 characters')),
        descriptionEn: Yup.string()
            .max(1000, t('dashboard.validation.descriptionEnMax', 'Description must not exceed 1000 characters')),
        descriptionAr: Yup.string()
            .max(1000, t('dashboard.validation.descriptionArMax', 'Description must not exceed 1000 characters')),
        primaryCtaTitleEn: Yup.string()
            .max(100, t('dashboard.validation.ctaTitleMax', 'CTA title must not exceed 100 characters')),
        primaryCtaTitleAr: Yup.string()
            .max(100, t('dashboard.validation.ctaTitleMax', 'CTA title must not exceed 100 characters')),
        primaryCtaUrl: Yup.string()
            .url(t('dashboard.validation.invalidUrl', 'Invalid URL format'))
            .max(500, t('dashboard.validation.urlMax', 'URL must not exceed 500 characters')),
        secondaryCtaTitleEn: Yup.string()
            .max(100, t('dashboard.validation.ctaTitleMax', 'CTA title must not exceed 100 characters')),
        secondaryCtaTitleAr: Yup.string()
            .max(100, t('dashboard.validation.ctaTitleMax', 'CTA title must not exceed 100 characters')),
        secondaryCtaUrl: Yup.string()
            .url(t('dashboard.validation.invalidUrl', 'Invalid URL format'))
            .max(500, t('dashboard.validation.urlMax', 'URL must not exceed 500 characters')),
        propertiesSold: Yup.number()
            .min(0, t('dashboard.validation.numberMin', 'Value must be 0 or greater'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        propertiesRented: Yup.number()
            .min(0, t('dashboard.validation.numberMin', 'Value must be 0 or greater'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        happyClients: Yup.number()
            .min(0, t('dashboard.validation.numberMin', 'Value must be 0 or greater'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        citiesCovered: Yup.number()
            .min(0, t('dashboard.validation.numberMin', 'Value must be 0 or greater'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        satisfactionRate: Yup.number()
            .min(0, t('dashboard.validation.rateMin', 'Rate must be between 0 and 100'))
            .max(100, t('dashboard.validation.rateMax', 'Rate must be between 0 and 100'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        initYear: Yup.number()
            .min(1900, t('dashboard.validation.yearMin', 'Year must be 1900 or later'))
            .max(new Date().getFullYear(), t('dashboard.validation.yearMax', 'Year cannot be in the future'))
            .integer(t('dashboard.validation.integerRequired', 'Value must be a whole number')),
        image: item ? Yup.mixed().nullable() : Yup.mixed().required(t('dashboard.validation.imageRequired', 'Image is required')),
        isActive: Yup.boolean()
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            titleEn: item?.titleEn || '',
            titleAr: item?.titleAr || '',
            subTitleEn: item?.subTitleEn || '',
            subTitleAr: item?.subTitleAr || '',
            descriptionEn: item?.descriptionEn || '',
            descriptionAr: item?.descriptionAr || '',
            primaryCtaTitleEn: item?.primaryCtaTitleEn || '',
            primaryCtaTitleAr: item?.primaryCtaTitleAr || '',
            primaryCtaUrl: item?.primaryCtaUrl || '',
            secondaryCtaTitleEn: item?.secondaryCtaTitleEn || '',
            secondaryCtaTitleAr: item?.secondaryCtaTitleAr || '',
            secondaryCtaUrl: item?.secondaryCtaUrl || '',
            propertiesSold: item?.propertiesSold || 0,
            propertiesRented: item?.propertiesRented || 0,
            happyClients: item?.happyClients || 0,
            citiesCovered: item?.citiesCovered || 0,
            satisfactionRate: item?.satisfactionRate || 0,
            initYear: item?.initYear || new Date().getFullYear(),
            image: null,
            isActive: item?.isActive ?? true,
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const formData = new FormData();

                // Append all text fields
                Object.keys(values).forEach(key => {
                    if (key !== 'image' && values[key] !== null && values[key] !== undefined) {
                        formData.append(key, values[key]);
                    }
                });

                // Handle image
                if (item) {
                    // Update mode
                    if (values.image) {
                        formData.append('NewImage', values.image);
                    }
                    formData.append('RemoveImage', removeImage);
                } else {
                    // Create mode
                    if (values.image) {
                        formData.append('Image', values.image);
                    }
                }
                console.log('====================================');
                console.log("submit");
                console.log('====================================');

                await submitHero(formData);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    console.log('====================================');
    console.log(formik.errors);
    console.log('====================================');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            setRemoveImage(false);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue('image', null);
        setImagePreview(null);
        setRemoveImage(true);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900">
                        {t('dashboard.forms.englishContent')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.titleEn')}
                        name="titleEn"
                        value={formik.values.titleEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.titleEn && formik.errors.titleEn}
                        required
                    />
                    <Input
                        label={t('dashboard.forms.subTitleEn')}
                        name="subTitleEn"
                        value={formik.values.subTitleEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subTitleEn && formik.errors.subTitleEn}
                    />
                    <Textarea
                        label={t('dashboard.forms.descriptionEn')}
                        name="descriptionEn"
                        value={formik.values.descriptionEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.descriptionEn && formik.errors.descriptionEn}
                        rows={3}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900">
                        {t('dashboard.forms.arabicContent')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.titleAr')}
                        name="titleAr"
                        value={formik.values.titleAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.titleAr && formik.errors.titleAr}
                        dir="rtl"
                        required
                    />
                    <Input
                        label={t('dashboard.forms.subTitleAr')}
                        name="subTitleAr"
                        value={formik.values.subTitleAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.subTitleAr && formik.errors.subTitleAr}
                        dir="rtl"
                    />
                    <Textarea
                        label={t('dashboard.forms.descriptionAr')}
                        name="descriptionAr"
                        value={formik.values.descriptionAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.descriptionAr && formik.errors.descriptionAr}
                        dir="rtl"
                        rows={3}
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.heroImage', 'Hero Image')}
                </h3>
                <div className="flex items-center gap-4">
                    <label className="flex-1">
                        <div className="border-2 border-dashed border-neutral-400   rounded-lg p-6 hover:border-primary-500 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <FiUpload className="text-3xl text-third-500" />
                                <span className="text-sm text-third-500">
                                    {t('dashboard.forms.clickToUpload', 'Click to upload image')}
                                </span>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                    {imagePreview && (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -inset-e-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600"
                            >
                                <FiX />
                            </button>
                        </div>
                    )}
                </div>
                {formik.touched.image && formik.errors.image && (
                    <p className="text-sm text-error-600">{formik.errors.image}</p>
                )}
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900">
                        {t('dashboard.forms.primaryCta', 'Primary CTA')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.ctaTitleEn', 'CTA Title (English)')}
                        name="primaryCtaTitleEn"
                        value={formik.values.primaryCtaTitleEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.primaryCtaTitleEn && formik.errors.primaryCtaTitleEn}
                    />
                    <Input
                        label={t('dashboard.forms.ctaTitleAr', 'CTA Title (Arabic)')}
                        name="primaryCtaTitleAr"
                        value={formik.values.primaryCtaTitleAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.primaryCtaTitleAr && formik.errors.primaryCtaTitleAr}
                        dir="rtl"
                    />
                    <Input
                        label={t('dashboard.forms.ctaUrl', 'CTA URL')}
                        name="primaryCtaUrl"
                        value={formik.values.primaryCtaUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.primaryCtaUrl && formik.errors.primaryCtaUrl}
                        placeholder="https://example.com"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-third-900">
                        {t('dashboard.forms.secondaryCta', 'Secondary CTA')}
                    </h3>
                    <Input
                        label={t('dashboard.forms.ctaTitleEn', 'CTA Title (English)')}
                        name="secondaryCtaTitleEn"
                        value={formik.values.secondaryCtaTitleEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.secondaryCtaTitleEn && formik.errors.secondaryCtaTitleEn}
                    />
                    <Input
                        label={t('dashboard.forms.ctaTitleAr', 'CTA Title (Arabic)')}
                        name="secondaryCtaTitleAr"
                        value={formik.values.secondaryCtaTitleAr}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.secondaryCtaTitleAr && formik.errors.secondaryCtaTitleAr}
                        dir="rtl"
                    />
                    <Input
                        label={t('dashboard.forms.ctaUrl', 'CTA URL')}
                        name="secondaryCtaUrl"
                        value={formik.values.secondaryCtaUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.secondaryCtaUrl && formik.errors.secondaryCtaUrl}
                        placeholder="https://example.com"
                    />
                </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-third-900">
                    {t('dashboard.forms.statistics', 'Statistics')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        label={t('dashboard.forms.propertiesSold', 'Properties Sold')}
                        name="propertiesSold"
                        type="number"
                        value={formik.values.propertiesSold}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.propertiesSold && formik.errors.propertiesSold}
                        min="0"
                    />
                    <Input
                        label={t('dashboard.forms.propertiesRented', 'Properties Rented')}
                        name="propertiesRented"
                        type="number"
                        value={formik.values.propertiesRented}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.propertiesRented && formik.errors.propertiesRented}
                        min="0"
                    />
                    <Input
                        label={t('dashboard.forms.happyClients', 'Happy Clients')}
                        name="happyClients"
                        type="number"
                        value={formik.values.happyClients}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.happyClients && formik.errors.happyClients}
                        min="0"
                    />
                    <Input
                        label={t('dashboard.forms.citiesCovered', 'Cities Covered')}
                        name="citiesCovered"
                        type="number"
                        value={formik.values.citiesCovered}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.citiesCovered && formik.errors.citiesCovered}
                        min="0"
                    />
                    <Input
                        label={t('dashboard.forms.satisfactionRate', 'Satisfaction Rate (%)')}
                        name="satisfactionRate"
                        type="number"
                        value={formik.values.satisfactionRate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.satisfactionRate && formik.errors.satisfactionRate}
                        min="0"
                        max="100"
                    />
                    <Input
                        label={t('dashboard.forms.initYear', 'Year Established')}
                        name="initYear"
                        type="number"
                        value={formik.values.initYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.initYear && formik.errors.initYear}
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 pt-2">
                <Switch
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) => formik.setFieldValue('isActive', checked)}
                />
                <label className="text-sm font-medium text-third-900">
                    {t('dashboard.forms.active')}
                </label>
            </div>

            {/* Form-level errors */}
            {formik.submitCount > 0 && !formik.isValid && (
                <div className="bg-error-50  border border-error-200   rounded-lg p-4">
                    <p className="text-sm text-error-700   font-medium">
                        {t('dashboard.validation.formErrors', 'Please fix the errors above before submitting')}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-400">
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
                    disabled={formik.isSubmitting}
                >
                    {item ? t('dashboard.forms.update') : t('dashboard.forms.create')}
                </Button>
            </div>
        </form>
    );
}