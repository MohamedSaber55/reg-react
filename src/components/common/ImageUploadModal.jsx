// dashboard/components/ImageUploadModal.jsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

export default function ImageUploadModal({
    isOpen,
    onClose,
    onUpload,
    title,
    description,
    accept = 'image/*',
    maxSize = 5,
    multiple = false,
    maxFiles = 1,
    loading = false
}) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setError('');

        // Validate file count
        if (multiple && selectedFiles.length > maxFiles) {
            setError(t('validation.maxFiles', { max: maxFiles }));
            return;
        }

        // Validate file size and type
        const validFiles = [];
        for (const file of selectedFiles) {
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

        if (multiple) {
            setFiles(prev => [...prev, ...validFiles]);
        } else {
            setFiles(validFiles);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = () => {
        if (files.length === 0) {
            setError(t('validation.noFiles'));
            return;
        }

        if (multiple) {
            onUpload(files);
        } else {
            onUpload(files[0]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleClose = () => {
        setFiles([]);
        setError('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            description={description}
            size="lg"
        >
            <div className="space-y-6">
                {/* File Upload Area */}
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
                        className="w-full p-8 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                    >
                        <div className="flex flex-col items-center justify-center text-neutral-500">
                            <FiUpload className="w-12 h-12 mb-4" />
                            <span className="text-base font-medium mb-2">
                                {t('dashboard.unitModelImages.form.clickToUpload')}
                            </span>
                            <span className="text-sm text-center">
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
                        <p className="mt-2 text-sm text-error-500">{error}</p>
                    )}
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-medium text-neutral-700">
                            {t('dashboard.unitModelImages.form.selectedFiles', { count: files.length })}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-2 inset-e-2 bg-error-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FiX className="w-3 h-3" />
                                    </button>
                                    <div className="mt-1 text-xs text-neutral-500 truncate">
                                        {file.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-neutral-300">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {t('dashboard.forms.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleUpload}
                        loading={loading}
                        disabled={files.length === 0 || loading}
                    >
                        {t('dashboard.forms.upload')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}