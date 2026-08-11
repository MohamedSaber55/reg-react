import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetaPixels } from '@/store/slices/metaPixelSlice';
import { flushPixelQueue } from '@/utils/metaPixelTracking';

/**
 * Injects the Meta Pixel and Google Analytics tags configured in the dashboard
 * (Dashboard → Tracking). Must be rendered once, inside the Redux Provider.
 *
 * The pixel base code is injected as an inline script so `window.fbq` exists
 * synchronously; any events fired before that point were queued by
 * metaPixelTracking and are flushed immediately after init.
 *
 * PageView is intentionally NOT fired here — useMetaPixelPageView owns it, so
 * SPA route changes and the initial landing are counted exactly once each.
 */

const FB_BASE_SCRIPT_ID = 'fb-pixel-base';

const loadScript = (id, src, onLoad) => {
    if (document.getElementById(id)) { onLoad && onLoad(); return; }
    const s = document.createElement('script');
    s.id = id; s.src = src; s.async = true;
    if (onLoad) s.onload = onLoad;
    document.head.appendChild(s);
};

const injectInlineScript = (id, code) => {
    if (document.getElementById(id)) return false;
    const s = document.createElement('script');
    s.id = id; s.innerHTML = code;
    document.head.appendChild(s);
    return true;
};

/** Meta's standard base snippet — defines window.fbq. Does not init any pixel. */
const FB_BASE_SNIPPET = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
`;

const TrackingPixels = () => {
    const dispatch = useDispatch();
    const { metaPixels } = useSelector((state) => state.tracking);

    // Pixel/GA IDs already initialised, so re-renders never double-init.
    const initializedPixels = useRef(new Set());
    const initializedAnalytics = useRef(new Set());

    useEffect(() => {
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 100 }));
    }, [dispatch]);

    // The slice stores the raw API payload, which is an array today but may be
    // wrapped in a pagination envelope. Normalize so a shape change degrades to
    // "no pixels" instead of throwing during render.
    const pixelList = Array.isArray(metaPixels)
        ? metaPixels
        : Array.isArray(metaPixels?.items)
            ? metaPixels.items
            : [];

    // Every active configuration is honoured, not just the first one.
    const activeConfigs = pixelList.filter((pixel) => pixel?.isActive);

    const activePixelIds = [
        ...new Set(activeConfigs.map((c) => c.metaPixelId).filter(Boolean)),
    ];
    const activeAnalyticsIds = [
        ...new Set(activeConfigs.map((c) => c.googleAnalyticsId).filter(Boolean)),
    ];

    // Primitive dependency keys — arrays would be new identities every render.
    const pixelKey = activePixelIds.join(',');
    const analyticsKey = activeAnalyticsIds.join(',');

    useEffect(() => {
        if (activePixelIds.length === 0) return;

        injectInlineScript(FB_BASE_SCRIPT_ID, FB_BASE_SNIPPET);

        const newPixelIds = activePixelIds.filter(
            (id) => !initializedPixels.current.has(id)
        );
        if (newPixelIds.length === 0) return;

        if (typeof window.fbq !== 'function') return;

        newPixelIds.forEach((id) => {
            window.fbq('init', id);
            initializedPixels.current.add(id);
        });

        // Replay anything that fired before the pixel finished loading.
        flushPixelQueue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixelKey]);

    useEffect(() => {
        if (activeAnalyticsIds.length === 0) return;

        activeAnalyticsIds.forEach((gaId) => {
            if (initializedAnalytics.current.has(gaId)) return;
            initializedAnalytics.current.add(gaId);

            loadScript(
                `ga-${gaId}`,
                `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
                () => {
                    injectInlineScript(`google-analytics-${gaId}`, `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${gaId}');
                    `);
                }
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsKey]);

    if (activePixelIds.length === 0) return null;

    return (
        <noscript>
            {activePixelIds.map((id) => (
                <img
                    key={id}
                    height="1"
                    width="1"
                    alt=""
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
                />
            ))}
        </noscript>
    );
};

export default TrackingPixels;
