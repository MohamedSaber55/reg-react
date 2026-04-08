// components/common/IconPicker.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

// Import ALL React Icons sets
import * as Fa from 'react-icons/fa';
import * as Fa6 from 'react-icons/fa6';
import * as Md from 'react-icons/md';
import * as Io from 'react-icons/io5';
import * as Hi from 'react-icons/hi2';
import * as HiOutline from 'react-icons/hi';
import * as Si from 'react-icons/si';
import * as Ti from 'react-icons/ti';
import * as Go from 'react-icons/go';
import * as Fi from 'react-icons/fi';
import * as Gi from 'react-icons/gi';
import * as Wi from 'react-icons/wi';
import * as Di from 'react-icons/di';
import * as Ai from 'react-icons/ai';
import * as Bs from 'react-icons/bs';
import * as Ri from 'react-icons/ri';
import * as Fc from 'react-icons/fc';
import * as Gr from 'react-icons/gr';
import * as Im from 'react-icons/im';
import * as Bi from 'react-icons/bi';
import * as Cg from 'react-icons/cg';
import * as Vsc from 'react-icons/vsc';
import * as Tb from 'react-icons/tb';
import * as Tfi from 'react-icons/tfi';
import * as Rx from 'react-icons/rx';
import * as Pi from 'react-icons/pi';
import * as Lu from 'react-icons/lu';
import * as Ci from 'react-icons/ci';
import * as Lia from 'react-icons/lia';
import * as Sl from 'react-icons/sl';

// Define all icon sets with metadata
const ICON_SETS = [
    { name: 'Font Awesome 6', icons: Fa6, prefix: 'Fa', color: '#528DD7', category: 'Popular', package: 'fa6' },
    { name: 'Font Awesome', icons: Fa, prefix: 'Fa', color: '#528DD7', category: 'Popular', package: 'fa' },
    { name: 'Material Design', icons: Md, prefix: 'Md', color: '#FF5722', category: 'Popular', package: 'md' },
    { name: 'Heroicons 2', icons: Hi, prefix: 'Hi', color: '#3B82F6', category: 'Popular', package: 'hi2' },
    { name: 'Heroicons', icons: HiOutline, prefix: 'Hi', color: '#3B82F6', category: 'Popular', package: 'hi' },
    { name: 'Ionicons 5', icons: Io, prefix: 'Io', color: '#3880FF', category: 'Popular', package: 'io5' },
    { name: 'Feather', icons: Fi, prefix: 'Fi', color: '#4A5568', category: 'Popular', package: 'fi' },
    { name: 'Lucide', icons: Lu, prefix: 'Lu', color: '#3B82F6', category: 'Popular', package: 'lu' },
    { name: 'Simple Icons', icons: Si, prefix: 'Si', color: '#000000', category: 'Brands', package: 'si' },
    { name: 'Bootstrap', icons: Bs, prefix: 'Bs', color: '#7952B3', category: 'UI Frameworks', package: 'bs' },
    { name: 'Ant Design', icons: Ai, prefix: 'Ai', color: '#1890FF', category: 'UI Frameworks', package: 'ai' },
    { name: 'Remix Icon', icons: Ri, prefix: 'Ri', color: '#25B864', category: 'UI Frameworks', package: 'ri' },
    { name: 'Radix UI', icons: Rx, prefix: 'Rx', color: '#6B7280', category: 'UI Frameworks', package: 'rx' },
    { name: 'Tabler Icons', icons: Tb, prefix: 'Tb', color: '#206BC4', category: 'UI Frameworks', package: 'tb' },
    { name: 'Phosphor', icons: Pi, prefix: 'Pi', color: '#60A5FA', category: 'UI Frameworks', package: 'pi' },
    { name: 'Google Material', icons: Fc, prefix: 'Fc', color: '#4285F4', category: 'Google', package: 'fc' },
    { name: 'Grommet', icons: Gr, prefix: 'Gr', color: '#7D4CDB', category: 'UI Frameworks', package: 'gr' },
    { name: 'Devicon', icons: Di, prefix: 'Di', color: '#333333', category: 'Development', package: 'di' },
    { name: 'Octicons', icons: Go, prefix: 'Go', color: '#24292E', category: 'Development', package: 'go' },
    { name: 'VS Code', icons: Vsc, prefix: 'Vsc', color: '#007ACC', category: 'Development', package: 'vsc' },
    { name: 'Game Icons', icons: Gi, prefix: 'Gi', color: '#FF6B6B', category: 'Games', package: 'gi' },
    { name: 'Weather Icons', icons: Wi, prefix: 'Wi', color: '#4A90E2', category: 'Weather', package: 'wi' },
    { name: 'Themify', icons: Ti, prefix: 'Ti', color: '#FF4081', category: 'UI', package: 'ti' },
    { name: 'Circum', icons: Ci, prefix: 'Ci', color: '#6B7280', category: 'UI', package: 'ci' },
    { name: 'Linearicons', icons: Lia, prefix: 'Lia', color: '#3B82F6', category: 'UI', package: 'lia' },
    { name: 'Bytesize', icons: Tfi, prefix: 'Tfi', color: '#4A5568', category: 'UI', package: 'tfi' },
    { name: 'Core UI', icons: Cg, prefix: 'Cg', color: '#6B7280', category: 'UI', package: 'cg' },
    { name: 'BoxIcons', icons: Bi, prefix: 'Bi', color: '#3B82F6', category: 'UI', package: 'bi' },
    { name: 'IcoMoon', icons: Im, prefix: 'Im', color: '#8257E5', category: 'UI', package: 'im' },
    { name: 'Eva Icons', icons: Sl, prefix: 'Sl', color: '#7C3AED', category: 'UI', package: 'sl' },
];

// Categories for filtering
const CATEGORIES = [
    'All',
    'Popular',
    'UI Frameworks',
    'Brands',
    'Development',
    'Games',
    'Weather',
    'Google',
    'UI'
];

// Parse icon value from various formats
const parseIconValue = (value, sets = ICON_SETS) => {
    if (!value) return { displayValue: '', iconComponent: null, setName: '', iconName: '' };

    // Format: "Font Awesome/FaHeart"
    if (value.includes('/')) {
        const [setName, iconName] = value.split('/');
        const set = sets.find(s => s.name === setName);
        if (set && set.icons[iconName]) {
            return {
                displayValue: value,
                iconComponent: set.icons[iconName],
                setName,
                iconName
            };
        }
    }

    // Try to find in any set
    for (const set of sets) {
        const IconComponent = set.icons[value];
        if (IconComponent) {
            return {
                displayValue: value,
                iconComponent: IconComponent,
                setName: set.name,
                iconName: value
            };
        }
    }

    return { displayValue: value, iconComponent: null, setName: '', iconName: '' };
};

export default function IconPicker({ value, onChange, error, label, helperText }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSet, setSelectedSet] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [page, setPage] = useState(1);
    const itemsPerPage = 200;
    const searchInputRef = useRef(null);

    // Parse current value
    const currentIcon = useMemo(() => parseIconValue(value), [value]);

    // Focus search input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Filter and paginate icons
    const filteredIcons = useMemo(() => {
        const allIcons = [];

        ICON_SETS.forEach(set => {
            // Filter by category
            if (selectedCategory !== 'All' && set.category !== selectedCategory) {
                return;
            }

            // Filter by selected set
            if (selectedSet !== 'All' && set.name !== selectedSet) {
                return;
            }

            Object.entries(set.icons).forEach(([name, IconComponent]) => {
                // Filter by search term
                const displayName = name.replace(set.prefix, '').replace(/([A-Z])/g, ' $1').trim();
                const searchLower = searchTerm.toLowerCase();

                if (
                    searchTerm === '' ||
                    name.toLowerCase().includes(searchLower) ||
                    displayName.toLowerCase().includes(searchLower)
                ) {
                    allIcons.push({
                        name,
                        component: IconComponent,
                        displayName,
                        setName: set.name,
                        prefix: set.prefix,
                        color: set.color,
                        category: set.category,
                        package: set.package
                    });
                }
            });
        });

        // Sort by relevance when searching
        if (searchTerm) {
            allIcons.sort((a, b) => {
                const aStartsWith = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
                const bStartsWith = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.displayName.localeCompare(b.displayName);
            });
        }

        return allIcons;
    }, [searchTerm, selectedSet, selectedCategory]);

    // Paginate icons
    const paginatedIcons = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredIcons.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredIcons, page]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);

    // Handle icon selection
    const handleIconSelect = (icon) => {
        // Format: "Set Name/IconName"
        const formattedValue = `${icon.setName}/${icon.name}`;
        onChange(formattedValue);
        setIsOpen(false);
        setPage(1);
        setSearchTerm('');
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSet('All');
        setSelectedCategory('All');
        setPage(1);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-third-900">
                    {label}
                </label>
            )}

            {/* Icon Preview and Input */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className={`
                        flex items-center gap-2 px-3 py-2 border rounded-lg 
                        ${error ? 'border-error' : 'border-neutral-400  '}
                        hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                        bg-white  
                        transition-colors duration-200 shrink-0
                    `}
                >
                    {currentIcon.iconComponent ? (
                        <>
                            <currentIcon.iconComponent className="h-5 w-5" />
                            <span className="text-sm text-third-900   max-w-37.5 truncate">
                                {currentIcon.iconName}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-third-500">
                            {t('dashboard.forms.selectIcon')}
                        </span>
                    )}
                </button>

                {/* Input for manual entry or display */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Font Awesome/FaHeart or FaHeart"
                        className={`
                            w-full px-3 py-2 border rounded-lg
                            ${error ? 'border-error' : 'border-neutral-400  '}
                            focus:outline-none focus:ring-2 focus:ring-primary/20
                            bg-white   text-third-900  
                        `}
                    />
                    {currentIcon.setName && (
                        <div className="absolute inset-e-2 top-1/2 transform -translate-y-1/2">
                            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100   text-third-500">
                                {currentIcon.setName}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Icon Picker Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white   rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-400">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {t('dashboard.forms.selectIcon')}
                                    </h3>
                                    <p className="text-sm text-third-500">
                                        {filteredIcons.length.toLocaleString()} icons available
                                        {value && (
                                            <span className="ms-2">
                                                • Selected: <code className="bg-neutral-100   px-2 py-1 rounded">
                                                    {value}
                                                </code>
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-neutral-100   rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute inset-s-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-third-500" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={t('dashboard.forms.searchIcons')}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full ps-10 pe-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-e-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-100   rounded-full"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-2">
                                {/* Category Filter */}
                                <div className="flex flex-wrap gap-1">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setPage(1);
                                            }}
                                            className={`
                                                px-3 py-1 rounded-full text-sm whitespace-nowrap
                                                ${selectedCategory === category
                                                    ? 'bg-primary text-white'
                                                    : 'bg-neutral-100   text-third-900  '
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Icon Set Filter */}
                                <select
                                    value={selectedSet}
                                    onChange={(e) => {
                                        setSelectedSet(e.target.value);
                                        setPage(1);
                                    }}
                                    className="px-3 py-1 rounded-lg border bg-white   text-third-900"
                                >
                                    <option value="All">All Icon Sets</option>
                                    {ICON_SETS.map((set) => (
                                        <option key={set.name} value={set.name}>
                                            {set.name}
                                        </option>
                                    ))}
                                </select>

                                {/* View Mode Toggle */}
                                <div className="flex ms-auto gap-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-neutral-200  ' : 'hover:bg-neutral-100  '}`}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-neutral-200  ' : 'hover:bg-neutral-100  '}`}
                                    >
                                        <List className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Icons Display */}
                        <div className="flex-1 overflow-auto p-4">
                            {paginatedIcons.length > 0 ? (
                                <>
                                    {/* Grid View */}
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                                            {paginatedIcons.map((icon) => (
                                                <button
                                                    key={`${icon.setName}-${icon.name}`}
                                                    onClick={() => handleIconSelect(icon)}
                                                    className={`
                                                        flex flex-col items-center justify-center p-2 rounded-lg 
                                                        hover:bg-neutral-100   
                                                        ${value === `${icon.setName}/${icon.name}` ? 'bg-primary/10 border border-primary' : ''}
                                                        transition-colors duration-200 group relative
                                                    `}
                                                    title={`${icon.displayName} (${icon.setName})`}
                                                >
                                                    <div
                                                        className="h-6 w-6 mb-1 flex items-center justify-center"
                                                        style={{ color: icon.color }}
                                                    >
                                                        <icon.component className="h-full w-full" />
                                                    </div>
                                                    <span className="text-xs text-center text-third-500   truncate w-full">
                                                        {icon.displayName}
                                                    </span>
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="absolute -top-8 inset-s-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            {icon.setName}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        /* List View */
                                        <div className="space-y-1">
                                            {paginatedIcons.map((icon) => (
                                                <button
                                                    key={`${icon.setName}-${icon.name}`}
                                                    onClick={() => handleIconSelect(icon)}
                                                    className={`
                                                        flex items-center gap-3 p-3 rounded-lg w-full
                                                        hover:bg-neutral-100   
                                                        ${value === `${icon.setName}/${icon.name}` ? 'bg-primary/10 border border-primary' : ''}
                                                        transition-colors duration-200
                                                    `}
                                                >
                                                    <div
                                                        className="h-5 w-5 shrink-0"
                                                        style={{ color: icon.color }}
                                                    >
                                                        <icon.component className="h-full w-full" />
                                                    </div>
                                                    <div className="flex-1 text-start">
                                                        <div className="font-medium">{icon.displayName}</div>
                                                        <div className="text-xs text-third-500">
                                                            {icon.name}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-200">
                                                        {icon.setName}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-400">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100   disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </button>
                                            <div className="text-sm text-third-500">
                                                Page {page} of {totalPages}
                                                <span className="mx-2">•</span>
                                                {((page - 1) * itemsPerPage + 1).toLocaleString()} - {Math.min(page * itemsPerPage, filteredIcons.length).toLocaleString()} of {filteredIcons.length.toLocaleString()} icons
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100   disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-12 h-12 bg-neutral-100   rounded-full flex items-center justify-center mb-4">
                                        <Search className="h-6 w-6 text-third-500" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-2">
                                        {t('dashboard.forms.noIconsFound')}
                                    </h4>
                                    <p className="text-third-500   mb-4">
                                        Try different keywords or filters
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-neutral-400">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="text-sm text-third-500">
                                    <p>
                                        <strong>Tip:</strong> The icon picker returns icons in the format "Set Name/IconName"
                                    </p>
                                    <p className="mt-1">
                                        This format is automatically parsed by DynamicIconLazy
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            onChange('');
                                            setIsOpen(false);
                                        }}
                                        className="px-4 py-2 border border-neutral-400   rounded-lg hover:bg-neutral-100"
                                    >
                                        Clear Icon
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-neutral-100   rounded-lg hover:bg-neutral-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {helperText && !error && (
                <p className="text-xs text-third-500">
                    {helperText}
                </p>
            )}
            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
        </div>
    );
}