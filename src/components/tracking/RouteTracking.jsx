// components/tracking/RouteTracking.jsx
import { useEffect, useRef } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { metaPixelEvents } from '@/utils/metaPixelTracking';

/**
 * Single source of truth for PageView.
 *
 * Page-level tracking used to be opt-in per component, so any page that forgot
 * to call the hook was invisible (Privacy, Terms, Testimonials and Rate Us all
 * were). This listens to the router instead, so every route is named and
 * counted automatically — including routes added later.
 *
 * Individual pages must NOT also fire PageView; they use
 * usePageEngagementTracking for scroll depth and time on page.
 */

/**
 * Route table. `paramMap` renames router params to the analytics parameter
 * names used elsewhere (`:id` means a different entity per route).
 * Ordered most-specific first for readability; matchPath is exact either way.
 */
const ROUTES = [
    {
        path: '/projects/:id/stages/:stageId/units/:unitId',
        name: 'Unit Model Details',
        paramMap: { id: 'project_id', stageId: 'stage_id', unitId: 'unit_id' },
    },
    {
        path: '/projects/:id/stages/:stageId',
        name: 'Stage Details',
        paramMap: { id: 'project_id', stageId: 'stage_id' },
    },
    { path: '/projects/:id', name: 'Project Details', paramMap: { id: 'project_id' } },
    { path: '/projects', name: 'Projects Page' },
    { path: '/properties/:id', name: 'Property Details', paramMap: { id: 'property_id' } },
    { path: '/properties', name: 'Properties Page' },
    { path: '/about-us', name: 'About Us' },
    { path: '/contact-us', name: 'Contact Us' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/terms', name: 'Terms & Conditions' },
    { path: '/testimonials', name: 'Testimonials' },
    { path: '/rate-us', name: 'Rate Us' },
    { path: '/', name: 'Homepage' },
];

/**
 * Prefixes that are deliberately not reported to Meta.
 * Dashboard traffic is staff activity and auth pages are not marketing pages —
 * counting either one pollutes campaign data and audience building.
 */
const EXCLUDED_PREFIXES = [
    '/dashboard',
    '/login',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
];

/** "/some-new-page" -> "Some New Page", so an unmapped route is still named. */
const deriveNameFromPath = (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Homepage';

    return segments
        .map((segment) =>
            segment
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())
        )
        .join(' / ');
};

/**
 * Resolve a pathname to a page name plus analytics params.
 * Exported for tests and for reuse by engagement tracking.
 */
export const resolveRoute = (pathname) => {
    for (const route of ROUTES) {
        const match = matchPath({ path: route.path, end: true }, pathname);
        if (!match) continue;

        const params = {};
        Object.entries(match.params || {}).forEach(([key, value]) => {
            if (value === undefined) return;
            const mapped = route.paramMap?.[key] || key;
            params[mapped] = value;
        });

        return { name: route.name, params, matched: true };
    }

    return { name: deriveNameFromPath(pathname), params: {}, matched: false };
};

export const isTrackedRoute = (pathname) =>
    !EXCLUDED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

const RouteTracking = () => {
    const { pathname } = useLocation();
    const { i18n } = useTranslation();
    const lastTrackedPath = useRef(null);

    // i18n.language is read through a ref so a language switch alone does not
    // re-fire PageView for the route the visitor is already on.
    const languageRef = useRef(i18n.language);
    languageRef.current = i18n.language;

    useEffect(() => {
        if (!isTrackedRoute(pathname)) return;

        // Guard against StrictMode's double effect invocation and re-renders.
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        const { name, params, matched } = resolveRoute(pathname);

        metaPixelEvents.pageView(name, {
            ...params,
            language: languageRef.current,
            // Surfaces routes missing from the table above without losing the event.
            route_mapped: matched,
        });
    }, [pathname]);

    return null;
};

export default RouteTracking;
