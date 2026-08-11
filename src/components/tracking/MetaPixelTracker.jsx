// components/tracking/MetaPixelTracker.jsx
import { useEffect, useRef } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { metaPixelEvents, trackCustomEvent } from '@/utils/metaPixelTracking';

/**
 * Global Meta Pixel tracker, matching the approach used on Zidni Academy:
 *
 *  1. Every route change fires a named custom event ("Property Details Page
 *     View") so pages are readable in Events Manager without digging into
 *     parameters.
 *  2. A single delegated click listener names every button/link click
 *     "<Label> Click", so nothing has to be wired up per component.
 *
 * Differences from the Zidni version, all deliberate:
 *  - The standard PageView still fires alongside the named event. Meta uses it
 *    for baseline traffic and attribution, and Zidni only fires it once in the
 *    inline snippet, so SPA navigations there are undercounted.
 *  - Click labels are sanitized and length-capped. Property cards wrap a whole
 *    card in an <a>, so raw innerText would produce an unusable event name
 *    hundreds of characters long.
 *  - Elements already tracked by TrackedLink/TrackedButton are skipped, so a
 *    click cannot report twice.
 *  - Dashboard and auth routes are excluded; staff activity should not feed
 *    campaign optimization.
 */

/** Longest label we will turn into an event name. */
const MAX_LABEL_LENGTH = 50;

/** Static path -> event name. */
const PAGE_EVENTS = {
    '/': 'Home Page View',
    '/about-us': 'About Page View',
    '/contact-us': 'Contact Page View',
    '/privacy': 'Privacy Page View',
    '/terms': 'Terms Page View',
    '/testimonials': 'Testimonials Page View',
    '/rate-us': 'Rate Us Page View',
    '/projects': 'Projects Page View',
    '/properties': 'Properties Page View',
};

/**
 * Dynamic routes, most specific first. `paramMap` renames router params to the
 * analytics names used elsewhere — `:id` means a different entity per route.
 */
const DYNAMIC_ROUTES = [
    {
        path: '/projects/:id/stages/:stageId/units/:unitId',
        name: 'Unit Model Details Page View',
        paramMap: { id: 'project_id', stageId: 'stage_id', unitId: 'unit_id' },
    },
    {
        path: '/projects/:id/stages/:stageId',
        name: 'Stage Details Page View',
        paramMap: { id: 'project_id', stageId: 'stage_id' },
    },
    { path: '/projects/:id', name: 'Project Details Page View', paramMap: { id: 'project_id' } },
    { path: '/properties/:id', name: 'Property Details Page View', paramMap: { id: 'property_id' } },
];

const EXCLUDED_PREFIXES = [
    '/dashboard',
    '/login',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
];

export const isTrackedRoute = (pathname) =>
    !EXCLUDED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

/** "/some-new-page" -> "Some New Page Page View", so a new route is never anonymous. */
const deriveNameFromPath = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Home Page View';

    return `${segments
        .map((s) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(' ')} Page View`;
};

/** Resolve a pathname to its event name plus analytics params. */
export const getPageEvent = (pathname) => {
    const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    if (PAGE_EVENTS[normalized]) {
        return { name: PAGE_EVENTS[normalized], params: {}, matched: true };
    }

    for (const route of DYNAMIC_ROUTES) {
        const match = matchPath({ path: route.path, end: true }, normalized);
        if (!match) continue;

        const params = {};
        Object.entries(match.params || {}).forEach(([key, value]) => {
            if (value === undefined) return;
            params[route.paramMap?.[key] || key] = value;
        });

        return { name: route.name, params, matched: true };
    }

    return { name: deriveNameFromPath(normalized), params: {}, matched: false };
};

/** Collapse whitespace and cap length so an event name stays usable. */
const sanitizeLabel = (raw) => {
    const text = String(raw).replace(/\s+/g, ' ').trim();
    if (!text) return null;
    return text.length > MAX_LABEL_LENGTH
        ? `${text.slice(0, MAX_LABEL_LENGTH).trim()}…`
        : text;
};

/**
 * Walk up from the click target to the nearest button/link and derive a label.
 * Preference order: data-track-label, aria-label, visible text, href.
 *
 * Prefer data-track-label on bilingual UI — visible text differs between
 * Arabic and English, which would otherwise split one button into two events.
 */
export const getClickLabel = (target) => {
    let el = target;

    while (
        el &&
        el.tagName !== 'BUTTON' &&
        el.tagName !== 'A' &&
        el.getAttribute?.('role') !== 'button'
    ) {
        el = el.parentElement;
        if (!el || el === document.body) return null;
    }
    if (!el) return null;

    // TrackedLink/TrackedButton already report a richer event for this click.
    if (el.closest('[data-pixel-tracked]')) return null;

    const trackLabel = el.getAttribute('data-track-label');
    if (trackLabel) return sanitizeLabel(trackLabel);

    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return sanitizeLabel(ariaLabel);

    const text = sanitizeLabel(el.innerText || '');
    if (text) return text;

    if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        if (href) return sanitizeLabel(`Link: ${href}`);
    }

    return null;
};

const MetaPixelTracker = () => {
    const { pathname } = useLocation();
    const { i18n } = useTranslation();
    const lastTrackedPath = useRef(null);

    // Read through a ref so switching language does not re-fire the page event.
    const languageRef = useRef(i18n.language);
    languageRef.current = i18n.language;

    // Named page event on every route change.
    useEffect(() => {
        if (!isTrackedRoute(pathname)) return;

        // Guards against StrictMode's double effect and plain re-renders.
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        const { name, params, matched } = getPageEvent(pathname);
        const payload = {
            ...params,
            url: pathname,
            language: languageRef.current,
            route_mapped: matched,
        };

        // Readable, Zidni-style named event...
        trackCustomEvent(name, payload);
        // ...plus the standard event Meta needs for baseline traffic.
        metaPixelEvents.pageView(name.replace(/ Page View$/, ''), payload);
    }, [pathname]);

    // Delegated click tracking for every button and link on the site.
    useEffect(() => {
        const handleClick = (e) => {
            if (!isTrackedRoute(window.location.pathname)) return;

            const label = getClickLabel(e.target);
            if (!label) return;

            trackCustomEvent(`${label} Click`, {
                url: window.location.pathname,
                language: languageRef.current,
            });
        };

        // Capture phase so the event is recorded even when a handler
        // stops propagation (several cards call stopPropagation).
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    return null;
};

export default MetaPixelTracker;
