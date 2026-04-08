// utils/metaPixelTracking.js

/**
 * Comprehensive Meta Pixel Tracking Utility
 * Tracks all user interactions across the website
 */

// Check if Meta Pixel is loaded
const isPixelLoaded = () => typeof window !== 'undefined' && window.fbq;

/**
 * Track standard Meta Pixel events
 * @param {string} eventName - Standard event name (e.g., 'Purchase', 'AddToCart', 'Lead')
 * @param {object} parameters - Optional event parameters
 */
export const trackStandardEvent = (eventName, parameters = {}) => {
    if (isPixelLoaded()) {
        window.fbq('track', eventName, parameters);
        console.log(`[Meta Pixel] Standard Event: ${eventName}`, parameters);
    } else {
        console.warn(`[Meta Pixel] Not loaded - Event: ${eventName}`);
    }
};

/**
 * Track custom Meta Pixel events
 * @param {string} eventName - Custom event name
 * @param {object} parameters - Optional event parameters
 */
export const trackCustomEvent = (eventName, parameters = {}) => {
    if (isPixelLoaded()) {
        window.fbq('trackCustom', eventName, parameters);
        console.log(`[Meta Pixel] Custom Event: ${eventName}`, parameters);
    } else {
        console.warn(`[Meta Pixel] Not loaded - Custom Event: ${eventName}`);
    }
};

/**
 * Track page views with detailed parameters
 */
export const trackPageView = (pageName, additionalParams = {}) => {
    trackStandardEvent('PageView', {
        page_name: pageName,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        ...additionalParams
    });
};

/**
 * Comprehensive event tracking object
 * Organized by category for easy maintenance
 */
export const metaPixelEvents = {

    // ==================== PAGE EVENTS ====================

    pageView: (pageName, additionalParams = {}) => {
        trackStandardEvent('PageView', {
            page_name: pageName,
            page_url: window.location.href,
            page_path: window.location.pathname,
            referrer: document.referrer,
            ...additionalParams
        });
    },

    // ==================== NAVIGATION EVENTS ====================

    navClick: (linkText, destination, location = 'header') => {
        trackCustomEvent('NavClick', {
            link_text: linkText,
            destination: destination,
            location: location,
            timestamp: new Date().toISOString()
        });
    },

    footerNavClick: (linkText, destination) => {
        trackCustomEvent('FooterNavClick', {
            link_text: linkText,
            destination: destination,
            section: 'footer'
        });
    },

    logoClick: (location = 'header') => {
        trackCustomEvent('LogoClick', {
            location: location,
            destination: '/'
        });
    },

    // ==================== BUTTON INTERACTIONS ====================

    buttonClick: (buttonName, location, context = {}) => {
        trackCustomEvent('ButtonClick', {
            button_name: buttonName,
            location: location,
            ...context,
            timestamp: new Date().toISOString()
        });
    },

    ctaClick: (ctaName, destination, location) => {
        trackCustomEvent('CTAClick', {
            cta_name: ctaName,
            destination: destination,
            location: location
        });
    },

    // ==================== FORM EVENTS ====================

    formStart: (formName, formType) => {
        trackStandardEvent('InitiateCheckout', {
            content_name: formName,
            content_type: formType
        });
        trackCustomEvent('FormStart', {
            form_name: formName,
            form_type: formType
        });
    },

    formSubmit: (formName, formType, success = true) => {
        trackStandardEvent('Lead', {
            content_name: formName,
            status: success ? 'success' : 'error'
        });
        trackCustomEvent('FormSubmit', {
            form_name: formName,
            form_type: formType,
            status: success ? 'success' : 'error'
        });
    },

    formError: (formName, errorType, errorMessage) => {
        trackCustomEvent('FormError', {
            form_name: formName,
            error_type: errorType,
            error_message: errorMessage
        });
    },

    // ==================== PROPERTY/REAL ESTATE SPECIFIC ====================

    viewProperty: (propertyId, propertyName, propertyType, price, currency = 'USD') => {
        trackStandardEvent('ViewContent', {
            content_ids: [propertyId],
            content_name: propertyName,
            content_type: propertyType,
            value: price,
            currency: currency
        });
    },

    viewProject: (projectId, projectName, stageCount) => {
        trackStandardEvent('ViewContent', {
            content_ids: [projectId],
            content_name: projectName,
            content_type: 'project',
            stage_count: stageCount
        });
    },

    viewUnitModel: (unitId, unitName, stageName, price, area, bedrooms, bathrooms) => {
        trackStandardEvent('ViewContent', {
            content_ids: [unitId],
            content_name: unitName,
            content_type: 'unit_model',
            stage_name: stageName,
            value: price,
            area: area,
            bedrooms: bedrooms,
            bathrooms: bathrooms
        });
    },

    propertySearch: (searchQuery, filters = {}) => {
        trackStandardEvent('Search', {
            search_string: searchQuery,
            ...filters
        });
    },

    filterProperties: (filterType, filterValue) => {
        trackCustomEvent('FilterProperties', {
            filter_type: filterType,
            filter_value: filterValue
        });
    },

    sortProperties: (sortBy, sortOrder) => {
        trackCustomEvent('SortProperties', {
            sort_by: sortBy,
            sort_order: sortOrder
        });
    },

    // ==================== CONTACT & LEAD EVENTS ====================

    contact: (contactMethod, context = {}) => {
        trackStandardEvent('Contact', {
            method: contactMethod,
            ...context
        });
    },

    phoneClick: (phoneNumber, location) => {
        trackCustomEvent('PhoneClick', {
            phone_number: phoneNumber,
            location: location
        });
        trackStandardEvent('Contact', { method: 'phone' });
    },

    emailClick: (email, location) => {
        trackCustomEvent('EmailClick', {
            email: email,
            location: location
        });
        trackStandardEvent('Contact', { method: 'email' });
    },

    whatsappClick: (phoneNumber, location) => {
        trackCustomEvent('WhatsAppClick', {
            phone_number: phoneNumber,
            location: location
        });
        trackStandardEvent('Contact', { method: 'whatsapp' });
    },

    // ==================== E-COMMERCE EVENTS ====================

    addToCart: (productName, productId, value, currency = 'USD') => {
        trackStandardEvent('AddToCart', {
            content_name: productName,
            content_ids: [productId],
            content_type: 'product',
            value: value,
            currency: currency
        });
    },

    initiateCheckout: (value, currency = 'USD', numItems = 1) => {
        trackStandardEvent('InitiateCheckout', {
            value: value,
            currency: currency,
            num_items: numItems
        });
    },

    purchase: (value, currency = 'USD', orderId, products = []) => {
        trackStandardEvent('Purchase', {
            value: value,
            currency: currency,
            order_id: orderId,
            content_type: 'product',
            content_ids: products.map(p => p.id),
            num_items: products.length
        });
    },

    // ==================== USER ENGAGEMENT ====================

    scrollDepth: (percentage, pageName) => {
        trackCustomEvent('ScrollDepth', {
            percentage: percentage,
            page_name: pageName
        });
    },

    timeOnPage: (seconds, pageName) => {
        trackCustomEvent('TimeOnPage', {
            seconds: seconds,
            page_name: pageName
        });
    },

    videoPlay: (videoName, videoId) => {
        trackStandardEvent('StartTrial', {
            content_name: videoName,
            content_ids: [videoId]
        });
    },

    downloadResource: (resourceName, resourceType) => {
        trackStandardEvent('CompleteRegistration', {
            content_name: resourceName,
            content_type: resourceType
        });
    },

    // ==================== SOCIAL EVENTS ====================

    socialShare: (platform, contentType, contentId) => {
        trackCustomEvent('SocialShare', {
            platform: platform,
            content_type: contentType,
            content_id: contentId
        });
    },

    socialClick: (platform, url, location) => {
        trackCustomEvent('SocialMediaClick', {
            platform: platform,
            url: url,
            location: location
        });
    },

    // ==================== TESTIMONIAL EVENTS ====================

    testimonialSubmit: (rating, hasComment) => {
        trackStandardEvent('CompleteRegistration', {
            content_name: 'Testimonial Submission',
            rating: rating,
            has_comment: hasComment
        });
    },

    testimonialView: (testimonialId, authorName) => {
        trackCustomEvent('TestimonialView', {
            testimonial_id: testimonialId,
            author_name: authorName
        });
    },

    // ==================== AUTHENTICATION EVENTS ====================

    login: (method = 'email', success = true) => {
        trackStandardEvent('CompleteRegistration', {
            registration_method: method,
            status: success ? 'success' : 'error'
        });
    },

    logout: () => {
        trackCustomEvent('Logout', {
            timestamp: new Date().toISOString()
        });
    },

    // ==================== ERROR TRACKING ====================

    error: (errorType, errorMessage, pageName) => {
        trackCustomEvent('Error', {
            error_type: errorType,
            error_message: errorMessage,
            page_name: pageName,
            timestamp: new Date().toISOString()
        });
    },

    // ==================== EXTERNAL LINKS ====================

    externalLinkClick: (linkName, destination, location) => {
        trackCustomEvent('ExternalLinkClick', {
            link_name: linkName,
            destination: destination,
            location: location
        });
    }
};

// Export individual functions for convenience
export const {
    pageView,
    navClick,
    footerNavClick,
    logoClick,
    buttonClick,
    ctaClick,
    formStart,
    formSubmit,
    formError,
    viewProperty,
    viewProject,
    viewUnitModel,
    propertySearch,
    filterProperties,
    sortProperties,
    contact,
    phoneClick,
    emailClick,
    whatsappClick,
    addToCart,
    initiateCheckout,
    purchase,
    scrollDepth,
    timeOnPage,
    videoPlay,
    downloadResource,
    socialShare,
    socialClick,
    testimonialSubmit,
    testimonialView,
    login,
    logout,
    error,
    externalLinkClick
} = metaPixelEvents;

export default metaPixelEvents;