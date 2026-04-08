import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Button } from '@/components/common/Button';
import { useAppSelector } from '@/hooks/redux';

/**
 * Reusable Pagination Component
 * 
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {number} totalCount - Total number of items
 * @param {number} pageSize - Number of items per page
 * @param {boolean} hasPreviousPage - Whether there's a previous page
 * @param {boolean} hasNextPage - Whether there's a next page
 * @param {function} onPageChange - Callback when page changes
 * @param {boolean} showItemCount - Whether to show item count (default: true)
 * @param {boolean} showPageNumbers - Whether to show page numbers (default: true)
 * @param {number} maxPageButtons - Maximum number of page buttons to show (default: 5)
 * @param {string} size - Size of pagination buttons: 'xs' | 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} compactMobile - Use compact mode on mobile (default: true)
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalCount = 0,
    pageSize = 10,
    hasPreviousPage = false,
    hasNextPage = false,
    onPageChange,
    showItemCount = true,
    showPageNumbers = true,
    maxPageButtons = 5,
    size = 'md',
    compactMobile = true
}) {
    const { t } = useTranslation();
    const { currentLang } = useAppSelector((state) => state.language);
    const isRTL = currentLang === 'ar';

    // State to handle client-side window width for initial render/hydration
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Don't render if there's only one page
    if (totalPages <= 1) {
        return null;
    }

    // Calculate visible page numbers
    const getPageNumbers = () => {
        // Use a smaller number of buttons on mobile
        const effectiveMaxButtons = isMobile ? (compactMobile ? 3 : Math.min(maxPageButtons, 3)) : maxPageButtons;

        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(effectiveMaxButtons / 2));
        let endPage = Math.min(totalPages, startPage + effectiveMaxButtons - 1);

        if (endPage - startPage < effectiveMaxButtons - 1) {
            startPage = Math.max(1, endPage - effectiveMaxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();
    const showFirstLast = totalPages > (isMobile ? 3 : maxPageButtons);
    const showEllipsisStart = pageNumbers[0] > 1;
    const showEllipsisEnd = pageNumbers[pageNumbers.length - 1] < totalPages;

    // Calculate items range
    const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    const sizeClasses = {
        xs: 'text-xs px-2 py-1 min-w-[32px] h-8',
        sm: 'text-sm px-3 py-1.5 min-w-[36px] h-9',
        md: 'text-base px-4 py-2 min-w-[40px] h-10',
        lg: 'text-lg px-5 py-2.5 min-w-[48px] h-12'
    };

    const buttonSizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-neutral-400 w-full">
            {/* Item Count - Responsive text */}
            {showItemCount && (
                <div className={`${sizeClasses[size].split(' ')[0]} text-third-500 text-center md:text-start w-full md:w-auto`}>
                    {totalCount > 0 ? (
                        <div className="flex flex-wrap justify-center md:justify-start gap-1">
                            <span className="">
                                <span className="font-medium text-third-900">{startItem}-{endItem}</span> / <span className="font-medium text-third-900">{totalCount}</span>
                            </span>
                        </div>
                    ) : (
                        <span>{t('dashboard.pagination.noItems')}</span>
                    )}
                </div>
            )}

            {/* Page Navigation */}
            <div className="flex items-center justify-center md:justify-end gap-1 sm:gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
                {/* First Page Button */}
                {showFirstLast && (
                    <Button
                        variant="ghost"
                        size={size}
                        onClick={() => onPageChange?.(1)}
                        disabled={currentPage === 1}
                        aria-label={t('dashboard.pagination.firstPage')}
                        className={`hidden sm:flex shrink-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={t('dashboard.pagination.firstPage')}
                    >
                        <FiChevronsLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    </Button>
                )}

                {/* Previous Button */}
                <Button
                    variant="ghost"
                    size={size}
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    aria-label={t('dashboard.pagination.previous')}
                    className={`flex items-center justify-center shrink-0 ${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FiChevronLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    <span className="hidden lg:inline ms-1">{t('dashboard.pagination.previous')}</span>
                </Button>

                {/* Page Numbers */}
                {showPageNumbers && (
                    <div className="flex items-center gap-1">
                        {showEllipsisStart && (
                            <>
                                <Button
                                    variant="ghost"
                                    size={size}
                                    onClick={() => onPageChange?.(1)}
                                    className="hidden sm:flex shrink-0"
                                >
                                    1
                                </Button>
                                <span className="hidden sm:inline px-1 text-third-500">...</span>
                            </>
                        )}

                        {pageNumbers.map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? 'primary' : 'ghost'}
                                size={size}
                                onClick={() => onPageChange?.(page)}
                                className={`${buttonSizeClass} shrink-0`}
                                aria-current={page === currentPage ? 'page' : undefined}
                                aria-label={`${t('dashboard.pagination.page')} ${page}`}
                            >
                                {page}
                            </Button>
                        ))}

                        {showEllipsisEnd && (
                            <>
                                <span className="hidden sm:inline px-1 text-third-500">...</span>
                                <Button
                                    variant="ghost"
                                    size={size}
                                    onClick={() => onPageChange?.(totalPages)}
                                    className="hidden sm:flex shrink-0"
                                >
                                    {totalPages}
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {/* Next Button */}
                <Button
                    variant="ghost"
                    size={size}
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={!hasNextPage}
                    aria-label={t('dashboard.pagination.next')}
                    className={`flex items-center justify-center shrink-0 ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="hidden lg:inline me-1">{t('dashboard.pagination.next')}</span>
                    <FiChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </Button>

                {/* Last Page Button */}
                {showFirstLast && (
                    <Button
                        variant="ghost"
                        size={size}
                        onClick={() => onPageChange?.(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label={t('dashboard.pagination.lastPage')}
                        className={`hidden sm:flex shrink-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={t('dashboard.pagination.lastPage')}
                    >
                        <FiChevronsRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                    </Button>
                )}
            </div>

            {/* Mobile-only page indicator for very small screens */}
            <div className="md:hidden text-xs text-third-500 font-medium">
                {t('dashboard.pagination.page')} {currentPage} / {totalPages}
            </div>
        </div>
    );
}

/**
 * Simple Pagination Component (Previous/Next only)
 * Optimized for mobile and small containers
 */
export function SimplePagination({
    currentPage = 1,
    totalPages = 1,
    hasPreviousPage = false,
    hasNextPage = false,
    onPageChange,
    size = 'md',
    compactMobile = true
}) {
    const { t } = useTranslation();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col xs:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-neutral-400 w-full">
            <div className="text-sm text-third-500 text-center xs:text-start order-2 xs:order-1">
                <span>
                    {t('dashboard.pagination.page')} <span className="font-medium text-third-900">{currentPage}</span>
                    <span className="mx-1">{t('dashboard.pagination.of')}</span>
                    <span className="font-medium text-third-900">{totalPages}</span>
                </span>
            </div>
            <div className="flex gap-2 w-full xs:w-auto justify-center xs:justify-end order-1 xs:order-2">
                <Button
                    variant="secondary"
                    size={size}
                    disabled={!hasPreviousPage}
                    onClick={() => onPageChange?.(currentPage - 1)}
                    className="flex-1 xs:flex-initial min-w-25"
                >
                    <FiChevronLeft className="inline-block me-1" />
                    <span>{t('dashboard.pagination.previous')}</span>
                </Button>
                <Button
                    variant="secondary"
                    size={size}
                    disabled={!hasNextPage}
                    onClick={() => onPageChange?.(currentPage + 1)}
                    className="flex-1 xs:flex-initial min-w-25"
                >
                    <span>{t('dashboard.pagination.next')}</span>
                    <FiChevronRight className="inline-block ms-1" />
                </Button>
            </div>
        </div>
    );
}
