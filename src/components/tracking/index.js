// components/tracking/index.js

export { TrackedLink } from './TrackedLink';
export { TrackedButton } from './TrackedButton';
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
    trackCustomEvent
} from '@/utils/metaPixelTracking';

// Re-export hooks
export {
    useMetaPixelPageView,
    useScrollDepthTracking,
    useTimeOnPageTracking,
    useComprehensivePageTracking
} from '@/hooks/useMetaPixelPageView';