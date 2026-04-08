// components/tracking/TrackedButton.jsx
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * TrackedButton - A Button component with automatic Meta Pixel tracking
 * 
 * @param {string} trackName - Name for tracking
 * @param {string} trackLocation - Where the button is located
 * @param {string} trackEvent - Event type: 'button', 'cta', 'form', 'filter', 'sort'
 * @param {object} additionalParams - Additional tracking parameters
 * @param {function} onClick - Click handler
 */
export const TrackedButton = ({
    trackName,
    trackLocation = 'page',
    trackEvent = 'button',
    additionalParams = {},
    onClick,
    children,
    ...props
}) => {
    const handleClick = (e) => {
        // Track based on event type
        switch (trackEvent) {
            case 'cta':
                metaPixelEvents.ctaClick(trackName, null, trackLocation);
                break;
            case 'form':
                metaPixelEvents.formStart(trackName, trackLocation);
                break;
            case 'filter':
                metaPixelEvents.filterProperties(trackName, additionalParams.filterValue);
                break;
            case 'sort':
                metaPixelEvents.sortProperties(trackName, additionalParams.sortOrder);
                break;
            default:
                metaPixelEvents.buttonClick(trackName, trackLocation, additionalParams);
        }

        // Call original onClick if provided
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default TrackedButton;