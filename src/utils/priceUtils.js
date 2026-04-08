/**
 * Price Utilities
 * Reusable utility functions for formatting prices across the application
 */

/**
 * Format price in EGP with K/M abbreviations
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @param {string|Function} options.currency - Currency symbol/code or translation function (default: 'EGP')
 * @param {boolean} options.showCurrency - Whether to show currency (default: true)
 * @param {number} options.decimals - Number of decimal places for M/K values (default: 1 for millions, 0 for thousands)
 * @param {string} options.locale - Locale for number formatting (default: 'en-US')
 * @param {Function} options.t - Translation function (i18next t function)
 * @returns {string|null} Formatted price string or null if price is invalid
 * 
 * @example
 * formatPrice(1500000) // "1.5M EGP"
 * formatPrice(50000) // "50K EGP"
 * formatPrice(500) // "500 EGP"
 * formatPrice(1500000, { showCurrency: false }) // "1.5M"
 * formatPrice(1500000, { currency: 'USD' }) // "1.5M USD"
 * formatPrice(1500000, { t: t, currency: 'models.currency' }) // "1.5M جنيه" (if Arabic)
 */
export const formatPrice = (price, options = {}) => {
    const {
        currency = 'EGP',
        showCurrency = true,
        decimals = null,
        locale = 'en-US',
        t = null
    } = options;

    // Return null for invalid prices
    if (!price || price <= 0 || isNaN(price)) {
        return null;
    }

    let formattedNumber;

    // Format millions
    if (price >= 1000000) {
        const millionValue = price / 1000000;
        const decimalPlaces = decimals !== null ? decimals : 1;
        formattedNumber = `${millionValue.toFixed(decimalPlaces)}M`;
    }
    // Format thousands
    else if (price >= 1000) {
        const thousandValue = price / 1000;
        const decimalPlaces = decimals !== null ? decimals : 0;
        formattedNumber = `${thousandValue.toFixed(decimalPlaces)}K`;
    }
    // Format regular numbers
    else {
        formattedNumber = price.toLocaleString(locale);
    }

    // Add currency if requested
    if (showCurrency) {
        // If translation function is provided and currency looks like a translation key
        const currencyText = (t && currency.includes('.'))
            ? t(currency)
            : currency;
        return `${formattedNumber} ${currencyText}`;
    }

    return formattedNumber;
};

/**
 * Format price with full number display (no abbreviations)
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @param {string|Function} options.currency - Currency symbol/code or translation key (default: 'EGP')
 * @param {boolean} options.showCurrency - Whether to show currency (default: true)
 * @param {string} options.locale - Locale for number formatting (default: 'en-US')
 * @param {Function} options.t - Translation function (i18next t function)
 * @returns {string|null} Formatted price string or null if price is invalid
 * 
 * @example
 * formatPriceFull(1500000) // "1,500,000 EGP"
 * formatPriceFull(50000) // "50,000 EGP"
 * formatPriceFull(1500000, { t: t, currency: 'models.currency' }) // "1,500,000 جنيه"
 */
export const formatPriceFull = (price, options = {}) => {
    const {
        currency = 'EGP',
        showCurrency = true,
        locale = 'en-US',
        t = null
    } = options;

    if (!price || price <= 0 || isNaN(price)) {
        return null;
    }

    const formattedNumber = price.toLocaleString(locale);

    if (showCurrency) {
        const currencyText = (t && currency.includes('.'))
            ? t(currency)
            : currency;
        return `${formattedNumber} ${currencyText}`;
    }

    return formattedNumber;
};

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {Object} options - Formatting options (same as formatPrice)
 * @returns {string|null} Formatted price range string
 * 
 * @example
 * formatPriceRange(500000, 1500000) // "500K - 1.5M EGP"
 * formatPriceRange(50000, 100000) // "50K - 100K EGP"
 */
export const formatPriceRange = (minPrice, maxPrice, options = {}) => {
    const formattedMin = formatPrice(minPrice, { ...options, showCurrency: false });
    const formattedMax = formatPrice(maxPrice, options);

    if (!formattedMin || !formattedMax) {
        return null;
    }

    return `${formattedMin} - ${formattedMax}`;
};

/**
 * Get price display with per-period suffix (for rent)
 * @param {number} price - The price to format
 * @param {string} period - Time period ('month', 'year', 'day', etc.) or translation key
 * @param {Object} options - Formatting options (same as formatPrice)
 * @param {Function} options.t - Translation function for period translation
 * @returns {string|null} Formatted price with period
 * 
 * @example
 * formatPriceWithPeriod(5000, 'month') // "5K EGP/month"
 * formatPriceWithPeriod(60000, 'year') // "60K EGP/year"
 * formatPriceWithPeriod(5000, 'models.period.month', { t: t }) // "5K جنيه/شهر"
 */
export const formatPriceWithPeriod = (price, period = 'month', options = {}) => {
    const { t } = options;
    const formattedPrice = formatPrice(price, options);

    if (!formattedPrice) {
        return null;
    }

    // Translate period if translation function provided and period looks like a key
    const periodText = (t && period.includes('.'))
        ? t(period)
        : period;

    return `${formattedPrice}/${periodText}`;
};

/**
 * Parse abbreviated price string back to number
 * @param {string} priceString - Price string like "1.5M EGP" or "50K"
 * @returns {number|null} Parsed price number or null if invalid
 * 
 * @example
 * parsePrice("1.5M EGP") // 1500000
 * parsePrice("50K") // 50000
 * parsePrice("500 EGP") // 500
 */
export const parsePrice = (priceString) => {
    if (!priceString || typeof priceString !== 'string') {
        return null;
    }

    // Remove currency and whitespace
    const cleaned = priceString.replace(/[A-Z]{3}|\s/g, '').trim();

    // Handle millions
    if (cleaned.endsWith('M')) {
        return parseFloat(cleaned.replace('M', '')) * 1000000;
    }

    // Handle thousands
    if (cleaned.endsWith('K')) {
        return parseFloat(cleaned.replace('K', '')) * 1000;
    }

    // Handle regular numbers (remove commas)
    return parseFloat(cleaned.replace(/,/g, ''));
};

/**
 * Format price for Arabic locales (RTL support)
 * @param {number} price - The price to format
 * @param {Object} options - Formatting options
 * @returns {string|null} Formatted price in Arabic locale
 * 
 * @example
 * formatPriceArabic(1500000) // "١٫٥ مليون جنيه"
 */
export const formatPriceArabic = (price, options = {}) => {
    const {
        currency = 'جنيه',
        showCurrency = true,
        decimals = null
    } = options;

    if (!price || price <= 0 || isNaN(price)) {
        return null;
    }

    let formattedNumber;

    // Format millions (مليون)
    if (price >= 1000000) {
        const millionValue = price / 1000000;
        const decimalPlaces = decimals !== null ? decimals : 1;
        const arabicNumber = millionValue.toFixed(decimalPlaces).toLocaleString('ar-EG');
        formattedNumber = `${arabicNumber} مليون`;
    }
    // Format thousands (ألف)
    else if (price >= 1000) {
        const thousandValue = price / 1000;
        const decimalPlaces = decimals !== null ? decimals : 0;
        const arabicNumber = thousandValue.toFixed(decimalPlaces).toLocaleString('ar-EG');
        formattedNumber = `${arabicNumber} ألف`;
    }
    // Format regular numbers
    else {
        formattedNumber = price.toLocaleString('ar-EG');
    }

    return showCurrency ? `${formattedNumber} ${currency}` : formattedNumber;
};

/**
 * Get compact price format (shortest possible)
 * @param {number} price - The price to format
 * @returns {string|null} Ultra-compact price format
 * 
 * @example
 * formatPriceCompact(1500000) // "1.5M"
 * formatPriceCompact(50000) // "50K"
 */
export const formatPriceCompact = (price) => {
    return formatPrice(price, { showCurrency: false });
};

// Default export object with all functions
export default {
    formatPrice,
    formatPriceFull,
    formatPriceRange,
    formatPriceWithPeriod,
    parsePrice,
    formatPriceArabic,
    formatPriceCompact
};