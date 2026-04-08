import React, { useState } from 'react';
import { FiShare2, FiX, FiCopy, FiCheck } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ShareButton({ title, description, url }) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const shareTitle = title || 'Check this out!';
    const shareDescription = description || '';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const shareOptions = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            color: 'bg-[#1877F2]',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            color: 'bg-[#1DA1F2]',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-[#25D366]',
            url: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            color: 'bg-[#0A66C2]',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
    ];

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
        setShowModal(false);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="p-3 bg-neutral-100 rounded-xl hover:bg-primary-100 transition-all"
                aria-label="Share"
            >
                <FiShare2 className="text-xl text-third-900" />
            </button>

            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 inset-s-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-neutral-50 rounded-2xl p-6 z-50 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-third-900">
                                    Share
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <FiX className="text-xl text-third-500" />
                                </button>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {shareOptions.map((option) => (
                                    <button
                                        key={option.name}
                                        onClick={() => handleShare(option.url)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl ${option.color} hover:opacity-90 transition-opacity text-white`}
                                    >
                                        <option.icon className="text-2xl" />
                                        <span className="text-xs font-medium">{option.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Copy Link */}
                            <div>
                                <label className="block text-sm font-medium text-third-900 mb-2">
                                    Or copy link
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 bg-neutral-100 border border-neutral-400 rounded-lg text-sm text-third-900"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${copied
                                                ? 'bg-success-500 text-white'
                                                : 'bg-primary-600 hover:bg-primary-700 text-white'
                                            }`}
                                    >
                                        {copied ? (
                                            <FiCheck className="text-xl" />
                                        ) : (
                                            <FiCopy className="text-xl" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}