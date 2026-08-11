// utils/metaPixelTracking.js

/**
 * Comprehensive Meta Pixel Tracking Utility
 * Tracks all user interactions across the website.
 *
 * Notes on the design:
 * - The pixel is injected at runtime from the dashboard config (see
 *   components/TrackingPixels.jsx), so it is NOT available on first paint.
 *   Events fired before that are queued here and flushed once fbq exists,
 *   instead of being dropped.
 * - Every event carries an `eventID` so the same action sent from a server-side
 *   Conversions API integration can be de-duplicated by Meta.
 * - Parameters are scrubbed of personally identifiable information. Meta
 *   prohibits raw PII in pixel parameters; it belongs in Advanced Matching
 *   (hashed) or the Conversions API.
 */

import { v4 as uuidv4 } from 'uuid';

const DEBUG = import.meta.env.DEV;

/** Default currency for this business (Egypt). */
export const DEFAULT_CURRENCY = 'EGP';

/** Cap the pre-init queue so a broken pixel config can't grow memory forever. */
const MAX_QUEUED_EVENTS = 50;

/**
 * Parameter names that must never be sent to Meta in clear text.
 * Defence in depth — call sites already avoid these.
 */
const PII_KEYS = new Set([
    'email',
    'em',
    'e_mail',
    'phone',
    'phone_number',
    'ph',
    'mobile',
    'first_name',
    'last_name',
    'full_name',
    'fn',
    'ln',
    'address',
    'street',
    'ssn',
    'date_of_birth',
    'dob',
]);

/** Events fired before the pixel script finished loading. */
let pendingEvents = [];

const log = (...args) => {
    if (DEBUG) console.log('[Meta Pixel]', ...args);
};

// Check if Meta Pixel is loaded
const isPixelLoaded = () =>
    typeof window !== 'undefined' && typeof window.fbq === 'function';

/**
 * Drop PII keys and empty values from an event payload.
 * @param {object} parameters
 * @returns {object}
 */
const sanitizeParameters = (parameters = {}) => {
    const clean = {};

    Object.entries(parameters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (PII_KEYS.has(key.toLowerCase())) {
            if (DEBUG) {
                console.warn(
                    `[Meta Pixel] Dropped PII parameter "${key}". Use Advanced Matching or the Conversions API instead.`
                );
            }
            return;
        }

        clean[key] = value;
    });

    return clean;
};

/**
 * Low-level dispatcher. Queues the event when the pixel is not ready yet.
 * @returns {string} the eventID, for Conversions API de-duplication
 */
const dispatch = (method, eventName, parameters = {}) => {
    const payload = sanitizeParameters(parameters);
    const eventID = uuidv4();

    if (!isPixelLoaded()) {
        if (pendingEvents.length < MAX_QUEUED_EVENTS) {
            pendingEvents.push({ method, eventName, payload, eventID });
            log(`Queued (pixel not ready): ${eventName}`, payload);
        }
        return eventID;
    }

    window.fbq(method, eventName, payload, { eventID });
    log(`${method === 'track' ? 'Standard' : 'Custom'} Event: ${eventName}`, payload);

    return eventID;
};

/**
 * Send everything that was queued before the pixel finished loading.
 * Called by TrackingPixels once fbq('init') has run.
 */
export const flushPixelQueue = () => {
    if (!isPixelLoaded() || pendingEvents.length === 0) return;

    const queued = pendingEvents;
    pendingEvents = [];

    queued.forEach(({ method, eventName, payload, eventID }) => {
        window.fbq(method, eventName, payload, { eventID });
        log(`Flushed queued event: ${eventName}`, payload);
    });
};

/**
 * Grant tracking consent (GDPR). Call after the visitor accepts cookies.
 * Only meaningful if consent was revoked first — see revokeTrackingConsent.
 */
export const grantTrackingConsent = () => {
    if (isPixelLoaded()) window.fbq('consent', 'grant');
};

/**
 * Revoke tracking consent (GDPR). Call before init to hold events back until
 * the visitor opts in.
 */
export const revokeTrackingConsent = () => {
    if (isPixelLoaded()) window.fbq('consent', 'revoke');
};

/**
 * Track standard Meta Pixel events
 * @param {string} eventName - Standard event name (e.g., 'Purchase', 'Lead')
 * @param {object} parameters - Optional event parameters
 * @returns {string} eventID
 */
export const trackStandardEvent = (eventName, parameters = {}) =>
    dispatch('track', eventName, parameters);

/**
 * Track custom Meta Pixel events
 * @param {string} eventName - Custom event name
 * @param {object} parameters - Optional event parameters
 * @returns {string} eventID
 */
export const trackCustomEvent = (eventName, parameters = {}) =>
    dispatch('trackCustom', eventName, parameters);

/**
 * Track page views with detailed parameters
 */
export const trackPageView = (pageName, additionalParams = {}) =>
    trackStandardEvent('PageView', {
        page_name: pageName,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        ...additionalParams,
    });

/**
 * Comprehensive event tracking object
 * Organized by category for easy maintenance
 */
export const metaPixelEvents = {

    // Re-exposed so callers holding only this object can reach the primitives.
    trackStandardEvent,
    trackCustomEvent,

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

    navClick: (linkText, destination, location = 'header', context = {}) => {
        trackCustomEvent('NavClick', {
            link_text: linkText,
            destination: destination,
            location: location,
            ...context,
            timestamp: new Date().toISOString()
        });
    },

    footerNavClick: (linkText, destination, context = {}) => {
        trackCustomEvent('FooterNavClick', {
            link_text: linkText,
            destination: destination,
            section: 'footer',
            ...context
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

    ctaClick: (ctaName, destination, location, context = {}) => {
        trackCustomEvent('CTAClick', {
            cta_name: ctaName,
            destination: destination,
            location: location,
            ...context
        });
    },

    // ==================== FORM EVENTS ====================

    /**
     * Fired when the visitor first interacts with a form.
     * Intentionally a custom event — starting a form is not a conversion, and
     * mapping it onto a standard event corrupts campaign optimization.
     */
    formStart: (formName, formType) => {
        trackCustomEvent('FormStart', {
            form_name: formName,
            form_type: formType
        });
    },

    /**
     * Fired on form submission. The standard `Lead` event is only sent on
     * success so failed submissions never inflate conversion counts.
     */
    formSubmit: (formName, formType, success = true) => {
        if (success) {
            trackStandardEvent('Lead', {
                content_name: formName,
                content_category: formType
            });
        }

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

    viewProperty: (propertyId, propertyName, propertyType, price, currency = DEFAULT_CURRENCY) => {
        trackStandardEvent('ViewContent', {
            content_ids: [String(propertyId)],
            content_name: propertyName,
            content_type: 'product',
            content_category: propertyType,
            value: price,
            currency: currency
        });
    },

    viewProject: (projectId, projectName, stageCount) => {
        trackStandardEvent('ViewContent', {
            content_ids: [String(projectId)],
            content_name: projectName,
            content_type: 'product',
            content_category: 'project',
            stage_count: stageCount
        });
    },

    viewStage: (stageId, stageName, projectName, unitCount) => {
        trackStandardEvent('ViewContent', {
            content_ids: [String(stageId)],
            content_name: stageName,
            content_type: 'product',
            content_category: 'stage',
            project_name: projectName,
            unit_count: unitCount
        });
    },

    viewUnitModel: (unitId, unitName, stageName, price, area, bedrooms, bathrooms, currency = DEFAULT_CURRENCY) => {
        trackStandardEvent('ViewContent', {
            content_ids: [String(unitId)],
            content_name: unitName,
            content_type: 'product',
            content_category: 'unit_model',
            stage_name: stageName,
            value: price,
            currency: currency,
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
    //
    // Phone numbers and email addresses are deliberately NOT sent as
    // parameters — Meta prohibits raw PII in pixel payloads.

    contact: (contactMethod, context = {}) => {
        trackStandardEvent('Contact', {
            contact_method: contactMethod,
            ...context
        });
    },

    phoneClick: (location, context = {}) => {
        trackCustomEvent('PhoneClick', { location, ...context });
        trackStandardEvent('Contact', { contact_method: 'phone', ...context });
    },

    emailClick: (location, context = {}) => {
        trackCustomEvent('EmailClick', { location, ...context });
        trackStandardEvent('Contact', { contact_method: 'email', ...context });
    },

    whatsappClick: (location, context = {}) => {
        trackCustomEvent('WhatsAppClick', { location, ...context });
        trackStandardEvent('Contact', { contact_method: 'whatsapp', ...context });
    },

    // ==================== E-COMMERCE EVENTS ====================

    addToCart: (productName, productId, value, currency = DEFAULT_CURRENCY) => {
        trackStandardEvent('AddToCart', {
            content_name: productName,
            content_ids: [String(productId)],
            content_type: 'product',
            value: value,
            currency: currency
        });
    },

    initiateCheckout: (value, currency = DEFAULT_CURRENCY, numItems = 1) => {
        trackStandardEvent('InitiateCheckout', {
            value: value,
            currency: currency,
            num_items: numItems
        });
    },

    purchase: (value, currency = DEFAULT_CURRENCY, orderId, products = []) => {
        trackStandardEvent('Purchase', {
            value: value,
            currency: currency,
            order_id: orderId,
            content_type: 'product',
            content_ids: products.map(p => String(p.id)),
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

    elementVisible: (elementName, pageName) => {
        trackCustomEvent('ElementVisible', {
            element_name: elementName,
            page_name: pageName,
            timestamp: new Date().toISOString()
        });
    },

    videoPlay: (videoName, videoId) => {
        trackCustomEvent('VideoPlay', {
            content_name: videoName,
            content_ids: [String(videoId)]
        });
    },

    downloadResource: (resourceName, resourceType) => {
        trackCustomEvent('DownloadResource', {
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
        trackCustomEvent('TestimonialSubmit', {
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
    //
    // Dashboard auth is staff activity, not a marketing conversion — custom
    // events only, so it never feeds campaign optimization.

    login: (method = 'email', success = true) => {
        trackCustomEvent('Login', {
            login_method: method,
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

    externalLinkClick: (linkName, destination, location, context = {}) => {
        trackCustomEvent('ExternalLinkClick', {
            link_name: linkName,
            destination: destination,
            location: location,
            ...context
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
    viewStage,
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
    elementVisible,
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
