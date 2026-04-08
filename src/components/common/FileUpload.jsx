// components/common/FileUpload.jsx
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiFile } from 'react-icons/fi';

export default function FileUpload({
    onFileSelect,
    accept = 'image/*',
    multiple = false,
    maxSize = 5, // MB
    label = 'Upload file',
    required = false,
    maxFiles = 10
}) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setError('');

        // Check file count
        if (multiple && files.length > maxFiles) {
            setError(t('validation.maxFiles', { max: maxFiles }));
            return;
        }

        // Check file size and type
        const validFiles = [];
        for (const file of files) {
            // Check size (convert MB to bytes)
            if (file.size > maxSize * 1024 * 1024) {
                setError(t('validation.fileSize', { max: maxSize }));
                continue;
            }

            // Check type
            if (accept !== '*/*' && !file.type.match(accept.replace('*', '.*'))) {
                setError(t('validation.fileType'));
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            if (multiple) {
                onFileSelect(validFiles);
            } else {
                onFileSelect(validFiles[0]);
            }
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleClick}
                className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
            >
                <div className="flex flex-col items-center justify-center text-neutral-500">
                    <FiUpload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium mb-1">{label}</span>
                    <span className="text-xs">
                        {accept === 'image/*'
                            ? t('common.imageTypes')
                            : t('common.fileTypes')
                        }
                        {t('common.maxSize', { size: maxSize })}
                        {multiple && t('common.maxFiles', { max: maxFiles })}
                    </span>
                </div>
            </button>
            {error && (
                <p className="mt-1 text-sm text-error-500">{error}</p>
            )}
        </div>
    );
}