import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiHome,
    FiChevronRight,
    FiChevronLeft,
    FiMapPin,
    FiFolder,
    FiCalendar,
    FiTag,
    FiUser,
    FiGrid
} from 'react-icons/fi';
import { FaAngleDoubleRight } from 'react-icons/fa';
import DynamicIconLazy from '@/components/common/DynamicIconLazy';

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/* ============================================
   BREADCRUMB ITEM COMPONENT (REUSABLE)
   ============================================ */
const BreadcrumbItem = ({
    item,
    isLast = false,
    isRTL = false,
    designOption = 1,
    index = 0
}) => {
    const { label, href, icon } = item;

    // Design-specific styling
    const designStyles = {
        1: {
            // Modern Cinematic
            container: 'flex items-center',
            link: 'text-neutral-400 hover:text-primary-500 transition-colors',
            current: 'text-white font-semibold',
            separator: 'text-neutral-600 mx-2',
            icon: 'text-primary-500 me-2',
            iconCurrent: 'text-primary-500 me-2',
        },
        2: {
            // Minimal Brutalist
            container: 'flex items-center',
            link: 'text-third-600 hover:text-primary-600 font-bold transition-colors',
            current: 'text-third-900 font-black',
            separator: 'text-third-900 mx-2 font-black',
            icon: 'text-primary-600 me-2',
            iconCurrent: 'text-primary-600 me-2',
        },
        3: {
            // Soft Organic
            container: 'flex items-center',
            link: 'text-neutral-600 hover:text-primary-700 transition-colors',
            current: 'text-primary-800 font-semibold',
            separator: 'text-primary-400 mx-2',
            icon: 'text-primary-600 me-2',
            iconCurrent: 'text-primary-700 me-2',
        },
        4: {
            // Glass Morphism
            container: 'flex items-center',
            link: 'text-accent-300 hover:text-primary-400 transition-colors',
            current: 'text-white font-semibold',
            separator: 'text-accent-400 mx-2',
            icon: 'text-primary-400 me-2',
            iconCurrent: 'text-primary-400 me-2',
        },
    };

    const style = designStyles[designOption] || designStyles[1];
    const ChevronIcon = isRTL ? FiChevronLeft : FiChevronRight;

    return (
        <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={style.container}
        >
            {/* Separator (not for first item) */}
            {index > 0 && (
                <span className={style.separator}>
                    <ChevronIcon className="text-sm" />
                </span>
            )}

            {/* Icon */}
            {icon && (
                <span className={isLast ? style.iconCurrent : style.icon}>
                    <DynamicIconLazy
                        icon={icon}
                        size="1em"
                        fallback={<FiHome className="text-sm" />}
                    />
                </span>
            )}

            {/* Content */}
            {!isLast && href ? (
                <Link
                    to={href}
                    className={`${style.link} flex items-center gap-1 text-sm`}
                >
                    {truncateText(label)}
                </Link>
            ) : (
                <span className={`${style.current} flex items-center gap-1 text-sm`}>
                    {truncateText(label)}
                </span>
            )}
        </motion.div>
    );
};

/* ============================================
   OPTION 1: MODERN CINEMATIC BREADCRUMB
   ============================================
   Features:
   - Dark background with bronze accents
   - Subtle separators
   - Editorial typography
   - Smooth animations
*/

export function BreadcrumbOption1({
    items = [],
    isRTL = false,
    showHomeIcon = true,
    showCurrentPageIcon = false,
    maxItems = 5
}) {
    if (!items || items.length === 0) return null;

    // Add home item if enabled
    const breadcrumbItems = showHomeIcon ? [
        { label: 'Home', href: '/', icon: 'Font Awesome/FaHome' },
        ...items
    ] : [...items];

    // Truncate if too many items
    const displayItems = maxItems && breadcrumbItems.length > maxItems
        ? [
            ...breadcrumbItems.slice(0, 1),
            { label: '...', href: null, icon: 'FiGrid' },
            ...breadcrumbItems.slice(-(maxItems - 2))
        ]
        : breadcrumbItems;

    return (
        <nav className="py-6 bg-secondary-900 border-b border-secondary-800" aria-label="Breadcrumb">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center flex-wrap gap-2"
                >
                    {/* Background Accent */}
                    <div className="absolute inset-s-0 h-6 w-1 bg-primary-500" />

                    {/* Breadcrumb Items */}
                    {displayItems.map((item, index) => (
                        <BreadcrumbItem
                            key={index}
                            item={item}
                            isLast={index === displayItems.length - 1}
                            isRTL={isRTL}
                            designOption={1}
                            index={index}
                        />
                    ))}

                    {/* Current Page Icon */}
                    {showCurrentPageIcon && displayItems.length > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ms-3 w-6 h-6 bg-primary-500/20 flex items-center justify-center"
                        >
                            <DynamicIconLazy
                                icon={displayItems[displayItems.length - 1].icon || 'FiMapPin'}
                                size="0.8em"
                                className="text-primary-500"
                            />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </nav>
    );
}

/* ============================================
   OPTION 2: MINIMAL BRUTALIST BREADCRUMB
   ============================================
   Features:
   - Bold typography with thick separators
   - High contrast
   - Geometric precision
   - No background, raw aesthetic
*/

export function BreadcrumbOption2({
    items = [],
    isRTL = false,
    showHomeIcon = true,
    showCurrentPageIcon = false,
    maxItems = 5
}) {
    if (!items || items.length === 0) return null;

    // Add home item if enabled
    const breadcrumbItems = showHomeIcon ? [
        { label: 'HOME', href: '/', icon: 'Font Awesome/FaHome' },
        ...items.map(item => ({
            ...item,
            label: item.label.toUpperCase()
        }))
    ] : [...items.map(item => ({
        ...item,
        label: item.label.toUpperCase()
    }))];

    // Truncate if too many items
    const displayItems = maxItems && breadcrumbItems.length > maxItems
        ? [
            ...breadcrumbItems.slice(0, 1),
            { label: '...', href: null, icon: 'FiGrid' },
            ...breadcrumbItems.slice(-(maxItems - 2))
        ]
        : breadcrumbItems;

    return (
        <nav className="py-8 bg-neutral-50 border-b-4 border-neutral-900" aria-label="Breadcrumb">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center flex-wrap gap-2"
                >
                    {/* Number Badge for Current Page */}
                    {displayItems.length > 0 && (
                        <div className="me-3 w-8 h-8 bg-primary-600 border-4 border-neutral-900 flex items-center justify-center">
                            <span className="text-white text-sm font-black">
                                {displayItems.length}
                            </span>
                        </div>
                    )}

                    {/* Breadcrumb Items */}
                    {displayItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbItem
                                item={item}
                                isLast={index === displayItems.length - 1}
                                isRTL={isRTL}
                                designOption={2}
                                index={index}
                            />

                            {/* Custom Separator */}
                            {index < displayItems.length - 1 && (
                                <span className="text-neutral-900 mx-1">
                                    <FaAngleDoubleRight className="text-xs" />
                                </span>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Current Page Indicator */}
                    {showCurrentPageIcon && displayItems.length > 0 && (
                        <div className="ms-3 w-8 h-8 bg-neutral-900 border-4 border-neutral-900 flex items-center justify-center">
                            <span className="text-neutral-50 text-sm font-black">
                                ▸
                            </span>
                        </div>
                    )}
                </motion.div>
            </div>
        </nav>
    );
}

/* ============================================
   OPTION 3: SOFT ORGANIC BREADCRUMB
   ============================================
   Features:
   - Rounded elements with soft shadows
   - Gradient separators
   - Glass morphism effects
   - Warm, inviting aesthetic
*/

export function BreadcrumbOption3({
    items = [],
    isRTL = false,
    showHomeIcon = true,
    showCurrentPageIcon = true,
    maxItems = 5
}) {
    if (!items || items.length === 0) return null;

    // Add home item if enabled
    const breadcrumbItems = showHomeIcon ? [
        { label: 'Home', href: '/', icon: 'Heroicons 2/HiHome' },
        ...items
    ] : [...items];

    // Truncate if too many items
    const displayItems = maxItems && breadcrumbItems.length > maxItems
        ? [
            ...breadcrumbItems.slice(0, 1),
            { label: '...', href: null, icon: 'Heroicons 2/HiEllipsisHorizontal' },
            ...breadcrumbItems.slice(-(maxItems - 2))
        ]
        : breadcrumbItems;

    return (
        <nav className="py-6 bg-linear-to-r from-primary-50 to-accent-50 border-b border-primary-200" aria-label="Breadcrumb">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center flex-wrap gap-1"
                >
                    {/* Decorative Blob */}
                    <div className="absolute inset-s-4 w-3 h-3 bg-primary-500/30 rounded-full blur-sm" />

                    {/* Breadcrumb Items with Cards */}
                    {displayItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`${index === displayItems.length - 1
                                    ? 'bg-linear-to-r from-primary-600 to-primary-700 text-white'
                                    : 'bg-white/80 text-neutral-700 hover:bg-white'
                                    } backdrop-blur-sm rounded-full px-4 py-2 shadow-sm transition-all`}
                            >
                                <BreadcrumbItem
                                    item={item}
                                    isLast={index === displayItems.length - 1}
                                    isRTL={isRTL}
                                    designOption={3}
                                    index={index}
                                />
                            </motion.div>

                            {/* Gradient Separator */}
                            {index < displayItems.length - 1 && (
                                <div className="w-6 h-px bg-linear-to-r from-primary-400 to-transparent" />
                            )}
                        </React.Fragment>
                    ))}

                    {/* Current Page Badge */}
                    {showCurrentPageIcon && displayItems.length > 0 && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="ms-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-primary-300"
                        >
                            <DynamicIconLazy
                                icon={displayItems[displayItems.length - 1].icon || 'Heroicons 2/HiChevronDoubleRight'}
                                size="0.9em"
                                className="text-primary-700"
                            />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </nav>
    );
}

/* ============================================
   OPTION 4: GLASS MORPHISM BREADCRUMB
   ============================================
   Features:
   - Dark gradient background
   - Glass cards with backdrop blur
   - Subtle glow effects
   - Professional tech aesthetic
*/

export function BreadcrumbOption4({
    items = [],
    isRTL = false,
    showHomeIcon = true,
    showCurrentPageIcon = true,
    maxItems = 5
}) {
    if (!items || items.length === 0) return null;

    // Add home item if enabled
    const breadcrumbItems = showHomeIcon ? [
        { label: 'Home', href: '/', icon: 'Lucide/Home' },
        ...items
    ] : [...items];

    // Truncate if too many items
    const displayItems = maxItems && breadcrumbItems.length > maxItems
        ? [
            ...breadcrumbItems.slice(0, 1),
            { label: '...', href: null, icon: 'Lucide/MoreHorizontal' },
            ...breadcrumbItems.slice(-(maxItems - 2))
        ]
        : breadcrumbItems;

    return (
        <nav className="py-6 bg-linear-to-r from-accent-950/80 via-secondary-900/80 to-accent-950/80 backdrop-blur-sm border-b border-white/10" aria-label="Breadcrumb">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center flex-wrap gap-2"
                >
                    {/* Glowing Dot Indicator */}
                    <div className="relative me-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        <div className="absolute inset-0 w-2 h-2 bg-primary-500 rounded-full animate-ping" />
                    </div>

                    {/* Breadcrumb Items with Glass Cards */}
                    {displayItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                className={`${index === displayItems.length - 1
                                    ? 'bg-linear-to-r from-primary-600/20 to-accent-600/20 border-primary-400/50'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                                    } backdrop-blur-lg rounded-lg px-3 py-2 border transition-all`}
                            >
                                <BreadcrumbItem
                                    item={item}
                                    isLast={index === displayItems.length - 1}
                                    isRTL={isRTL}
                                    designOption={4}
                                    index={index}
                                />
                            </motion.div>

                            {/* Glowing Separator */}
                            {index < displayItems.length - 1 && (
                                <div className="relative w-4">
                                    <div className="w-4 h-px bg-linear-to-r from-primary-500/50 to-accent-500/50" />
                                    <div className="absolute top-1/2 inset-s-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary-400 rounded-full" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Current Page Glow Badge */}
                    {showCurrentPageIcon && displayItems.length > 0 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="ms-3 w-7 h-7 bg-linear-to-r from-primary-500/30 to-accent-500/30 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20"
                        >
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </nav>
    );
}

/* ============================================
   MAIN BREADCRUMB SECTION COMPONENT
   ============================================ */
export function BreadcrumbSection({
    option = 1,
    items = [],
    isRTL = false,
    showHomeIcon = true,
    showCurrentPageIcon = true,
    maxItems = 5,
    className = '',
    // Additional props for specific use cases
    currentPageTitle = '',
    parentPageTitle = '',
    category = '',
    date = '',
    author = '',
    tags = []
}) {
    // Build breadcrumb items from props if not provided directly
    const getBreadcrumbItems = () => {
        if (items && items.length > 0) return items;

        const builtItems = [];

        // Add category if provided
        if (category) {
            builtItems.push({
                label: category,
                href: `/category/${category.toLowerCase()}`,
                icon: 'Lucide/Tag'
            });
        }

        // Add parent page if provided
        if (parentPageTitle) {
            builtItems.push({
                label: parentPageTitle,
                href: `/${parentPageTitle.toLowerCase().replace(/\s+/g, '-')}`,
                icon: 'Lucide/Folder'
            });
        }

        // Add current page
        if (currentPageTitle) {
            builtItems.push({
                label: currentPageTitle,
                href: null,
                icon: 'Lucide/FileText'
            });
        }

        return builtItems;
    };

    const breadcrumbItems = getBreadcrumbItems();

    const components = {
        1: BreadcrumbOption1,
        2: BreadcrumbOption2,
        3: BreadcrumbOption3,
        4: BreadcrumbOption4
    };

    const Component = components[option] || BreadcrumbOption1;

    // If no items, don't render anything
    if (breadcrumbItems.length === 0) return null;

    return (
        <div className={className}>
            <Component
                items={breadcrumbItems}
                isRTL={isRTL}
                showHomeIcon={showHomeIcon}
                showCurrentPageIcon={showCurrentPageIcon}
                maxItems={maxItems}
            />

            {/* Additional Info Bar (for specific options) */}
            {[1, 4].includes(option) && (date || author || tags.length > 0) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${option === 1 ? 'bg-secondary-800' : 'bg-white/5'} border-t ${option === 1 ? 'border-secondary-700' : 'border-white/10'}`}
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                            {date && (
                                <div className={`flex items-center gap-1 ${option === 1 ? 'text-neutral-400' : 'text-accent-300'}`}>
                                    <FiCalendar className="text-xs" />
                                    <span>{date}</span>
                                </div>
                            )}

                            {author && (
                                <div className={`flex items-center gap-1 ${option === 1 ? 'text-neutral-400' : 'text-accent-300'}`}>
                                    <FiUser className="text-xs" />
                                    <span>{author}</span>
                                </div>
                            )}

                            {tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <FiTag className={`text-xs ${option === 1 ? 'text-neutral-400' : 'text-accent-300'}`} />
                                    <div className="flex flex-wrap gap-1">
                                        {tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`px-2 py-0.5 rounded ${option === 1
                                                    ? 'bg-secondary-700 text-neutral-300'
                                                    : 'bg-white/10 text-accent-200'
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Also export individual options for manual usage
/* ============================================
   HELPER COMPONENTS FOR SPECIFIC USE CASES
   ============================================ */

// Property Breadcrumb
export function PropertyBreadcrumb({
    option = 1,
    propertyType = '',
    location = '',
    propertyTitle = '',
    price = '',
    isRTL = false,
    ...props
}) {
    const items = [
        { label: 'Properties', href: '/properties', icon: 'Lucide/Home' },
        ...(propertyType ? [{ label: propertyType, href: `/properties?type=${propertyType.toLowerCase()}`, icon: 'Lucide/Tag' }] : []),
        ...(location ? [{ label: location, href: `/properties?location=${location.toLowerCase()}`, icon: 'Lucide/MapPin' }] : []),
        { label: propertyTitle || 'Property Details', href: null, icon: 'Lucide/FileText' }
    ];

    return (
        <BreadcrumbSection
            option={option}
            items={items}
            isRTL={isRTL}
            showHomeIcon={true}
            showCurrentPageIcon={true}
            {...props}
        />
    );
}

// Blog Breadcrumb
export function BlogBreadcrumb({
    option = 1,
    category = '',
    postTitle = '',
    author = '',
    date = '',
    tags = [],
    isRTL = false,
    ...props
}) {
    const items = [
        { label: 'Blog', href: '/blog', icon: 'Lucide/BookOpen' },
        ...(category ? [{ label: category, href: `/blog/category/${category.toLowerCase()}`, icon: 'Lucide/Tag' }] : []),
        { label: postTitle || 'Blog Post', href: null, icon: 'Lucide/FileText' }
    ];

    return (
        <BreadcrumbSection
            option={option}
            items={items}
            isRTL={isRTL}
            showHomeIcon={true}
            showCurrentPageIcon={true}
            author={author}
            date={date}
            tags={tags}
            {...props}
        />
    );
}

// Service Breadcrumb
export function ServiceBreadcrumb({
    option = 1,
    serviceCategory = '',
    serviceName = '',
    isRTL = false,
    ...props
}) {
    const items = [
        { label: 'Services', href: '/services', icon: 'Lucide/Briefcase' },
        ...(serviceCategory ? [{ label: serviceCategory, href: `/services?category=${serviceCategory.toLowerCase()}`, icon: 'Lucide/Layers' }] : []),
        { label: serviceName || 'Service Details', href: null, icon: 'Lucide/Settings' }
    ];

    return (
        <BreadcrumbSection
            option={option}
            items={items}
            isRTL={isRTL}
            showHomeIcon={true}
            showCurrentPageIcon={true}
            {...props}
        />
    );
}