// components/tracking/TrackedContact.jsx
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * Contact links with Meta Pixel tracking.
 *
 * The phone number / email address itself is never sent to Meta — raw PII in
 * pixel parameters violates Meta's Business Tools terms and gets filtered or
 * flagged. Only the placement (`location`) and non-identifying context travel
 * with the event.
 */

/**
 * TrackedPhoneLink - Phone link with Meta Pixel tracking
 */
export const TrackedPhoneLink = ({
    phoneNumber,
    location = 'page',
    trackingContext = {},
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.phoneClick(location, trackingContext);
    };

    return (
        <a
            href={`tel:${phoneNumber}`}
            onClick={handleClick}
            className={className}
            {...props}
        >
            {showIcon && <FiPhone className="inline me-2" />}
            {children || phoneNumber}
        </a>
    );
};

/**
 * TrackedEmailLink - Email link with Meta Pixel tracking
 */
export const TrackedEmailLink = ({
    email,
    location = 'page',
    trackingContext = {},
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.emailClick(location, trackingContext);
    };

    return (
        <a
            href={`mailto:${email}`}
            onClick={handleClick}
            className={className}
            {...props}
        >
            {showIcon && <FiMail className="inline me-2" />}
            {children || email}
        </a>
    );
};

/**
 * TrackedWhatsAppLink - WhatsApp link with Meta Pixel tracking
 */
export const TrackedWhatsAppLink = ({
    phoneNumber,
    message = '',
    location = 'page',
    trackingContext = {},
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.whatsappClick(location, trackingContext);
    };

    const whatsappUrl = `https://wa.me/${(phoneNumber ?? '').replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={className}
            {...props}
        >
            {showIcon && <FaWhatsapp className="inline me-2" />}
            {children || 'WhatsApp'}
        </a>
    );
};

/**
 * TrackedAddress - Address display, optionally linking to a map.
 * The street address is PII, so only the label is tracked.
 */
export const TrackedAddress = ({
    address,
    mapUrl,
    location = 'page',
    showIcon = true,
    className = '',
    ...props
}) => {
    const handleMapClick = () => {
        metaPixelEvents.buttonClick('View Map', location);
    };

    return (
        <div className={className} {...props}>
            {showIcon && <FiMapPin className="inline me-2" />}
            {mapUrl ? (
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleMapClick}
                >
                    {address}
                </a>
            ) : (
                <span>{address}</span>
            )}
        </div>
    );
};

export default {
    TrackedPhoneLink,
    TrackedEmailLink,
    TrackedWhatsAppLink,
    TrackedAddress
};
