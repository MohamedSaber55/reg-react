import { useEffect, useRef, useCallback } from 'react';
import {useLocation} from 'react-router-dom';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * Hook to track page views with Meta Pixel
 * Automatically tracks when the pathname changes
 * 
 * @param {string} pageName - Human-readable page name
 * @param {object} additionalParams - Additional parameters to track
 */
export const useMetaPixelPageView = (pageName, additionalParams = {}) => {
    const { pathname } = useLocation();
    const hasTracked = useRef(false);

    useEffect(() => {
        // Only track if pixel is loaded and hasn't tracked this pathname yet
        if (typeof window !== 'undefined' && window.fbq && !hasTracked.current) {
            metaPixelEvents.pageView(pageName, additionalParams);
            hasTracked.current = true;
        }

        // Reset when pathname changes
        return () => {
            hasTracked.current = false;
        };
    }, [pathname, pageName, additionalParams]);
};

/**
 * Hook to track scroll depth
 * @param {string} pageName - Page name for tracking
 * @param {number[]} milestones - Array of percentage milestones to track (default: [25, 50, 75, 90])
 */
export const useScrollDepthTracking = (pageName, milestones = [25, 50, 75, 90]) => {
    const trackedDepths = useRef(new Set());

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
                    trackedDepths.current.add(milestone);
                    metaPixelEvents.scrollDepth(milestone, pageName);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pageName, milestones]);
};

/**
 * Hook to track time on page
 * @param {string} pageName - Page name for tracking
 * @param {number[]} intervals - Array of time intervals in milliseconds (default: [30s, 1m, 2m, 5m])
 */
export const useTimeOnPageTracking = (pageName, intervals = [30000, 60000, 120000, 300000]) => {
    const startTime = useRef(Date.now());
    const hasTracked = useRef(false);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (!hasTracked.current) {
                const seconds = Math.round((Date.now() - startTime.current) / 1000);
                metaPixelEvents.timeOnPage(seconds, pageName);
                hasTracked.current = true;
            }
        };

        // Track at specified intervals
        const timeouts = [];

        intervals.forEach(interval => {
            const timeout = setTimeout(() => {
                const seconds = Math.round(interval / 1000);
                metaPixelEvents.timeOnPage(seconds, pageName);
            }, interval);
            timeouts.push(timeout);
        });

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            timeouts.forEach(clearTimeout);
            handleBeforeUnload(); // Track on unmount
        };
    }, [pageName, intervals]);
};

/**
 * Hook to track element visibility (for tracking when sections come into view)
 * @param {string} elementName - Name of the element/section
 * @param {string} pageName - Page name for tracking
 * @param {Object} options - IntersectionObserver options
 */
export const useVisibilityTracking = (elementName, pageName, options = {}) => {
    const elementRef = useRef(null);
    const hasTracked = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTracked.current) {
                    hasTracked.current = true;
                    metaPixelEvents.trackCustomEvent('ElementVisible', {
                        element_name: elementName,
                        page_name: pageName,
                        timestamp: new Date().toISOString()
                    });
                }
            },
            {
                threshold: 0.5,
                ...options
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [elementName, pageName, options]);

    return elementRef;
};

/**
 * Hook to track video interactions
 * @param {string} videoName - Name of the video
 * @param {string} videoId - ID of the video
 */
export const useVideoTracking = (videoName, videoId) => {
    const trackPlay = useCallback(() => {
        metaPixelEvents.videoPlay(videoName, videoId);
    }, [videoName, videoId]);

    return { trackPlay };
};

/**
 * Hook to track form interactions
 * @param {string} formName - Name of the form
 * @param {string} formType - Type of form (e.g., 'contact', 'inquiry', 'testimonial')
 */
export const useFormTracking = (formName, formType = 'general') => {
    const trackFormStart = useCallback(() => {
        metaPixelEvents.formStart(formName, formType);
    }, [formName, formType]);

    const trackFormSubmit = useCallback((success = true) => {
        metaPixelEvents.formSubmit(formName, formType, success);
    }, [formName, formType]);

    const trackFormError = useCallback((errorType, errorMessage) => {
        metaPixelEvents.formError(formName, errorType, errorMessage);
    }, [formName]);

    return { trackFormStart, trackFormSubmit, trackFormError };
};

/**
 * Hook to track property/project views
 * @param {string} contentType - 'property', 'project', 'unit_model'
 */
export const useContentViewTracking = (contentType) => {
    const trackView = useCallback((data) => {
        switch (contentType) {
            case 'property':
                metaPixelEvents.viewProperty(
                    data.id,
                    data.name,
                    data.type,
                    data.price,
                    data.currency
                );
                break;
            case 'project':
                metaPixelEvents.viewProject(
                    data.id,
                    data.name,
                    data.stageCount
                );
                break;
            case 'unit_model':
                metaPixelEvents.viewUnitModel(
                    data.id,
                    data.name,
                    data.stageName,
                    data.price,
                    data.area,
                    data.bedrooms,
                    data.bathrooms
                );
                break;
            default:
                metaPixelEvents.trackStandardEvent('ViewContent', {
                    content_ids: [data.id],
                    content_name: data.name,
                    content_type: contentType,
                    ...data
                });
        }
    }, [contentType]);

    return { trackView };
};

/**
 * Hook to track search and filter interactions
 */
export const useSearchTracking = () => {
    const trackSearch = useCallback((searchQuery, filters = {}) => {
        metaPixelEvents.propertySearch(searchQuery, filters);
    }, []);

    const trackFilter = useCallback((filterType, filterValue) => {
        metaPixelEvents.filterProperties(filterType, filterValue);
    }, []);

    const trackSort = useCallback((sortBy, sortOrder) => {
        metaPixelEvents.sortProperties(sortBy, sortOrder);
    }, []);

    return { trackSearch, trackFilter, trackSort };
};

/**
 * Combined hook for comprehensive page tracking
 * Includes page view, scroll depth, and time on page
 * 
 * @param {string} pageName - Human-readable page name
 * @param {object} options - Configuration options
 * @param {object} options.additionalParams - Additional parameters for page view
 * @param {number[]} options.scrollMilestones - Scroll depth milestones to track
 * @param {number[]} options.timeIntervals - Time intervals to track
 */
export const useComprehensivePageTracking = (
    pageName,
    options = {}
) => {
    const {
        additionalParams = {},
        scrollMilestones = [25, 50, 75, 90],
        timeIntervals = [30000, 60000, 120000, 300000]
    } = options;

    useMetaPixelPageView(pageName, additionalParams);
    useScrollDepthTracking(pageName, scrollMilestones);
    useTimeOnPageTracking(pageName, timeIntervals);
};

export default useComprehensivePageTracking;