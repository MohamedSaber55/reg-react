// components/tracking/index.js

export { TrackedLink } from './TrackedLink';
export { TrackedButton } from './TrackedButton';
export { default as RouteTracking, resolveRoute, isTrackedRoute } from './RouteTracking';
export {
    TrackedPhoneLink,
    TrackedEmailLink,
    TrackedWhatsAppLink,
    TrackedAddress
} from './TrackedContact';

// Re-export utility functions for convenience
export {
    metaPixelEvents,
    trackStandardEvent,
    trackCustomEvent,
    trackPageView,
    flushPixelQueue,
    grantTrackingConsent,
    revokeTrackingConsent,
    DEFAULT_CURRENCY
} from '@/utils/metaPixelTracking';

// Re-export hooks
export {
    useMetaPixelPageView,
    useScrollDepthTracking,
    useTimeOnPageTracking,
    useVisibilityTracking,
    useVideoTracking,
    useFormTracking,
    useContentViewTracking,
    useContentViewOnLoad,
    useSearchTracking,
    usePageEngagementTracking,
    // deprecated alias, no longer fires PageView
    useComprehensivePageTracking
} from '@/hooks/useMetaPixelPageView';