import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetaPixels } from '@/store/slices/metaPixelSlice';

const loadScript = (id, src, onLoad) => {
    if (document.getElementById(id)) { onLoad && onLoad(); return; }
    const s = document.createElement('script');
    s.id = id; s.src = src; s.async = true;
    if (onLoad) s.onload = onLoad;
    document.head.appendChild(s);
};

const injectInlineScript = (id, code) => {
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id; s.innerHTML = code;
    document.head.appendChild(s);
};

const TrackingPixels = () => {
    const dispatch = useDispatch();
    const { metaPixels, loading } = useSelector((state) => state.tracking);
    const [pixelLoaded, setPixelLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchMetaPixels({ pageNumber: 1, pageSize: 100 }));
    }, [dispatch]);

    const activePixel = metaPixels?.find(pixel => pixel.isActive);

    useEffect(() => {
        if (!activePixel) return;

        if (activePixel.metaPixelId) {
            injectInlineScript('fb-pixel', `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${activePixel.metaPixelId}');
                fbq('track', 'PageView');
            `);
            setPixelLoaded(true);
        }

        if (activePixel.googleAnalyticsId) {
            loadScript(
                `ga-${activePixel.googleAnalyticsId}`,
                `https://www.googletagmanager.com/gtag/js?id=${activePixel.googleAnalyticsId}`,
                () => {
                    injectInlineScript('google-analytics', `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${activePixel.googleAnalyticsId}');
                    `);
                    setPixelLoaded(true);
                }
            );
        }
    }, [activePixel]);

    if (loading || !activePixel || !activePixel.metaPixelId) return null;

    return (
        activePixel.metaPixelId ? (
            <noscript>
                <img height="1" width="1" style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${activePixel.metaPixelId}&ev=PageView&noscript=1`}
                />
            </noscript>
        ) : null
    );
};

export default TrackingPixels;
