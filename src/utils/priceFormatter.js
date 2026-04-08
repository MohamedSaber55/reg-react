/**
 * Utility functions for price formatting and display
 */

/**
 * Format price with EGP currency and appropriate scaling
 * @param {number|string} price - The price to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeCurrency - Whether to include EGP suffix (default: true)
 * @param {string} options.currency - Currency symbol (default: 'EGP')
 * @param {boolean} options.compact - Use compact notation (K, M) (default: true)
 * @param {number} options.decimals - Number of decimal places (default: 0 for whole numbers, 1 for K/M)
 * @param {boolean} options.useCommas - Use thousand separators (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, options = {}) => {
    const {
        includeCurrency = true,
        currency = 'EGP',
        compact = true,
        decimals = 0,
        useCommas = true
    } = options;

    // Handle null, undefined, or invalid prices
    if (price === null || price === undefined || isNaN(Number(price))) {
        return includeCurrency ? `N/A ${currency}` : 'N/A';
    }

    const numericPrice = Number(price);

    // Handle zero price
    if (numericPrice === 0) {
        return includeCurrency ? `0 ${currency}` : '0';
    }

    // Compact notation (K, M)
    if (compact) {
        if (Math.abs(numericPrice) >= 1000000) {
            const value = (numericPrice / 1000000).toFixed(1);
            const formatted = useCommas ?
                Number(value).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) :
                value;
            return includeCurrency ? `${formatted}M ${currency}` : `${formatted}M`;
        }

        if (Math.abs(numericPrice) >= 1000) {
            const value = (numericPrice / 1000).toFixed(decimals);
            const formatted = useCommas ?
                Number(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) :
                value;
            return includeCurrency ? `${formatted}K ${currency}` : `${formatted}K`;
        }
    }

    // Full number formatting
    if (useCommas) {
        const formatted = numericPrice.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        return includeCurrency ? `${formatted} ${currency}` : formatted;
    }

    // Without commas
    const formatted = numericPrice.toFixed(decimals);
    return includeCurrency ? `${formatted} ${currency}` : formatted;
};

/**
 * Format price range (min - max)
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, options = {}) => {
    if (!minPrice && !maxPrice) return 'Price on request';

    if (!maxPrice) return formatPrice(minPrice, options);
    if (!minPrice) return `Up to ${formatPrice(maxPrice, options)}`;

    return `${formatPrice(minPrice, { ...options, includeCurrency: false })} - ${formatPrice(maxPrice, options)}`;
};

/**
 * Format price per square meter/feet
 * @param {number} price - Total price
 * @param {number} area - Area in square meters/feet
 * @param {Object} options - Formatting options
 * @param {string} options.unit - Area unit (default: 'm²')
 * @returns {string} Formatted price per unit
 */
export const formatPricePerUnit = (price, area, options = {}) => {
    const { unit = 'm²' } = options;

    if (!price || !area || area === 0) return 'N/A';

    const pricePerUnit = price / area;

    // Round to nearest integer for cleaner display
    const roundedPrice = Math.round(pricePerUnit);

    return `${formatPrice(roundedPrice, options)}/${unit}`;
};

/**
 * Convert price from one currency to another (basic implementation)
 * @param {number} price - Price in source currency
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Object} exchangeRates - Object with exchange rates
 * @returns {number} Converted price
 */
export const convertCurrency = (price, fromCurrency, toCurrency, exchangeRates = {}) => {
    if (fromCurrency === toCurrency) return price;

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const reverseKey = `${toCurrency}_${fromCurrency}`;

    if (exchangeRates[rateKey]) {
        return price * exchangeRates[rateKey];
    } else if (exchangeRates[reverseKey]) {
        return price / exchangeRates[reverseKey];
    }

    // Fallback: Return original price with warning
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    return price;
};

/**
 * Extract numeric value from formatted price string
 * @param {string} formattedPrice - Formatted price string (e.g., "1.5M EGP")
 * @returns {number} Numeric value
 */
export const parsePrice = (formattedPrice) => {
    if (!formattedPrice) return null;

    const match = formattedPrice.match(/([\d.,]+)\s*([KM])?\s*\w*/i);
    if (!match) return null;

    let value = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] ? match[2].toUpperCase() : null;

    if (suffix === 'K') value *= 1000;
    if (suffix === 'M') value *= 1000000;

    return value;
};

/**
 * Get price display configuration based on design theme
 * @param {number} designOption - Design option number
 * @returns {Object} Price display configuration
 */
export const getPriceConfig = (designOption = 1) => {
    const configs = {
        1: { // Modern Cinematic
            format: 'compact',
            decimals: 1,
            useCommas: false,
            className: 'text-primary-500 font-bold'
        },
        2: { // Minimal Brutalist
            format: 'compact',
            decimals: 0,
            useCommas: false,
            className: 'text-primary-600 font-black'
        },
        3: { // Soft Organic
            format: 'compact',
            decimals: 1,
            useCommas: true,
            className: 'bg-linear-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent font-bold'
        },
        4: { // Glass Morphism
            format: 'compact',
            decimals: 1,
            useCommas: false,
            className: 'bg-linear-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-bold'
        }
    };

    return configs[designOption] || configs[1];
};

/**
 * Format price with design-specific styling
 * @param {number} price - Price to format
 * @param {number} designOption - Design option number
 * @returns {Object} { formatted: string, className: string }
 */
export const formatPriceWithDesign = (price, designOption = 1) => {
    const config = getPriceConfig(designOption);
    const formatted = formatPrice(price, {
        compact: config.format === 'compact',
        decimals: config.decimals,
        useCommas: config.useCommas
    });

    return {
        formatted,
        className: config.className
    };
};

export default {
    formatPrice,
    formatPriceRange,
    formatPricePerUnit,
    convertCurrency,
    parsePrice,
    getPriceConfig,
    formatPriceWithDesign
};