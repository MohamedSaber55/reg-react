// components/tracking/TrackedLink.jsx
import {Link} from 'react-router-dom';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * TrackedLink - A Link component with automatic Meta Pixel tracking
 * 
 * @param {string} href - Link destination
 * @param {string} trackName - Name for tracking (optional, defaults to children text)
 * @param {string} trackLocation - Where the link is located (e.g., 'header', 'footer', 'hero')
 * @param {string} trackEvent - Event type: 'nav', 'cta', 'footer', 'external'
 * @param {object} additionalParams - Additional tracking parameters
 * @param {function} onClick - Optional original onClick handler
 */
export const TrackedLink = ({
    href,
    trackName,
    trackLocation = 'page',
    trackEvent = 'nav',
    additionalParams = {},
    onClick,
    children,
    ...props
}) => {
    const handleClick = (e) => {
        const linkName = trackName || (typeof children === 'string' ? children : 'Link');

        // Track based on event type. additionalParams is forwarded in every
        // branch so callers can attach context (property id, project name, ...)
        // regardless of which event type they picked.
        switch (trackEvent) {
            case 'nav':
                metaPixelEvents.navClick(linkName, href, trackLocation, additionalParams);
                break;
            case 'footer':
                metaPixelEvents.footerNavClick(linkName, href, additionalParams);
                break;
            case 'cta':
                metaPixelEvents.ctaClick(linkName, href, trackLocation, additionalParams);
                break;
            case 'external':
                metaPixelEvents.externalLinkClick(linkName, href, trackLocation, additionalParams);
                break;
            case 'logo':
                metaPixelEvents.logoClick(trackLocation);
                break;
            default:
                metaPixelEvents.buttonClick(linkName, trackLocation, additionalParams);
        }

        // Call original onClick if provided
        if (onClick) {
            onClick(e);
        }
    };

    // Check if external link
    const isExternal = href?.startsWith('http') || href?.startsWith('//');

    // data-pixel-tracked tells the global click listener in MetaPixelTracker to
    // skip this element — it already reports a richer, named event.
    if (isExternal) {
        return (
            <a
                href={href}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                data-pixel-tracked="true"
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <Link
            to={href}
            onClick={handleClick}
            data-pixel-tracked="true"
            {...props}
        >
            {children}
        </Link>
    );
};

export default TrackedLink;