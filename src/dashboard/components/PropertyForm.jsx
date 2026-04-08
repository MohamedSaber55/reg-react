import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    createProperty,
    updateProperty,
    fetchPropertyById
} from '@/store/slices/propertySlice';
import { fetchPropertyTypes } from '@/store/slices/propertyTypeSlice';
import { fetchTransactionTypes } from '@/store/slices/transactionTypeSlice';
import { fetchPropertyStatuses } from '@/store/slices/propertyStatusSlice';
import { fetchFinishingLevels } from '@/store/slices/finishingLevelSlice';
import { fetchFurnishingStatuses } from '@/store/slices/furnishingStatusSlice';
import {
    FiSave, FiX, FiUpload, FiTrash2, FiMapPin, FiHome, FiDollarSign,
    FiMaximize2, FiGrid, FiCheck, FiInfo
} from 'react-icons/fi';
import { Button } from '@/components/common/Button';
import { Input, Textarea, Select, Checkbox } from '@/components/common/Input';
import { Alert } from '@/components/common/Alert';
import { Spinner } from '@/components/common/Spinner';

const propertyValidationSchema = Yup.object({
    TitleEn: Yup.string()
        .required('English title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters'),
    TitleAr: Yup.string()
        .required('Arabic title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters'),

    DescriptionEn: Yup.string()
        .max(2000, 'Description must not exceed 2000 characters'),
    DescriptionAr: Yup.string()
        .max(2000, 'Description must not exceed 2000 characters'),

    Price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .positive('Price must be positive')
        .min(1, 'Price must be at least 1'),
    Area: Yup.number()
        .typeError('Area must be a number')
        .required('Area is required')
        .positive('Area must be positive')
        .min(1, 'Area must be at least 1'),
    Bedrooms: Yup.number()
        .typeError('Bedrooms must be a number')
        .min(0, 'Bedrooms cannot be negative')
        .integer('Bedrooms must be a whole number'),
    Bathrooms: Yup.number()
        .typeError('Bathrooms must be a number')
        .min(0, 'Bathrooms cannot be negative')
        .integer('Bathrooms must be a whole number'),

    PropertyTypeId: Yup.number()
        .typeError('Property type is required')
        .required('Property type is required')
        .positive('Please select a valid property type'),
    TransactionTypeId: Yup.number()
        .typeError('Transaction type is required')
        .required('Transaction type is required')
        .positive('Please select a valid transaction type'),

    PropertyStatusId: Yup.number()
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),
    FinishingLevelId: Yup.number()
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),
    FurnishingStatusId: Yup.number()
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    Location: Yup.object().shape({
        CityEn: Yup.string()
            .max(100, 'City name is too long'),
        CityAr: Yup.string()
            .max(100, 'City name is too long'),
        AreaEn: Yup.string()
            .max(100, 'Area name is too long'),
        AreaAr: Yup.string()
            .max(100, 'Area name is too long'),
        AddressEn: Yup.string()
            .required('Address is required')
            .max(500, 'Address is too long'),
        AddressAr: Yup.string()
            .required('Arabic address is required')
            .max(500, 'Address is too long'),
        Latitude: Yup.number()
            .nullable()
            .min(-90, 'Invalid latitude')
            .max(90, 'Invalid latitude')
            .transform((value, originalValue) => originalValue === '' ? null : value),
        Longitude: Yup.number()
            .nullable()
            .min(-180, 'Invalid longitude')
            .max(180, 'Invalid longitude')
            .transform((value, originalValue) => originalValue === '' ? null : value)
    }).required('Location information is required'),

    IsGroundFloor: Yup.boolean(),
    HasGarden: Yup.boolean(),
    HasElevator: Yup.boolean(),
    HasParking: Yup.boolean(),
    HasPool: Yup.boolean(),
    HasSecurity: Yup.boolean(),
    TotalFloors: Yup.number()
        .nullable()
        .min(0, 'Total floors cannot be negative')
        .integer('Total floors must be a whole number')
        .transform((value, originalValue) => originalValue === '' ? null : value),

    IsActive: Yup.boolean()
});

const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas is empty'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

const prepareFormData = (values, images, existingImages, isEdit = false, originalImages = []) => {
    const formData = new FormData();

    const appendIfNotEmpty = (key, value) => {
        if (value !== '' && value !== null && value !== undefined) {
            formData.append(key, value);
        }
    };

    const directFields = [
        'TitleEn', 'TitleAr', 'DescriptionEn', 'DescriptionAr',
        'Price', 'Area', 'Bedrooms', 'Bathrooms',
        'PropertyTypeId', 'TransactionTypeId', 'PropertyStatusId',
        'FinishingLevelId', 'FurnishingStatusId', 'IsActive'
    ];

    directFields.forEach(field => {
        appendIfNotEmpty(field, values[field]);
    });

    const locationFields = {
        'Location.CityEn': values.Location?.CityEn || '',
        'Location.CityAr': values.Location?.CityAr || '',
        'Location.AreaEn': values.Location?.AreaEn || '',
        'Location.AreaAr': values.Location?.AreaAr || '',
        'Location.AddressEn': values.Location?.AddressEn || '',
        'Location.AddressAr': values.Location?.AddressAr || '',
    };

    Object.entries(locationFields).forEach(([key, value]) => {
        if (value && value !== '') {
            formData.append(key, value);
        }
    });

    const featureFields = [
        'IsGroundFloor', 'HasGarden', 'HasElevator',
        'HasParking', 'HasPool', 'HasSecurity', 'TotalFloors'
    ];

    featureFields.forEach(field => {
        const value = values[field];
        if (value !== null && value !== undefined) {
            formData.append(field, value);
        }
    });

    if (images.length === 0 && (!isEdit || existingImages.length === 0)) {
        throw new Error('At least one image is required');
    }

    const imageFieldName = isEdit ? 'NewImages' : 'Images';
    images.forEach((image) => {
        formData.append(imageFieldName, image);
    });

    if (isEdit && originalImages.length > 0) {
        const currentImageIds = existingImages.map(img => img.id).filter(id => id);

        const removedImageIds = originalImages
            .map(img => img.id)
            .filter(id => id && !currentImageIds.includes(id));

        removedImageIds.forEach(id => {
            formData.append('RemoveImageIds', id);
        });
    }

    return formData;
};
const InfoIcon = ({ title, className = '' }) => (
    <div className="relative group">
        <FiInfo className={`w-4 h-4 text-neutral-500   ${className}`} />
        <div className="absolute bottom-full inset-s-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-900   text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {title}
            <div className="absolute top-full inset-s-1/2 transform -translate-x-1/2 -mt-2 border-4 border-transparent border-t-secondary-900"></div>
        </div>
    </div>
);

export default function PropertyForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useAppDispatch();
    const isEdit = !!params?.id;

    const { currentProperty, operationLoading } = useAppSelector((state) => state.property);
    const { propertyTypes } = useAppSelector((state) => state.propertyType);
    const { transactionTypes } = useAppSelector((state) => state.transactionType);
    const { propertyStatuses } = useAppSelector((state) => state.propertyStatus);
    const { finishingLevels } = useAppSelector((state) => state.finishingLevel);
    const { furnishingStatuses } = useAppSelector((state) => state.furnishingStatus);

    const [images, setImages] = useState([]);
    const [originalImages, setOriginalImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const [activeTab, setActiveTab] = useState('basic');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);

    const totalImages = images.length + existingImages.length;

    const formik = useFormik({
        initialValues: {
            TitleEn: '',
            TitleAr: '',

            DescriptionEn: '',
            DescriptionAr: '',

            Price: '',
            Area: '',
            Bedrooms: '',
            Bathrooms: '',

            PropertyTypeId: '',
            TransactionTypeId: '',
            PropertyStatusId: '',
            FinishingLevelId: '',
            FurnishingStatusId: '',

            Location: {
                CityEn: '',
                CityAr: '',
                AreaEn: '',
                AreaAr: '',
                AddressEn: '',
                AddressAr: '',
                Latitude: '',
                Longitude: ''
            },

            IsGroundFloor: false,
            HasGarden: false,
            HasElevator: false,
            HasParking: false,
            HasPool: false,
            HasSecurity: false,
            TotalFloors: '',

            IsActive: true
        },
        validationSchema: propertyValidationSchema,
        onSubmit: async (values) => {
            setSubmitError('');
            setUploadProgress(0);

            try {
                const formData = prepareFormData(values, images, existingImages, isEdit, originalImages);
                if (isEdit) {
                    await dispatch(updateProperty({
                        id: params.id,
                        formData
                    })).unwrap();
                } else {
                    await dispatch(createProperty(formData)).unwrap();
                }

                navigate('/dashboard/properties');
            } catch (error) {
                setSubmitError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to submit property. The request may have timed out due to large image sizes. Please try compressing your images or uploading fewer images at once.'
                );
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchPropertyTypes({ pageSize: 100 })),
                    dispatch(fetchTransactionTypes({ pageSize: 100 })),
                    dispatch(fetchPropertyStatuses({ pageSize: 100 })),
                    dispatch(fetchFinishingLevels({ pageSize: 100 })),
                    dispatch(fetchFurnishingStatuses({ pageSize: 100 }))
                ]);

                if (isEdit && params.id) {
                    await dispatch(fetchPropertyById(params.id));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [dispatch, isEdit, params.id]);

    useEffect(() => {
        if (isEdit && currentProperty) {
            formik.setValues({
                TitleEn: currentProperty.titleEn || '',
                TitleAr: currentProperty.titleAr || '',
                DescriptionEn: currentProperty.descriptionEn || '',
                DescriptionAr: currentProperty.descriptionAr || '',
                Price: currentProperty.price?.toString() || '',
                Area: currentProperty.area?.toString() || '',
                Bedrooms: currentProperty.bedrooms?.toString() || '',
                Bathrooms: currentProperty.bathrooms?.toString() || '',
                PropertyTypeId: currentProperty.propertyTypeId || '',
                TransactionTypeId: currentProperty.transactionTypeId || '',
                PropertyStatusId: currentProperty.propertyStatusId || '',
                FinishingLevelId: currentProperty.finishingLevelId || '',
                FurnishingStatusId: currentProperty.furnishingStatusId || '',
                Location: {
                    CityEn: currentProperty.location?.cityEn || '',
                    CityAr: currentProperty.location?.cityAr || '',
                    AreaEn: currentProperty.location?.areaEn || '',
                    AreaAr: currentProperty.location?.areaAr || '',
                    AddressEn: currentProperty.location?.addressEn || '',
                    AddressAr: currentProperty.location?.addressAr || '',
                    Latitude: currentProperty.location?.latitude?.toString() || '',
                    Longitude: currentProperty.location?.longitude?.toString() || ''
                },
                IsGroundFloor: currentProperty.isGroundFloor || false,
                HasGarden: currentProperty.hasGarden || false,
                HasElevator: currentProperty.hasElevator || false,
                HasParking: currentProperty.hasParking || false,
                HasPool: currentProperty.hasPool || false,
                HasSecurity: currentProperty.hasSecurity || false,
                TotalFloors: currentProperty.totalFloors?.toString() || '',
                IsActive: currentProperty.isActive !== undefined ? currentProperty.isActive : true
            });

            const propertyImages = currentProperty.images || [];
            setExistingImages(propertyImages);
            setOriginalImages(propertyImages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentProperty]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsCompressing(true);
        try {
            const compressedImages = [];

            for (const file of files) {
                if (file.size > 2 * 1024 * 1024) {
                    const compressed = await compressImage(file);
                    compressedImages.push(compressed);
                } else {
                    compressedImages.push(file);
                }
            }

            setImages(prev => [...prev, ...compressedImages].slice(0, 10));
        } catch (error) {
            setSubmitError('Failed to process images. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const hasImages = totalImages > 0;

    const featuresCount = Object.values({
        IsGroundFloor: formik.values.IsGroundFloor,
        HasGarden: formik.values.HasGarden,
        HasElevator: formik.values.HasElevator,
        HasParking: formik.values.HasParking,
        HasPool: formik.values.HasPool,
        HasSecurity: formik.values.HasSecurity
    }).filter(v => v === true).length;

    const totalImageSize = images.reduce((acc, img) => acc + img.size, 0);
    const totalImageSizeMB = (totalImageSize / 1024 / 1024).toFixed(2);

    if (isEdit && operationLoading && !currentProperty) {
        return (
            <div className="flex items-center justify-center min-h-125">
                <Spinner size="lg" label={t('common.loading')} />
            </div>
        );
    }

    const tabs = [
        { id: 'basic', label: t('dashboard.propertyForm.basicInfo'), icon: <FiInfo /> },
        { id: 'details', label: t('dashboard.propertyForm.propertyDetails'), icon: <FiHome /> },
        { id: 'location', label: t('dashboard.propertyForm.location'), icon: <FiMapPin /> },
        { id: 'features', label: t('dashboard.propertyForm.features'), icon: <FiGrid /> },
        { id: 'images', label: t('dashboard.propertyForm.images'), icon: <FiUpload /> },
        { id: 'settings', label: t('dashboard.propertyForm.publishSettings'), icon: <FiCheck /> }
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
                        {isEdit ? t('dashboard.properties.edit') : t('dashboard.properties.create')}
                    </h1>
                    <p className="text-neutral-600   mt-1">
                        {t('dashboard.propertyForm.formDescription')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<FiX />}
                        onClick={() => navigate('/dashboard/properties')}
                        type="button"
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<FiSave />}
                        loading={operationLoading}
                        type="submit"
                        disabled={!formik.isValid || operationLoading || !hasImages || isCompressing}
                    >
                        {isEdit ? t('common.update') : t('common.save')}
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {submitError && (
                <Alert variant="error" dismissible onDismiss={() => setSubmitError('')}>
                    {submitError}
                </Alert>
            )}

            {/* Compression Progress */}
            {isCompressing && (
                <Alert variant="info">
                    <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Compressing images... Please wait.</span>
                    </div>
                </Alert>
            )}

            {/* Image Size Warning */}
            {totalImageSizeMB > 5 && (
                <Alert variant="warning">
                    <div className="flex items-center gap-2">
                        <FiInfo className="w-5 h-5" />
                        <span>
                            Total image size is {totalImageSizeMB}MB. Large files may cause upload timeout.
                            Consider uploading fewer or smaller images.
                        </span>
                    </div>
                </Alert>
            )}

            {/* Image Requirement Warning */}
            {!hasImages && (
                <Alert variant="warning">
                    <div className="flex items-center gap-2">
                        <FiInfo className="w-5 h-5" />
                        <span>{t('dashboard.propertyForm.imagesRequired')}</span>
                    </div>
                </Alert>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-secondary-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600  '
                                    : 'border-transparent text-neutral-500   hover:text-neutral-700   hover:border-secondary-300  '
                                }
                            `}
                            type="button"
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.basicInfo')}
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('dashboard.propertyForm.titleEn')}
                                    required
                                    name="TitleEn"
                                    value={formik.values.TitleEn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.TitleEn && formik.errors.TitleEn}
                                    placeholder={t('dashboard.propertyForm.titleEnPlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.titleAr')}
                                    required
                                    name="TitleAr"
                                    value={formik.values.TitleAr}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.TitleAr && formik.errors.TitleAr}
                                    placeholder={t('dashboard.propertyForm.titleArPlaceholder')}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <Textarea
                                    label={t('dashboard.propertyForm.descriptionEn')}
                                    rows={4}
                                    name="DescriptionEn"
                                    value={formik.values.DescriptionEn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.DescriptionEn && formik.errors.DescriptionEn}
                                    placeholder={t('dashboard.propertyForm.descriptionEnPlaceholder')}
                                />
                                <Textarea
                                    label={t('dashboard.propertyForm.descriptionAr')}
                                    rows={4}
                                    name="DescriptionAr"
                                    value={formik.values.DescriptionAr}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.DescriptionAr && formik.errors.DescriptionAr}
                                    placeholder={t('dashboard.propertyForm.descriptionArPlaceholder')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Property Details Tab */}
                {activeTab === 'details' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.propertyDetails')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Select
                                label={t('dashboard.propertyForm.propertyType')}
                                required
                                name="PropertyTypeId"
                                value={formik.values.PropertyTypeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.PropertyTypeId && formik.errors.PropertyTypeId}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...propertyTypes.map(type => ({
                                        value: type.id,
                                        label: `${type.nameEn} (${type.nameAr})`
                                    }))
                                ]}
                            />
                            <Select
                                label={t('dashboard.propertyForm.transactionType')}
                                required
                                name="TransactionTypeId"
                                value={formik.values.TransactionTypeId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.TransactionTypeId && formik.errors.TransactionTypeId}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...transactionTypes.map(type => ({
                                        value: type.id,
                                        label: `${type.nameEn} (${type.nameAr})`
                                    }))
                                ]}
                            />
                            <Select
                                label={t('dashboard.propertyForm.propertyStatus')}
                                name="PropertyStatusId"
                                value={formik.values.PropertyStatusId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.PropertyStatusId && formik.errors.PropertyStatusId}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...propertyStatuses.map(status => ({
                                        value: status.id,
                                        label: `${status.nameEn} (${status.nameAr})`
                                    }))
                                ]}
                            />
                            <Input
                                label={
                                    <div className="flex items-center gap-2">
                                        <FiDollarSign className="w-4 h-4" />
                                        <span>{t('dashboard.propertyForm.price')}</span>
                                    </div>
                                }
                                type="number"
                                required
                                name="Price"
                                value={formik.values.Price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Price && formik.errors.Price}
                                placeholder={t('dashboard.propertyForm.pricePlaceholder')}
                            />
                            <Input
                                label={
                                    <div className="flex items-center gap-2">
                                        <FiMaximize2 className="w-4 h-4" />
                                        <span>{t('dashboard.propertyForm.area')}</span>
                                        <InfoIcon title="Square meters" />
                                    </div>
                                }
                                type="number"
                                required
                                name="Area"
                                value={formik.values.Area}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Area && formik.errors.Area}
                                placeholder={t('dashboard.propertyForm.areaPlaceholder')}
                            />
                            <Input
                                label={t('dashboard.propertyForm.bedrooms')}
                                type="number"
                                name="Bedrooms"
                                value={formik.values.Bedrooms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Bedrooms && formik.errors.Bedrooms}
                                placeholder={t('dashboard.propertyForm.bedroomsPlaceholder')}
                            />
                            <Input
                                label={t('dashboard.propertyForm.bathrooms')}
                                type="number"
                                name="Bathrooms"
                                value={formik.values.Bathrooms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Bathrooms && formik.errors.Bathrooms}
                                placeholder={t('dashboard.propertyForm.bathroomsPlaceholder')}
                            />
                            <Select
                                label={t('dashboard.propertyForm.finishingLevel')}
                                name="FinishingLevelId"
                                value={formik.values.FinishingLevelId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.FinishingLevelId && formik.errors.FinishingLevelId}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...finishingLevels.map(level => ({
                                        value: level.id,
                                        label: `${level.nameEn} (${level.nameAr})`
                                    }))
                                ]}
                            />
                            <Select
                                label={t('dashboard.propertyForm.furnishingStatus')}
                                name="FurnishingStatusId"
                                value={formik.values.FurnishingStatusId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.FurnishingStatusId && formik.errors.FurnishingStatusId}
                                options={[
                                    { value: '', label: t('common.select') },
                                    ...furnishingStatuses.map(status => ({
                                        value: status.id,
                                        label: `${status.nameEn} (${status.nameAr})`
                                    }))
                                ]}
                            />
                        </div>
                    </div>
                )}

                {/* Location Tab */}
                {activeTab === 'location' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.location')}
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('dashboard.propertyForm.cityEn')}
                                    name="Location.CityEn"
                                    value={formik.values.Location.CityEn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.CityEn && formik.errors.Location?.CityEn}
                                    placeholder={t('dashboard.propertyForm.cityEnPlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.cityAr')}
                                    name="Location.CityAr"
                                    value={formik.values.Location.CityAr}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.CityAr && formik.errors.Location?.CityAr}
                                    placeholder={t('dashboard.propertyForm.cityArPlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.areaEn')}
                                    name="Location.AreaEn"
                                    value={formik.values.Location.AreaEn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.AreaEn && formik.errors.Location?.AreaEn}
                                    placeholder={t('dashboard.propertyForm.areaEnPlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.areaAr')}
                                    name="Location.AreaAr"
                                    value={formik.values.Location.AreaAr}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.AreaAr && formik.errors.Location?.AreaAr}
                                    placeholder={t('dashboard.propertyForm.areaArPlaceholder')}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('dashboard.propertyForm.addressEn')}
                                    required
                                    name="Location.AddressEn"
                                    value={formik.values.Location.AddressEn}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.AddressEn && formik.errors.Location?.AddressEn}
                                    placeholder={t('dashboard.propertyForm.addressEnPlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.addressAr')}
                                    required
                                    name="Location.AddressAr"
                                    value={formik.values.Location.AddressAr}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.AddressAr && formik.errors.Location?.AddressAr}
                                    placeholder={t('dashboard.propertyForm.addressArPlaceholder')}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label={t('dashboard.propertyForm.latitude')}
                                    type="number"
                                    step="any"
                                    name="Location.Latitude"
                                    value={formik.values.Location.Latitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.Latitude && formik.errors.Location?.Latitude}
                                    placeholder={t('dashboard.propertyForm.latitudePlaceholder')}
                                />
                                <Input
                                    label={t('dashboard.propertyForm.longitude')}
                                    type="number"
                                    step="any"
                                    name="Location.Longitude"
                                    value={formik.values.Location.Longitude}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.Location?.Longitude && formik.errors.Location?.Longitude}
                                    placeholder={t('dashboard.propertyForm.longitudePlaceholder')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Features Tab */}
                {activeTab === 'features' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.features')}
                        </h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Checkbox
                                    label={t('dashboard.propertyForm.parking')}
                                    name="HasParking"
                                    checked={formik.values.HasParking}
                                    onChange={formik.handleChange}
                                />
                                <Checkbox
                                    label={t('dashboard.propertyForm.elevator')}
                                    name="HasElevator"
                                    checked={formik.values.HasElevator}
                                    onChange={formik.handleChange}
                                />
                                <Checkbox
                                    label={t('dashboard.propertyForm.pool')}
                                    name="HasPool"
                                    checked={formik.values.HasPool}
                                    onChange={formik.handleChange}
                                />
                                <Checkbox
                                    label={t('dashboard.propertyForm.garden')}
                                    name="HasGarden"
                                    checked={formik.values.HasGarden}
                                    onChange={formik.handleChange}
                                />
                                <Checkbox
                                    label={t('dashboard.propertyForm.security')}
                                    name="HasSecurity"
                                    checked={formik.values.HasSecurity}
                                    onChange={formik.handleChange}
                                />
                                <Checkbox
                                    label={t('dashboard.propertyForm.groundFloor')}
                                    name="IsGroundFloor"
                                    checked={formik.values.IsGroundFloor}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            <div className="max-w-xs">
                                <Input
                                    label={t('dashboard.propertyForm.totalFloors')}
                                    type="number"
                                    name="TotalFloors"
                                    value={formik.values.TotalFloors}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.TotalFloors && formik.errors.TotalFloors}
                                    placeholder={t('dashboard.propertyForm.totalFloorsPlaceholder')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.images')}
                        </h2>
                        <div className="space-y-8">
                            {/* Image Requirement Alert */}
                            <Alert variant={hasImages ? "success" : "warning"}>
                                <div className="flex items-center justify-between">
                                    <span>
                                        {hasImages
                                            ? `${totalImages} ${t('dashboard.propertyForm.imagesUploaded')}`
                                            : t('dashboard.propertyForm.imagesRequired')
                                        }
                                    </span>
                                    {images.length > 0 && (
                                        <span className="text-sm">
                                            Total size: {totalImageSizeMB}MB
                                        </span>
                                    )}
                                </div>
                            </Alert>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900   mb-4">
                                        {t('dashboard.propertyForm.existingImages')}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {existingImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image.imageUrl}
                                                    alt={`Property ${index + 1}`}
                                                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingImage(index)}
                                                    className="absolute top-2 inset-e-2 p-2 bg-error-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                                                    title={t('common.remove')}
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Images */}
                            {images.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900   mb-4">
                                        {t('dashboard.propertyForm.newImages')}
                                        <span className="text-sm font-normal text-neutral-500   ms-2">
                                            ({images.length} {t('dashboard.propertyForm.imagesSelected')})
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-40 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="absolute bottom-2 inset-s-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                    {(image.size / 1024 / 1024).toFixed(2)}MB
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 inset-e-2 p-2 bg-error-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600"
                                                    title={t('common.remove')}
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-secondary-300   rounded-xl p-8 hover:border-primary-500   transition-colors">
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <FiUpload className="w-12 h-12 text-neutral-400  0 mb-4" />
                                    <span className="text-lg font-medium text-neutral-700   mb-2">
                                        {t('dashboard.propertyForm.uploadImages')}
                                    </span>
                                    <span className="text-sm text-neutral-500   text-center mb-2">
                                        {t('dashboard.propertyForm.uploadDescription')}
                                    </span>
                                    <span className="text-xs text-neutral-400  0 text-center mb-4">
                                        Images larger than 2MB will be automatically compressed
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isCompressing}
                                    />
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => document.querySelector('input[type="file"]').click()}
                                        disabled={isCompressing}
                                    >
                                        {isCompressing ? 'Processing...' : t('dashboard.propertyForm.browseFiles')}
                                    </Button>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="bg-white   rounded-xl shadow-sm border border-secondary-200   p-6">
                        <h2 className="text-xl font-bold text-neutral-900   mb-6">
                            {t('dashboard.propertyForm.publishSettings')}
                        </h2>
                        <div className="space-y-6">
                            <Checkbox
                                label={
                                    <div className="flex items-center gap-2">
                                        <FiCheck className="w-4 h-4 text-success-500" />
                                        <span className="font-medium">{t('dashboard.propertyForm.isActive')}</span>
                                        <InfoIcon title={t('dashboard.propertyForm.isActiveTooltip')} />
                                    </div>
                                }
                                name="IsActive"
                                checked={formik.values.IsActive}
                                onChange={formik.handleChange}
                            />

                            {/* Summary */}
                            <div className="border-t border-secondary-200   pt-6 mt-6">
                                <h4 className="text-lg font-semibold text-neutral-900   mb-4">
                                    {t('dashboard.propertyForm.summary')}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm text-neutral-600">
                                            {t('dashboard.propertyForm.totalImages')}:
                                            <span className="font-medium text-neutral-900   ms-2">
                                                {totalImages}
                                            </span>
                                        </p>
                                        <p className="text-sm text-neutral-600">
                                            {t('dashboard.propertyForm.featuresCount')}:
                                            <span className="font-medium text-neutral-900   ms-2">
                                                {featuresCount}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-neutral-600">
                                            {t('dashboard.propertyForm.formValid')}:
                                            <span className={`font-medium ms-2 ${formik.isValid ? 'text-success-500' : 'text-error-500'}`}>
                                                {formik.isValid ? t('common.yes') : t('common.no')}
                                            </span>
                                        </p>
                                        <p className="text-sm text-neutral-600">
                                            {t('dashboard.propertyForm.imagesValid')}:
                                            <span className={`font-medium ms-2 ${hasImages ? 'text-success-500' : 'text-error-500'}`}>
                                                {hasImages ? t('common.yes') : t('common.no')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Validation Summary */}
            {Object.keys(formik.errors).length > 0 && (
                <Alert variant="warning">
                    <div className="space-y-1">
                        <p className="font-medium">{t('dashboard.propertyForm.validationIssues')}:</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {Object.entries(formik.errors).slice(0, 5).map(([key, error]) => {
                                if (typeof error === 'object' && error !== null) {
                                    return Object.entries(error).map(([nestedKey, nestedError]) => (
                                        <li key={`${key}.${nestedKey}`} className="text-neutral-700">
                                            {nestedError}
                                        </li>
                                    ));
                                }
                                return (
                                    <li key={key} className="text-neutral-700">
                                        {error}
                                    </li>
                                );
                            })}
                        </ul>
                        {Object.keys(formik.errors).length > 5 && (
                            <p className="text-sm text-neutral-600   mt-2">
                                ...and {Object.keys(formik.errors).length - 5} more issues
                            </p>
                        )}
                    </div>
                </Alert>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (tabs.findIndex(t => t.id === activeTab) > 0) {
                            const prevTab = tabs[tabs.findIndex(t => t.id === activeTab) - 1].id;
                            setActiveTab(prevTab);
                        }
                    }}
                    disabled={activeTab === 'basic'}
                    type="button"
                >
                    {t('common.previous')}
                </Button>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-500">
                        {t('dashboard.propertyForm.step')} {tabs.findIndex(t => t.id === activeTab) + 1} {t('common.of')} {tabs.length}
                    </span>
                </div>

                <Button
                    variant="secondary"
                    onClick={() => {
                        if (tabs.findIndex(t => t.id === activeTab) < tabs.length - 1) {
                            const nextTab = tabs[tabs.findIndex(t => t.id === activeTab) + 1].id;
                            setActiveTab(nextTab);
                        }
                    }}
                    disabled={activeTab === 'settings'}
                    type="button"
                >
                    {t('common.next')}
                </Button>
            </div>

            {/* Final Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                    variant="secondary"
                    leftIcon={<FiX />}
                    onClick={() => navigate('/dashboard/properties')}
                    type="button"
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    variant="primary"
                    leftIcon={<FiSave />}
                    loading={operationLoading}
                    type="submit"
                    disabled={!formik.isValid || operationLoading || !hasImages || isCompressing}
                >
                    {isEdit ? t('common.update') : t('common.save')} {t('common.property')}
                </Button>
            </div>
        </form>
    );
}