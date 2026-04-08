import * as Yup from 'yup';

export const propertyFormSchema = Yup.object({
    // Basic Information
    titleEn: Yup.string()
        .required('English title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be less than 200 characters'),
    titleAr: Yup.string()
        .min(3, 'Arabic title must be at least 3 characters')
        .max(200, 'Arabic title must be less than 200 characters'),
    descriptionEn: Yup.string()
        .max(2000, 'Description must be less than 2000 characters'),
    descriptionAr: Yup.string()
        .max(2000, 'Arabic description must be less than 2000 characters'),

    // Property Details
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be positive')
        .typeError('Price must be a number'),
    area: Yup.number()
        .required('Area is required')
        .min(1, 'Area must be at least 1 sq ft')
        .typeError('Area must be a number'),
    bedrooms: Yup.number()
        .min(0, 'Bedrooms must be 0 or more')
        .integer('Bedrooms must be a whole number')
        .nullable()
        .transform(value => (isNaN(value) ? undefined : value)),
    bathrooms: Yup.number()
        .min(0, 'Bathrooms must be 0 or more')
        .nullable()
        .transform(value => (isNaN(value) ? undefined : value)),
    propertyTypeId: Yup.number()
        .required('Property type is required')
        .min(1, 'Please select a property type')
        .typeError('Property type is required'),
    transactionTypeId: Yup.number()
        .required('Transaction type is required')
        .min(1, 'Please select a transaction type')
        .typeError('Transaction type is required'),
    propertyStatusId: Yup.number()
        .nullable()
        .transform(value => (value === '' ? null : value)),
    finishingLevelId: Yup.number()
        .nullable()
        .transform(value => (value === '' ? null : value)),
    furnishingStatusId: Yup.number()
        .nullable()
        .transform(value => (value === '' ? null : value)),

    // Location
    location: Yup.object({
        cityEn: Yup.string()
            .min(2, 'City name must be at least 2 characters')
            .max(100, 'City name must be less than 100 characters'),
        cityAr: Yup.string()
            .min(2, 'Arabic city name must be at least 2 characters')
            .max(100, 'Arabic city name must be less than 100 characters'),
        areaEn: Yup.string()
            .min(2, 'Area name must be at least 2 characters')
            .max(100, 'Area name must be less than 100 characters'),
        areaAr: Yup.string()
            .min(2, 'Arabic area name must be at least 2 characters')
            .max(100, 'Arabic area name must be less than 100 characters'),
        address: Yup.string()
            .max(500, 'Address must be less than 500 characters'),
        latitude: Yup.number()
            .nullable()
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90')
            .transform(value => (value === '' ? null : value)),
        longitude: Yup.number()
            .nullable()
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180')
            .transform(value => (value === '' ? null : value)),
    }),

    // Features
    features: Yup.object({
        hasParking: Yup.boolean(),
        hasElevator: Yup.boolean(),
        hasPool: Yup.boolean(),
        hasGarden: Yup.boolean(),
        hasSecurity: Yup.boolean(),
        isGroundFloor: Yup.boolean(),
        totalFloors: Yup.number()
            .min(0, 'Total floors must be 0 or more')
            .integer('Total floors must be a whole number')
            .nullable()
            .transform(value => (value === '' ? null : value)),
    }),

    // Status
    isActive: Yup.boolean(),

    // Images validation (will be handled separately)
    images: Yup.mixed(),
});

;