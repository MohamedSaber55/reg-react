import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export default function Breadcrumb({ items }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-third-500 mb-6">
            <Link
                to="/"
                className="flex items-center hover:text-primary-600 transition-colors"
            >
                <FiHome className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <FiChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-third-900 font-medium">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
// 'use client';

// import React from 'react';
// import {Link} from 'react-router-dom';
// import {useLocation} from 'react-router-dom';
// import { FiHome, FiChevronRight } from 'react-icons/fi';
// import { useTranslation } from 'react-i18next';

// export const Breadcrumbs = ({ items, className = '' }) => {
//     const { t } = useTranslation();
//     const { pathname } = useLocation();

//     const breadcrumbItems = items || generateBreadcrumbs(pathname);

//     return (
//         <nav
//             aria-label="Breadcrumb"
//             className={`flex items-center gap-2 ${className}`}
//         >
//             <ol className="flex items-center gap-2 flex-wrap">
//                 {/* Home Link */}
//                 <li>
//                     <Link
//                         to="/"
//                         className="flex items-center gap-1.5 px-3 py-1.5 text-third-500   hover:text-primary-600   hover:bg-primary-50   rounded-lg transition-all duration-200 group"
//                     >
//                         <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform" />
//                         <span className="text-sm font-medium hidden sm:inline">{t('common.home')}</span>
//                     </Link>
//                 </li>

//                 {/* Breadcrumb Items */}
//                 {breadcrumbItems.map((item, index) => {
//                     const isLast = index === breadcrumbItems.length - 1;

//                     return (
//                         <li key={item.href} className="flex items-center gap-2">
//                             {/* Separator */}
//                             <FiChevronRight className="w-4 h-4 text-neutral-200" />

//                             {/* Breadcrumb Link or Text */}
//                             {isLast ? (
//                                 <span className="px-3 py-1.5 text-sm font-medium text-third-900   bg-primary-50   rounded-lg">
//                                     {item.label}
//                                 </span>
//                             ) : (
//                                 <Link
//                                     to={item.href}
//                                     className="px-3 py-1.5 text-sm font-medium text-third-500   hover:text-primary-600   hover:bg-primary-50   rounded-lg transition-all duration-200"
//                                 >
//                                     {item.label}
//                                 </Link>
//                             )}
//                         </li>
//                     );
//                 })}
//             </ol>
//         </nav>
//     );
// };

// // Helper function to generate breadcrumbs from pathname
// function generateBreadcrumbs(pathname) {
//     // Remove leading and trailing slashes, split by '/'
//     const paths = pathname.split('/').filter(Boolean);

//     const breadcrumbs = paths.map((path, index) => {
//         // Build the href by joining paths up to current index
//         const href = '/' + paths.slice(0, index + 1).join('/');

//         // Format label: capitalize first letter, replace hyphens with spaces
//         const label = path
//             .split('-')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');

//         return { href, label };
//     });

//     return breadcrumbs;
// }

// // Compact version for smaller spaces
// export const BreadcrumbsCompact = ({ items, className = '' }) => {
//     const { pathname } = useLocation();
//     const breadcrumbItems = items || generateBreadcrumbs(pathname);

//     return (
//         <nav aria-label="Breadcrumb" className={`${className}`}>
//             <ol className="flex items-center gap-1.5 text-sm">
//                 {/* Home Icon */}
//                 <li>
//                     <Link
//                         to="/"
//                         className="text-third-500   hover:text-primary-600   transition-colors"
//                     >
//                         <FiHome className="w-4 h-4" />
//                     </Link>
//                 </li>

//                 {breadcrumbItems.map((item, index) => {
//                     const isLast = index === breadcrumbItems.length - 1;

//                     return (
//                         <li key={item.href} className="flex items-center gap-1.5">
//                             <FiChevronRight className="w-3.5 h-3.5 text-third-500   opacity-50" />

//                             {isLast ? (
//                                 <span className="text-third-900   font-medium">
//                                     {item.label}
//                                 </span>
//                             ) : (
//                                 <Link
//                                     to={item.href}
//                                     className="text-third-500   hover:text-primary-600   transition-colors"
//                                 >
//                                     {item.label}
//                                 </Link>
//                             )}
//                         </li>
//                     );
//                 })}
//             </ol>
//         </nav>
//     );
// };

// // Dropdown version for mobile (shows only current page with dropdown)
// export const BreadcrumbsDropdown = ({ items, className = '' }) => {
//     const { pathname } = useLocation();
//     const breadcrumbItems = items || generateBreadcrumbs(pathname);
//     const [isOpen, setIsOpen] = React.useState(false);

//     if (breadcrumbItems.length === 0) return null;

//     const currentItem = breadcrumbItems[breadcrumbItems.length - 1];

//     return (
//         <div className={`relative ${className}`}>
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-third-900   bg-neutral-50   border border-neutral-400   rounded-lg hover:bg-neutral-100   transition-colors"
//             >
//                 <FiHome className="w-4 h-4" />
//                 <span className="max-w-37.5 truncate">{currentItem.label}</span>
//                 <FiChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
//             </button>

//             {isOpen && (
//                 <>
//                     {/* Backdrop */}
//                     <div
//                         className="fixed inset-0 z-40"
//                         onClick={() => setIsOpen(false)}
//                     />

//                     {/* Dropdown */}
//                     <div className="absolute top-full inset-s-0 mt-2 w-64 bg-neutral-50   border border-neutral-400   rounded-xl shadow-lg py-2 z-50 animate-fade-in">
//                         {/* Home */}
//                         <Link
//                             to="/"
//                             onClick={() => setIsOpen(false)}
//                             className="flex items-center gap-2 px-4 py-2 text-sm text-third-500   hover:text-primary-600   hover:bg-primary-50   transition-colors"
//                         >
//                             <FiHome className="w-4 h-4" />
//                             <span>Home</span>
//                         </Link>

//                         {/* Divider */}
//                         <div className="my-1 border-t border-neutral-400" />

//                         {/* Breadcrumb Items */}
//                         {breadcrumbItems.map((item, index) => {
//                             const isLast = index === breadcrumbItems.length - 1;

//                             return (
//                                 <Link
//                                     key={item.href}
//                                     to={item.href}
//                                     onClick={() => setIsOpen(false)}
//                                     className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${isLast
//                                         ? 'text-primary-600  bg-primary-50   font-medium'
//                                         : 'text-third-500   hover:text-primary-600   hover:bg-primary-50  '
//                                         }`}
//                                     style={{ paddingLeft: `${(index + 1) * 12 + 16}px` }}
//                                 >
//                                     {item.label}
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };