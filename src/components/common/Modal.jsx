import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

/**
 * Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} props.title
 * @param {'sm' | 'md' | 'lg' | 'xl' | 'full'} props.size
 * @param {boolean} props.showCloseButton
 * @param {boolean} props.closeOnBackdrop
 * @param {React.ReactNode} props.children
 */
export const Modal = ({
    isOpen,
    onClose,
    title,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    className = '',
    children,
}) => {
    const { t } = useTranslation();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full ${sizes[size]} bg-neutral-50   border border-neutral-400   rounded-3xl shadow-2xl overflow-hidden animate-scale-in ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-400">
                        {title && (
                            <h2 className="text-2xl font-bold text-third-900   font-serif">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 text-third-500   hover:text-third-900   hover:bg-neutral-100   rounded-lg transition-colors"
                                aria-label={t('common.modal.close')}
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Modal Header (for custom headers)
export const ModalHeader = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-b border-neutral-400   ${className}`}>
            {children}
        </div>
    );
};

// Modal Body
export const ModalBody = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

// Modal Footer
export const ModalFooter = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-t border-neutral-400   flex items-center justify-end gap-3 ${className}`}>
            {children}
        </div>
    );
};

// Confirmation Modal
export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
}) => {
    const variantStyles = {
        danger: 'bg-error-500 hover:bg-error-600',
        primary: 'bg-primary-500 hover:bg-primary-600',
        success: 'bg-success-500 hover:bg-success-600',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
            <div className="space-y-6">
                <p className="text-third-500">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-neutral-100  border border-neutral-400   text-third-900   font-semibold rounded-xl hover:bg-neutral-50   transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg ${variantStyles[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};