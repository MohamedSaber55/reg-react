import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
    FiHome, FiGrid, FiLayers, FiDollarSign, FiTrendingUp,
    FiTool, FiPackage, FiMessageSquare, FiImage, FiShare2,
    FiSliders, FiStar, FiUsers, FiLogOut,
    FiChevronDown, FiChevronRight, FiX, FiMail, FiPhone,
    FiHelpCircle, FiMap, FiClock, FiInfo, FiAward, FiMapPin,
    FiBox, FiShoppingBag,
    FiFolder,
    FiCalendar,
    FiCamera,
    FiGlobe
} from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose, onLogout }) {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();

    // Get user data from Redux store
    const { userData, role, isAuthenticated } = useSelector((state) => state.auth);

    const email = userData?.email || '';
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';

    const [propertiesExpanded, setPropertiesExpanded] = useState(false);
    const [contactExpanded, setContactExpanded] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [servicesExpanded, setServicesExpanded] = useState(false);
    const [unitsExpanded, setUnitsExpanded] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [projectsExpanded, setProjectsExpanded] = useState(false);

    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    // Get user's full name or fallback to email or default text
    const getUserDisplayName = () => {
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else if (firstName) {
            return firstName;
        } else if (lastName) {
            return lastName;
        }
        return t('dashboard.layout.adminUser');
    };

    // Get user's initials for avatar fallback
    const getUserInitials = () => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        } else if (firstName) {
            return firstName[0].toUpperCase();
        } else if (email) {
            return email[0].toUpperCase();
        }
        return 'A';
    };

    const allMenuItems = [
        {
            title: t('dashboard.menu.overview'),
            icon: FiHome,
            href: '/dashboard',
            badge: null,
            visible: true

        },
        {
            title: t('dashboard.menu.users'),
            icon: FiUsers,
            href: '/dashboard/users',
            badge: null,
            visible: role !== 'Admin'
        },
        {
            title: t('dashboard.menu.heroSections'),
            icon: FiImage,
            href: '/dashboard/hero-sections',
            badge: null,
            visible: true

        },
        {
            title: t('dashboard.menu.properties'),
            icon: FiGrid,
            href: '/dashboard/properties',
            badge: null,
            visible: true,
            hasDropdown: true,
            dropdownKey: 'properties',
            children: [
                {
                    title: t('dashboard.menu.propertyTypes'),
                    icon: FiLayers,
                    href: '/dashboard/property-types'
                },
                {
                    title: t('dashboard.menu.transactionTypes'),
                    icon: FiDollarSign,
                    href: '/dashboard/transaction-types'
                },
                {
                    title: t('dashboard.menu.propertyStatuses'),
                    icon: FiTrendingUp,
                    href: '/dashboard/property-statuses'
                },
                {
                    title: t('dashboard.menu.finishingLevels'),
                    icon: FiTool,
                    href: '/dashboard/finishing-levels'
                },
                {
                    title: t('dashboard.menu.furnishingStatuses'),
                    icon: FiPackage,
                    href: '/dashboard/furnishing-statuses'
                }
            ]
        },
        {
            title: t('dashboard.menu.projects'),
            icon: FiFolder,
            href: '/dashboard/projects',
            badge: null,
            visible: true,
            hasDropdown: true,
            dropdownKey: 'projects',
            children: [
                {
                    title: t('dashboard.menu.allProjects'),
                    icon: FiFolder,
                    href: '/dashboard/projects'
                },
                {
                    title: t('dashboard.menu.projectStages'),
                    icon: FiCalendar,
                    href: '/dashboard/project-stages'
                },
                {
                    title: t('dashboard.menu.unitModels'),
                    icon: FiHome,
                    href: '/dashboard/unit-models'
                },
                {
                    title: t('dashboard.menu.unitModelImages'),
                    icon: FiCamera,
                    href: '/dashboard/unit-model-images'
                }
            ]
        },
        {
            title: t('dashboard.menu.about'),
            icon: FiInfo,
            href: '/dashboard/about-sections',
            badge: null,
            visible: true,
            hasDropdown: true,
            dropdownKey: 'about',
            children: [
                {
                    title: t('dashboard.menu.aboutSections'),
                    icon: FiInfo,
                    href: '/dashboard/about-sections'
                },
                {
                    title: t('dashboard.menu.aboutValues'),
                    icon: FiAward,
                    href: '/dashboard/about-values'
                }
            ]
        },
        {
            title: t('dashboard.menu.services'),
            icon: FiBox,
            href: '/dashboard/service-sections',
            badge: null,
            visible: true,
            hasDropdown: true,
            dropdownKey: 'services',
            children: [
                {
                    title: t('dashboard.menu.serviceSections'),
                    icon: FiBox,
                    href: '/dashboard/service-sections'
                },
                {
                    title: t('dashboard.menu.serviceItems'),
                    icon: FiPackage,
                    href: '/dashboard/service-items'
                }
            ]
        },
        {
            title: t('dashboard.menu.contact'),
            icon: FiMail,
            href: '/dashboard/contact-page',
            badge: null,
            visible: true,
            hasDropdown: true,
            dropdownKey: 'contact',
            children: [
                {
                    title: t('dashboard.menu.contactPageContent'),
                    icon: FiMail,
                    href: '/dashboard/contact-page'
                },
                {
                    title: t('dashboard.menu.addresses'),
                    icon: FiMapPin,
                    href: '/dashboard/addresses'
                },
                {
                    title: t('dashboard.menu.tickets'),
                    icon: FiMessageSquare,
                    href: '/dashboard/tickets'
                },
                {
                    title: t('dashboard.menu.contactEmails'),
                    icon: FiMail,
                    href: '/dashboard/contact-emails'
                },
                {
                    title: t('dashboard.menu.contactPhones'),
                    icon: FiPhone,
                    href: '/dashboard/contact-phones'
                },
                {
                    title: t('dashboard.menu.businessHours'),
                    icon: FiClock,
                    href: '/dashboard/business-hours'
                }
            ]
        },
        {
            title: t('dashboard.menu.faqs'),
            icon: FiHelpCircle,
            href: '/dashboard/faqs',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.mapSections'),
            icon: FiMap,
            href: '/dashboard/map-sections',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.socialLinks'),
            icon: FiShare2,
            href: '/dashboard/social-links',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.sliders'),
            icon: FiSliders,
            href: '/dashboard/sliders',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.sliderImages'),
            icon: FiImage,
            href: '/dashboard/slider-images',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.testimonials'),
            icon: FiStar,
            href: '/dashboard/testimonials',
            badge: null,
            visible: true
        },
        {
            title: t('dashboard.menu.tracking'),
            href: '/dashboard/tracking',
            icon: FiGlobe,
            visible: true
        },
    ];

    const menuItems = allMenuItems.filter(item => item.visible);

    const isActiveRoute = (href) => {
        if (href === '/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const handleLinkClick = () => {
        onClose?.();
    };

    // Check if any properties-related page is active
    const isPropertiesGroupActive = () => {
        return pathname.startsWith('/dashboard/properties') ||
            pathname.startsWith('/dashboard/property-types') ||
            pathname.startsWith('/dashboard/transaction-types') ||
            pathname.startsWith('/dashboard/property-statuses') ||
            pathname.startsWith('/dashboard/finishing-levels') ||
            pathname.startsWith('/dashboard/furnishing-statuses');
    };

    // Check if any contact-related page is active
    const isContactGroupActive = () => {
        return pathname.startsWith('/dashboard/contact-page') ||
            pathname.startsWith('/dashboard/addresses') ||
            pathname.startsWith('/dashboard/tickets') ||
            pathname.startsWith('/dashboard/contact-emails') ||
            pathname.startsWith('/dashboard/contact-phones') ||
            pathname.startsWith('/dashboard/business-hours');
    };

    // Check if any about-related page is active
    const isAboutGroupActive = () => {
        return pathname.startsWith('/dashboard/about-sections') ||
            pathname.startsWith('/dashboard/about-values');
    };

    // Check if any services-related page is active
    const isServicesGroupActive = () => {
        return pathname.startsWith('/dashboard/service-sections') ||
            pathname.startsWith('/dashboard/service-items');
    };

    // Check if any units-related page is active
    const isUnitsGroupActive = () => {
        return pathname.startsWith('/dashboard/stages') ||
            pathname.startsWith('/dashboard/unit-models') ||
            pathname.startsWith('/dashboard/unit-model-images');
    };

    const isProjectsGroupActive = () => {
        return pathname.startsWith('/dashboard/projects') ||
            pathname.startsWith('/dashboard/project-stages') ||
            pathname.startsWith('/dashboard/unit-models') ||
            pathname.startsWith('/dashboard/unit-model-images');
    };

    useEffect(() => {
        if (isPropertiesGroupActive()) {
            setPropertiesExpanded(true);
        }
        if (isContactGroupActive()) {
            setContactExpanded(true);
        }
        if (isAboutGroupActive()) {
            setAboutExpanded(true);
        }
        if (isServicesGroupActive()) {
            setServicesExpanded(true);
        }
        if (isUnitsGroupActive()) {
            setUnitsExpanded(true);
        }
        if (isProjectsGroupActive()) {
            setProjectsExpanded(true);
        }
    }, [pathname]);

    const getDropdownState = (key) => {
        switch (key) {
            case 'properties': return { expanded: propertiesExpanded, setExpanded: setPropertiesExpanded, isActive: isPropertiesGroupActive };
            case 'contact': return { expanded: contactExpanded, setExpanded: setContactExpanded, isActive: isContactGroupActive };
            case 'about': return { expanded: aboutExpanded, setExpanded: setAboutExpanded, isActive: isAboutGroupActive };
            case 'services': return { expanded: servicesExpanded, setExpanded: setServicesExpanded, isActive: isServicesGroupActive };
            case 'units': return { expanded: unitsExpanded, setExpanded: setUnitsExpanded, isActive: isUnitsGroupActive };
            case 'projects': return { expanded: projectsExpanded, setExpanded: setProjectsExpanded, isActive: isUnitsGroupActive };
            default: return { expanded: false, setExpanded: () => { }, isActive: () => false };
        }
    };

    return (
        <aside
            className={`fixed top-0 inset-s-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
                } lg:translate-x-0 bg-neutral-50   border-e border-neutral-400  `}
        >
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-400">
                    <Link to="/dashboard" className="flex items-center gap-3" onClick={handleLinkClick}>
                        <img
                            src="/logo.png"
                            alt={t('dashboard.layout.logoAlt')}
                            className="h-12 object-contain"
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-third-900   hover:bg-neutral-100   p-2 rounded-lg transition-colors"
                        aria-label={t('dashboard.layout.closeSidebar')}
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.href}>
                                {item.hasDropdown ? (
                                    <div>
                                        {(() => {
                                            const { expanded, setExpanded, isActive } = getDropdownState(item.dropdownKey);
                                            return (
                                                <>
                                                    <button
                                                        onClick={() => setExpanded(!expanded)}
                                                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${isActive()
                                                            ? 'bg-primary-50   text-primary-600  font-semibold'
                                                            : 'text-third-500   hover:bg-neutral-100   hover:text-third-900  '
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="w-5 h-5" />
                                                            <span>{item.title}</span>
                                                        </div>
                                                        {isRTL ? (
                                                            <FiChevronRight
                                                                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
                                                            />
                                                        ) : (
                                                            <FiChevronDown
                                                                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                                            />
                                                        )}
                                                    </button>

                                                    <div
                                                        className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}
                                                    >
                                                        <ul className="mt-1 space-y-1 ms-4">
                                                            {/* Add "All" link for properties dropdown */}
                                                            {item.dropdownKey === 'properties' && (
                                                                <li>
                                                                    <Link
                                                                        to={item.href}
                                                                        onClick={handleLinkClick}
                                                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${isActiveRoute(item.href) && pathname === item.href
                                                                            ? 'bg-primary-50   text-primary-600  font-semibold'
                                                                            : 'text-third-500   hover:bg-neutral-100   hover:text-third-900  '
                                                                            }`}
                                                                    >
                                                                        <item.icon className="w-4 h-4" />
                                                                        <span>{t('dashboard.menu.allProperties')}</span>
                                                                    </Link>
                                                                </li>
                                                            )}
                                                            {item.children?.map((child) => (
                                                                <li key={child.href}>
                                                                    <Link
                                                                        to={child.href}
                                                                        onClick={handleLinkClick}
                                                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${isActiveRoute(child.href)
                                                                            ? 'bg-primary-50   text-primary-600  font-semibold'
                                                                            : 'text-third-500   hover:bg-neutral-100   hover:text-third-900  '
                                                                            }`}
                                                                    >
                                                                        <child.icon className="w-4 h-4" />
                                                                        <span>{child.title}</span>
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    // Regular menu item
                                    <Link
                                        to={item.href}
                                        onClick={handleLinkClick}
                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${isActiveRoute(item.href)
                                            ? 'bg-primary-50   text-primary-600  font-semibold'
                                            : 'text-third-500   hover:bg-neutral-100   hover:text-third-900  '
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-error-500 text-white text-xs font-bold rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-neutral-400">
                    <div className="relative">
                        <button
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-100   transition-all"
                            aria-label={t('dashboard.layout.userMenu')}
                        >
                            {/* User Avatar - using initials as fallback */}
                            <div className="w-10 h-10 rounded-full bg-primary-500   flex items-center justify-center text-white font-semibold">
                                {getUserInitials()}
                            </div>
                            <div className="flex-1 text-start">
                                <p className="text-xs font-semibold text-third-900">
                                    {getUserDisplayName()}
                                </p>
                                <p className="text-xs text-third-500   truncate">
                                    {email || 'admin@dreamhome.com'}
                                </p>
                            </div>
                            <FiChevronDown className="w-4 h-4 text-third-500" />
                        </button>

                        {profileMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setProfileMenuOpen(false)}
                                />
                                <div className="absolute bottom-full inset-s-0 inset-e-0 mb-2 bg-neutral-50   border border-neutral-400   rounded-xl shadow-lg py-2 z-50">
                                    <Link
                                        to="/dashboard/profile"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-third-900   hover:bg-neutral-100   transition-colors"
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            handleLinkClick();
                                        }}
                                    >
                                        <FiUsers className="w-4 h-4" />
                                        {t('dashboard.layout.profile')}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            onLogout?.();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-500 hover:bg-error-50   transition-colors"
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        {t('dashboard.layout.logout')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}