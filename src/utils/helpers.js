
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatArea = (area) => {
    return new Intl.NumberFormat('en-US').format(area);
};

export const filterProperties = (
    properties,
    filters
) => {
    return properties.filter((property) => {
        // Type filter
        if (filters.type && filters.type.length > 0) {
            if (!filters.type.includes(property.type)) return false;
        }

        // Status filter
        if (filters.status && filters.status.length > 0) {
            if (!filters.status.includes(property.status)) return false;
        }

        // Price range
        if (filters.minPrice && property.price < filters.minPrice) return false;
        if (filters.maxPrice && property.price > filters.maxPrice) return false;

        // Bedrooms
        if (
            filters.minBedrooms &&
            property.features.bedrooms < filters.minBedrooms
        )
            return false;
        if (
            filters.maxBedrooms &&
            property.features.bedrooms > filters.maxBedrooms
        )
            return false;

        // Bathrooms
        if (
            filters.minBathrooms &&
            property.features.bathrooms < filters.minBathrooms
        )
            return false;
        if (
            filters.maxBathrooms &&
            property.features.bathrooms > filters.maxBathrooms
        )
            return false;

        // Area
        if (filters.minArea && property.features.area < filters.minArea)
            return false;
        if (filters.maxArea && property.features.area > filters.maxArea)
            return false;

        // City filter
        if (filters.city && filters.city.length > 0) {
            if (!filters.city.includes(property.location.city)) return false;
        }

        // State filter
        if (filters.state && filters.state.length > 0) {
            if (!filters.state.includes(property.location.state)) return false;
        }

        // Amenities filter
        if (filters.amenities && filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every((amenity) =>
                property.amenities.includes(amenity)
            );
            if (!hasAllAmenities) return false;
        }

        // Search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const searchableText = `
        ${property.title}
        ${property.description}
        ${property.location.address}
        ${property.location.city}
        ${property.location.state}
      `.toLowerCase();

            if (!searchableText.includes(query)) return false;
        }

        return true;
    });
};

export const calculateMortgage = (
    price,
    downPaymentPercent = 20,
    interestRate = 6.5,
    years = 30
) => {
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = years * 12;

    const monthlyPayment =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return Math.round(monthlyPayment);
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};