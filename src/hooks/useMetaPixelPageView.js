import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { metaPixelEvents, DEFAULT_CURRENCY } from '@/utils/metaPixelTracking';

/**
 * Keeps the latest value in a ref so effects can read it without listing it as
 * a dependency. Callers pass object/array literals (`{ language, rtl }`), which
 * are a new identity on every render — depending on them directly re-runs the
 * effect on every render and fires duplicate events.
 */
const useLatest = (value) => {
    const ref = useRef(value);
    ref.current = value;
    return ref;
};

/**
 * Hook to track page views with Meta Pixel
 * Fires exactly once per pathname, regardless of how often the page re-renders.
 *
 * Events fired before the pixel script loads are queued by metaPixelTracking
 * and flushed on init, so there is no need to wait for window.fbq here.
 *
 * @param {string} pageName - Human-readable page name
 * @param {object} additionalParams - Additional parameters to track
 */
export const useMetaPixelPageView = (pageName, additionalParams = {}) => {
    const { pathname } = useLocation();
    const paramsRef = useLatest(additionalParams);
    const lastTrackedPath = useRef(null);

    useEffect(() => {
        // Guard against React 18/19 StrictMode double-invoking the effect and
        // against re-renders that don't change the route.
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        metaPixelEvents.pageView(pageName, paramsRef.current);
    }, [pathname, pageName, paramsRef]);
};

/**
 * Hook to track scroll depth
 * @param {string} pageName - Page name for tracking
 * @param {number[]} milestones - Percentage milestones (default: [25, 50, 75, 90])
 */
export const useScrollDepthTracking = (pageName, milestones = [25, 50, 75, 90]) => {
    const trackedDepths = useRef(new Set());
    const milestonesRef = useLatest(milestones);
    const { pathname } = useLocation();

    // A new page means the milestones can be earned again.
    useEffect(() => {
        trackedDepths.current = new Set();
    }, [pathname]);

    useEffect(() => {
        let frame = null;

        const measure = () => {
            frame = null;

            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;

            // Pages shorter than the viewport can't be scrolled — dividing here
            // would yield Infinity and fire every milestone at once.
            if (scrollable <= 0) return;

            const scrollPercent = Math.round((window.scrollY / scrollable) * 100);

            milestonesRef.current.forEach((milestone) => {
                if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
                    trackedDepths.current.add(milestone);
                    metaPixelEvents.scrollDepth(milestone, pageName);
                }
            });
        };

        // Throttle to one measurement per frame instead of per scroll event.
        const handleScroll = () => {
            if (frame === null) frame = window.requestAnimationFrame(measure);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frame !== null) window.cancelAnimationFrame(frame);
        };
    }, [pageName, milestonesRef]);
};

/**
 * Hook to track time on page
 * @param {string} pageName - Page name for tracking
 * @param {number[]} intervals - Time intervals in ms (default: 30s, 1m, 2m, 5m)
 */
export const useTimeOnPageTracking = (pageName, intervals = [30000, 60000, 120000, 300000]) => {
    const intervalsRef = useLatest(intervals);

    useEffect(() => {
        const startTime = Date.now();
        let exitTracked = false;

        // Milestone timers. These are created once per page — depending on the
        // `intervals` array directly would clear and recreate them on every
        // render, so the 30s milestone would never actually be reached.
        const timeouts = intervalsRef.current.map((interval) =>
            setTimeout(() => {
                metaPixelEvents.timeOnPage(Math.round(interval / 1000), pageName);
            }, interval)
        );

        const trackExit = () => {
            if (exitTracked) return;
            exitTracked = true;
            const seconds = Math.round((Date.now() - startTime) / 1000);
            metaPixelEvents.timeOnPage(seconds, pageName);
        };

        // `pagehide` is the reliable signal on mobile Safari, where
        // `beforeunload` often never fires.
        window.addEventListener('pagehide', trackExit);
        window.addEventListener('beforeunload', trackExit);

        return () => {
            window.removeEventListener('pagehide', trackExit);
            window.removeEventListener('beforeunload', trackExit);
            timeouts.forEach(clearTimeout);
            trackExit();
        };
    }, [pageName, intervalsRef]);
};

/**
 * Hook to track element visibility (when sections come into view)
 * @param {string} elementName - Name of the element/section
 * @param {string} pageName - Page name for tracking
 * @param {Object} options - IntersectionObserver options
 */
export const useVisibilityTracking = (elementName, pageName, options = {}) => {
    const elementRef = useRef(null);
    const hasTracked = useRef(false);
    const optionsRef = useLatest(options);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTracked.current) {
                    hasTracked.current = true;
                    metaPixelEvents.elementVisible(elementName, pageName);
                }
            },
            { threshold: 0.5, ...optionsRef.current }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [elementName, pageName, optionsRef]);

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
 * @param {string} formType - Type of form (e.g., 'contact', 'inquiry')
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
 * @param {string} contentType - 'property', 'project', 'stage', 'unit_model'
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
            case 'stage':
                metaPixelEvents.viewStage(
                    data.id,
                    data.name,
                    data.projectName,
                    data.unitCount
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
                    data.bathrooms,
                    data.currency
                );
                break;
            default:
                metaPixelEvents.trackStandardEvent('ViewContent', {
                    content_ids: [String(data.id)],
                    content_name: data.name,
                    content_type: 'product',
                    content_category: contentType,
                    currency: data.currency ?? DEFAULT_CURRENCY,
                    ...data
                });
        }
    }, [contentType]);

    return { trackView };
};

/**
 * Fires a ViewContent event once the async-loaded entity is available.
 * Re-fires when the entity id changes (e.g. navigating between two properties).
 *
 * @param {string} contentType - 'property' | 'project' | 'stage' | 'unit_model'
 * @param {object|null} data - Payload for the matching viewer, or null while loading
 */
export const useContentViewOnLoad = (contentType, data) => {
    const { trackView } = useContentViewTracking(contentType);
    const trackedId = useRef(null);
    const dataRef = useLatest(data);

    const id = data?.id ?? null;

    useEffect(() => {
        if (id === null || id === undefined) return;
        if (trackedId.current === id) return;
        trackedId.current = id;

        trackView(dataRef.current);
    }, [id, trackView, dataRef]);
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
 * Engagement tracking for a page: scroll depth + time on page.
 *
 * PageView is deliberately NOT fired here. MetaPixelTracker listens to the router
 * and fires exactly one named PageView per route change, which is what stops
 * pages from being silently missed. Firing it here as well would double every
 * landing.
 *
 * @param {string} pageName - Human-readable page name, matching the MetaPixelTracker table
 * @param {object} options - Configuration options
 * @param {number[]} options.scrollMilestones - Scroll depth milestones
 * @param {number[]} options.timeIntervals - Time intervals to track
 */
export const usePageEngagementTracking = (pageName, options = {}) => {
    const {
        scrollMilestones = [25, 50, 75, 90],
        timeIntervals = [30000, 60000, 120000, 300000]
    } = options;

    useScrollDepthTracking(pageName, scrollMilestones);
    useTimeOnPageTracking(pageName, timeIntervals);
};

/**
 * @deprecated Use usePageEngagementTracking. Kept as an alias so any remaining
 * caller keeps working; it no longer fires PageView (MetaPixelTracker owns that).
 */
export const useComprehensivePageTracking = usePageEngagementTracking;

export default usePageEngagementTracking;
