// components/common/ImagePreview.jsx
import React, { useState, useEffect } from 'react';
import { FiImage } from 'react-icons/fi';

export default function ImagePreview({ file, url, alt = 'Preview', className = '' }) {
    const [previewUrl, setPreviewUrl] = useState(url);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (url) {
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file, url]);

    if (!previewUrl) {
        return (
            <div className={`flex items-center justify-center bg-neutral-100 rounded-lg ${className}`}>
                <FiImage className="w-12 h-12 text-neutral-400" />
            </div>
        );
    }

    return (
        <img
            src={previewUrl}
            alt={alt}
            className={`w-full rounded-lg object-cover ${className}`}
        />
    );
}