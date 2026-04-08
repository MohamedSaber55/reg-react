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

        // Track based on event type
        switch (trackEvent) {
            case 'nav':
                metaPixelEvents.navClick(linkName, href, trackLocation);
                break;
            case 'footer':
                metaPixelEvents.footerNavClick(linkName, href);
                break;
            case 'cta':
                metaPixelEvents.ctaClick(linkName, href, trackLocation);
                break;
            case 'external':
                metaPixelEvents.externalLinkClick(linkName, href, trackLocation);
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

    if (isExternal) {
        return (
            <a
                href={href}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
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
            {...props}
        >
            {children}
        </Link>
    );
};

export default TrackedLink;