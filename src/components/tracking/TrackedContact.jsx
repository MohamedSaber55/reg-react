// components/tracking/TrackedContact.jsx
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * TrackedPhoneLink - Phone link with Meta Pixel tracking
 */
export const TrackedPhoneLink = ({
    phoneNumber,
    location = 'page',
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.phoneClick(phoneNumber, location);
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
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.emailClick(email, location);
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
    showIcon = true,
    className = '',
    children,
    ...props
}) => {
    const handleClick = () => {
        metaPixelEvents.whatsappClick(phoneNumber, location);
    };

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

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
 * TrackedAddress - Address display with optional map link tracking
 */
export const TrackedAddress = ({
    address,
    location = 'page',
    showIcon = true,
    className = '',
    ...props
}) => {
    const handleMapClick = () => {
        metaPixelEvents.buttonClick('View Map', location, { address: address });
    };

    return (
        <div className={className} {...props}>
            {showIcon && <FiMapPin className="inline me-2" />}
            <span>{address}</span>
        </div>
    );
};

export default {
    TrackedPhoneLink,
    TrackedEmailLink,
    TrackedWhatsAppLink,
    TrackedAddress
};